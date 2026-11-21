const express = require('express');
const { searchJobs } = require('../controllers/jobController');

const router = express.Router();

// GET /api/v1/jobs/search?role=backend+developer
router.get('/search', searchJobs);

module.exports = router;
