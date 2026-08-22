const express = require('express');
const router = express.Router();
const { getBookmarks, createBookmark, deleteBookmark, searchBookmarks } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');
const { validateBookmark } = require('../validators/bookmarkValidator');

// All bookmark routes are protected (need JWT token)
router.use(protect);

router.get('/', getBookmarks);                          // GET    /api/bookmarks
router.post('/', validateBookmark, createBookmark);     // POST   /api/bookmarks
router.delete('/:id', deleteBookmark);                  // DELETE /api/bookmarks/:id
router.get('/search', searchBookmarks);                 // GET    /api/bookmarks/search?q=keyword

module.exports = router;