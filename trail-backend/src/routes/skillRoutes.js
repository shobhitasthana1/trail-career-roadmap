const express = require('express');
const { analyzeSkills } = require('../controllers/skillController');
const { listSkills, roleMatch } = require('../controllers/skillController');

const router = express.Router();

// GET  /api/v1/skills
router.get('/', listSkills);

// GET  /api/v1/skills/analyze?role=backend+developer
router.get('/analyze', analyzeSkills);

// POST /api/v1/skills/role-match
router.post('/role-match', roleMatch);

module.exports = router;
