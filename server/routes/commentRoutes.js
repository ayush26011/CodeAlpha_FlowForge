const express = require('express');
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.use(protect);

router.post('/:taskId', addComment);
router.get('/:taskId', getComments);
router.delete('/:commentId', deleteComment);

module.exports = router;
