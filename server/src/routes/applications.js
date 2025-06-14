const express = require('express');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply to job (student only)
router.post('/', auth, [
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('coverLetter').optional().trim()
], async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can apply to jobs' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { jobId, coverLetter, resume } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId).populate('college');
    if (!job || !job.isActive || job.deadline < new Date()) {
      return res.status(400).json({ message: 'Job not available for application' });
    }

    // Check if student belongs to the same college as the job
    const student = await require('../models/User').findById(req.user.userId);
    if (!job.college._id.equals(student.college)) {
      return res.status(403).json({ message: 'You can only apply to jobs from your college' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      student: req.user.userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Create application
    const application = new Application({
      job: jobId,
      student: req.user.userId,
      coverLetter,
      resume
    });

    await application.save();

    // Increment application count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationCount: 1 }
    });

    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title description deadline')
      .populate('student', 'name email');

    res.status(201).json({
      message: 'Application submitted successfully',
      application: populatedApplication
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's applications (student only)
router.get('/my-applications', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({ student: req.user.userId })
      .populate('job', 'title description location deadline salary jobType')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for admin's jobs
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Verify admin owns this job
    const job = await Job.findById(req.params.jobId);
    if (!job || !job.postedBy.equals(req.user.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('student', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('job');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify admin owns the job
    if (!application.job.postedBy.equals(req.user.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    application.status = status;
    await application.save();

    res.json({ message: 'Application status updated successfully', application });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;