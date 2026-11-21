const express = require('express');
const {
  listRoadmapsHandler,
  getRoadmapHandler,
  generateRoadmapHandler,
  exportRoadmapHandler,
} = require('../controllers/roadmapController');
const { saveRoadmap, unsaveRoadmap, getSavedRoadmaps } = require('../controllers/roadmapSaveController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET  /api/v1/roadmaps
router.get('/', listRoadmapsHandler);

// GET  /api/v1/roadmaps/saved  ← must come BEFORE /:slug
router.get('/saved', protect, getSavedRoadmaps);

// POST /api/v1/roadmaps/generate  ← must come BEFORE /:slug
router.post('/generate', generateRoadmapHandler);

// GET  /api/v1/roadmaps/:slug
router.get('/:slug', getRoadmapHandler);

// GET  /api/v1/roadmaps/:slug/export-data
router.get('/:slug/export-data', exportRoadmapHandler);

// POST   /api/v1/roadmaps/:slug/save
router.post('/:slug/save', protect, saveRoadmap);

// DELETE /api/v1/roadmaps/:slug/save
router.delete('/:slug/save', protect, unsaveRoadmap);

module.exports = router;

