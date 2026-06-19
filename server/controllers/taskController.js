const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Workspace = require('../models/Workspace');
const Notification = require('../models/Notification');

const populateTask = (query) =>
  query
    .populate('assignee', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('project', 'name')
    .populate('workspace', 'name');

// ─── POST /api/tasks ───────────────────────────────────────────────────────────
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, projectId, workspaceId, status, priority, assignee, labels, dueDate, checklist } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const task = await Task.create({
      title, description,
      project: projectId,
      workspace: workspaceId || project.workspace,
      status: status || 'todo',
      priority: priority || 'medium',
      assignee: assignee || null,
      labels: labels || [],
      dueDate,
      checklist: checklist || [],
      createdBy: req.user._id,
    });

    // Create notification if assigning to someone else
    if (assignee && assignee !== req.user._id.toString()) {
      await Notification.create({
        user: assignee,
        type: 'assigned',
        message: `${req.user.name} assigned you to "${title}"`,
        entityType: 'task',
        entityId: task._id,
      });

      // Emit via socket if available
      if (req.io) {
        req.io.to(`project_${projectId}`).emit('task_created', task);
        req.io.to(`user_${assignee}`).emit('notification_created', {
          type: 'assigned',
          message: `${req.user.name} assigned you to "${title}"`,
        });
      }
    } else if (req.io) {
      req.io.to(`project_${projectId}`).emit('task_created', task);
    }

    const populated = await populateTask(Task.findById(task._id));
    res.status(201).json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/tasks/project/:projectId ────────────────────────────────────────
const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await populateTask(
      Task.find({ project: req.params.projectId }).sort({ createdAt: -1 })
    );
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/tasks/:id ────────────────────────────────────────────────────────
const getTask = async (req, res, next) => {
  try {
    const task = await populateTask(Task.findById(req.params.id));
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/tasks/:id ────────────────────────────────────────────────────────
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const { title, description, labels, dueDate, checklist } = req.body;
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (labels) task.labels = labels;
    if (dueDate) task.dueDate = dueDate;
    if (checklist) task.checklist = checklist;

    await task.save();
    const populated = await populateTask(Task.findById(task._id));

    if (req.io) req.io.to(`project_${task.project}`).emit('task_updated', populated);
    res.json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/tasks/:id ─────────────────────────────────────────────────────
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task.' });
    }

    await task.deleteOne();
    if (req.io) req.io.to(`project_${task.project}`).emit('task_updated', { _id: task._id, deleted: true });
    res.json({ success: true, message: 'Task deleted.' });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/tasks/:id/status ─────────────────────────────────────────────────
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['backlog', 'todo', 'inprogress', 'review', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const populated = await populateTask(Task.findById(task._id));

    if (req.io) {
      req.io.to(`project_${task.project}`).emit('task_moved', {
        taskId: task._id,
        status,
        task: populated,
      });
    }

    res.json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/tasks/:id/assign ─────────────────────────────────────────────────
const assignTask = async (req, res, next) => {
  try {
    const { assignee } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignee: assignee || null },
      { new: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    if (assignee && assignee !== req.user._id.toString()) {
      await Notification.create({
        user: assignee,
        type: 'assigned',
        message: `${req.user.name} assigned you to "${task.title}"`,
        entityType: 'task',
        entityId: task._id,
      });
      if (req.io) {
        req.io.to(`user_${assignee}`).emit('notification_created', {
          type: 'assigned',
          message: `${req.user.name} assigned you to "${task.title}"`,
        });
        req.io.to(`project_${task.project}`).emit('task_assigned', { taskId: task._id, assignee });
      }
    }

    const populated = await populateTask(Task.findById(task._id));
    res.json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/tasks/:id/priority ───────────────────────────────────────────────
const updateTaskPriority = async (req, res, next) => {
  try {
    const { priority } = req.body;
    const validPriorities = ['low', 'medium', 'high', 'urgent'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ success: false, message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });

    const populated = await populateTask(Task.findById(task._id));
    if (req.io) req.io.to(`project_${task.project}`).emit('task_updated', populated);
    res.json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/tasks/workspace/:workspaceId ────────────────────────────────────
const getTasksByWorkspace = async (req, res, next) => {
  try {
    const tasks = await populateTask(
      Task.find({ workspace: req.params.workspaceId }).sort({ createdAt: -1 })
    );
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask, getTasksByProject, getTask,
  updateTask, deleteTask, updateTaskStatus,
  assignTask, updateTaskPriority, getTasksByWorkspace,
};
