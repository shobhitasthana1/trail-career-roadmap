const express = require('express');
const {
  getProgress,
  updateSkillStatus,
  deleteSkillFromProgress,
  restoreSkillToProgress,
  resetSkillsProgress,
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/:roadmapSlug', getProgress);
router.patch('/:roadmapSlug/skills/:skillId', updateSkillStatus);
router.delete('/:roadmapSlug/skills/:skillId', deleteSkillFromProgress);
router.post('/:roadmapSlug/skills/:skillId/restore', restoreSkillToProgress);
router.post('/:roadmapSlug/reset-skills', resetSkillsProgress);

module.exports = router;
