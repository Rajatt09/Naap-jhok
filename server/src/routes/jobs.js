const express = require('express');
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get jobs (students see only their college jobs, admins see their posted jobs)
router.get('/', auth, async (req, res) => {
  try {
    const { search, jobType, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const user = req.user;

    let query = {};

    if (user.role === 'student') {
      // Students see only jobs from their college
      const userDoc = await require('../models/User').findById(user.userId);
      query.college = userDoc.college;
      query.isActive = true;
      query.deadline = { $gte: new Date() }; // Only active jobs with future deadlines
    } else if (user.role === 'admin') {
      // Admins see only jobs they posted
      query.postedBy = user.userId;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Add job type filter
    if (jobType && jobType !== 'all') {
      query.jobType = jobType;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const jobs = await Job.find(query)
      .populate('college', 'name location')
      .populate('postedBy', 'name email')
      .sort(sortOptions)
      .limit(50);

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('college', 'name location description')
      .populate('postedBy', 'name email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if student can view this job (only from their college)
    if (req.user.role === 'student') {
      const userDoc = await require('../models/User').findById(req.user.userId);
      if (!job.college._id.equals(userDoc.college)) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (admin only)
router.post('/', [auth, adminAuth], [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('deadline').isISO8601().withMessage('Valid deadline is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get admin's college
    const admin = await require('../models/User').findById(req.user.userId);
    
    const job = new Job({
      ...req.body,
      college: admin.college,
      postedBy: req.user.userId
    });

    await job.save();
    
    const populatedJob = await Job.findById(job._id)
      .populate('college', 'name location')
      .populate('postedBy', 'name email');

    res.status(201).json(populatedJob);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update job (admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if admin owns this job
    if (!job.postedBy.equals(req.user.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('college', 'name location');

    res.json(updatedJob);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete job (admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if admin owns this job
    if (!job.postedBy.equals(req.user.userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;