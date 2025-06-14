const mongoose = require('mongoose');
const College = require('../models/College');
require('dotenv').config();

const colleges = [
  {
    name: "Stanford University",
    location: "Stanford, CA",
    description: "Leading research university with strong engineering and business programs.",
    website: "https://stanford.edu",
    establishedYear: 1885
  },
  {
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, MA", 
    description: "World-renowned institute for technology and innovation.",
    website: "https://mit.edu",
    establishedYear: 1861
  },
  {
    name: "University of California, Berkeley",
    location: "Berkeley, CA",
    description: "Public research university known for academic excellence.",
    website: "https://berkeley.edu",
    establishedYear: 1868
  },
  {
    name: "Harvard University",
    location: "Cambridge, MA",
    description: "Prestigious Ivy League university with diverse academic programs.",
    website: "https://harvard.edu",
    establishedYear: 1636
  },
  {
    name: "Carnegie Mellon University",
    location: "Pittsburgh, PA",
    description: "Leading university in computer science and engineering.",
    website: "https://cmu.edu",
    establishedYear: 1900
  }
];

const seedColleges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing colleges
    await College.deleteMany({});
    console.log('Cleared existing colleges');

    // Insert new colleges
    const insertedColleges = await College.insertMany(colleges);
    console.log(`Inserted ${insertedColleges.length} colleges`);

    console.log('College seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding colleges:', error);
    process.exit(1);
  }
};

seedColleges();