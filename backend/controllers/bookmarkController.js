const Bookmark = require('../models/Bookmark');
const Tag = require('../models/Tag');

// @desc    Get all bookmarks for the logged-in user
// @route   GET /api/bookmarks
// @access  Private
const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('tags', 'name')    // Replace tag IDs with { _id, name }
      .sort({ createdAt: -1 });    // Newest first

    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new bookmark
// @route   POST /api/bookmarks
// @access  Private
const createBookmark = async (req, res, next) => {
  try {
    const { title, url, description, tags } = req.body;

    // Handle tags: find or create each tag
    let tagIds = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        let tag = await Tag.findOne({ name: tagName.toLowerCase(), user: req.user._id });
        if (!tag) {
          tag = await Tag.create({ name: tagName.toLowerCase(), user: req.user._id });
        }
        tagIds.push(tag._id);
      }
    }

    const bookmark = await Bookmark.create({
      title,
      url,
      description,
      tags: tagIds,
      user: req.user._id,
    });

    // Return the bookmark with populated tags
    const populated = await bookmark.populate('tags', 'name');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a bookmark
// @route   DELETE /api/bookmarks/:id
// @access  Private
const deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);

    if (!bookmark) {
      res.status(404);
      throw new Error('Bookmark not found');
    }

    // Make sure the user owns this bookmark
    if (bookmark.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this bookmark');
    }

    await bookmark.deleteOne();
    res.json({ message: 'Bookmark deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Search bookmarks by title or tag
// @route   GET /api/bookmarks/search?q=keyword
// @access  Private
const searchBookmarks = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      res.status(400);
      throw new Error('Search query is required');
    }

    // Search by title (case-insensitive regex)
    const bookmarks = await Bookmark.find({
      user: req.user._id,
      title: { $regex: q, $options: 'i' },  // 'i' = case insensitive
    }).populate('tags', 'name');

    res.json(bookmarks);
  } catch (error) {
    next(error);
  }
};

module.exports = { getBookmarks, createBookmark, deleteBookmark, searchBookmarks };