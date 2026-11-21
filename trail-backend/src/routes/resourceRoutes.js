const express = require('express');
const {
  listResources,
  getResource,
  getBookmarks,
  toggleBookmark,
} = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/bookmarks', protect, getBookmarks);
router.post('/bookmarks/:resourceId', protect, toggleBookmark);
router.get('/', listResources);
router.get('/:id', getResource);

module.exports = router;
