const express = require('express');
const { getProgress, updateSkillStatus } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All progress routes require authentication
router.use(protect);

// GET   /api/v1/progress/:roadmapSlug
router.get('/:roadmapSlug', getProgress);

// PATCH /api/v1/progress/:roadmapSlug/skills/:skillId
router.patch('/:roadmapSlug/skills/:skillId', updateSkillStatus);

module.exports = router;
