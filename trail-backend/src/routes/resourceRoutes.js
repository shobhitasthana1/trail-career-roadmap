const express = require('express');
const { listResources, getResource } = require('../controllers/resourceController');

const router = express.Router();

// GET /api/v1/resources?skillSlug=nodejs
router.get('/', listResources);

// GET /api/v1/resources/:id
router.get('/:id', getResource);

module.exports = router;
