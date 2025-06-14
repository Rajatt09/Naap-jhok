const express = require('express');
const College = require('../models/College');

const router = express.Router();

// Get all colleges
router.get('/', async (req, res) => {
  try {
    const colleges = await College.find()
      .select('name location description')
      .sort({ name: 1 });
    
    res.json(colleges);
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get college by ID
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.json(college);
  } catch (error) {
    console.error('Get college error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;