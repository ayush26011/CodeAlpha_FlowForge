const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Workspace = require('../models/Workspace');

// Helper: check if user is workspace member
const isWorkspaceMember = (workspace, userId) =>
  workspace.members.some((m) => m.user.toString() === userId.toString());

// ─── POST /api/projects ────────────────────────────────────────────────────────
const createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, workspaceId, dueDate, color, members } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }
    if (!isWorkspaceMember(workspace, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const project = await Project.create({
      name,
      description,
      workspace: workspaceId,
      dueDate,
      color,
      members: members || [req.user._id],
      createdBy: req.user._id,
    });

    await project.populate('members', 'name email avatar role');
    await project.populate('createdBy', 'name email avatar');
    await project.populate('taskCount');
    await project.populate('completedCount');
    res.status(201).json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/projects/workspace/:workspaceId ──────────────────────────────────
const getProjectsByWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }
    if (!isWorkspaceMember(workspace, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const projects = await Project.find({ workspace: req.params.workspaceId })
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email avatar')
      .populate('taskCount')
      .populate('completedCount')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/projects/:id ─────────────────────────────────────────────────────
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email avatar role')
      .populate('createdBy', 'name email avatar')
      .populate('taskCount')
      .populate('completedCount')
      .populate('workspace', 'name icon');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const workspace = await Workspace.findById(project.workspace._id || project.workspace);
    if (!isWorkspaceMember(workspace, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/projects/:id ─────────────────────────────────────────────────────
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const workspace = await Workspace.findById(project.workspace);
    if (!isWorkspaceMember(workspace, req.user._id)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const { name, description, status, dueDate, color, members } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;
    if (dueDate) project.dueDate = dueDate;
    if (color) project.color = color;
    if (members) project.members = members;

    await project.save();
    await project.populate('members', 'name email avatar role');
    await project.populate('taskCount');
    await project.populate('completedCount');
    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/projects/:id ──────────────────────────────────────────────────
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the project creator can delete it.' });
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getProjectsByWorkspace, getProject, updateProject, deleteProject };
