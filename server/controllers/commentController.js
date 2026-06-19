const Comment = require('../models/Comment');
const Task = require('../models/Task');
const Notification = require('../models/Notification');

// ─── POST /api/comments/:taskId ────────────────────────────────────────────────
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const comment = await Comment.create({
      task: req.params.taskId,
      user: req.user._id,
      text: text.trim(),
    });

    await comment.populate('user', 'name email avatar');

    // Notify task creator if commenter is different
    if (task.createdBy && task.createdBy.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: task.createdBy,
        type: 'comment',
        message: `${req.user.name} commented on "${task.title}"`,
        entityType: 'task',
        entityId: task._id,
      });
    }

    // Notify assignee if different from commenter and creator
    if (
      task.assignee &&
      task.assignee.toString() !== req.user._id.toString() &&
      task.assignee.toString() !== task.createdBy?.toString()
    ) {
      await Notification.create({
        user: task.assignee,
        type: 'comment',
        message: `${req.user.name} commented on "${task.title}"`,
        entityType: 'task',
        entityId: task._id,
      });
    }

    if (req.io) {
      req.io.to(`project_${task.project}`).emit('comment_added', comment);
    }

    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/comments/:taskId ─────────────────────────────────────────────────
const getComments = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: 1 });

    res.json({ success: true, count: comments.length, comments });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/comments/:commentId ──────────────────────────────────────────
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment.' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments, deleteComment };
