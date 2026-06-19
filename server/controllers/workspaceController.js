const { validationResult } = require('express-validator');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

// ─── POST /api/workspaces ─────────────────────────────────────────────────────
const createWorkspace = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, icon } = req.body;
    const workspace = await Workspace.create({
      name,
      description,
      icon,
      owner: req.user._id,
    });

    await workspace.populate('members.user', 'name email avatar role');
    res.status(201).json({ success: true, workspace });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/workspaces ──────────────────────────────────────────────────────
const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({
      'members.user': req.user._id,
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: workspaces.length, workspaces });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/workspaces/:id ──────────────────────────────────────────────────
const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar role');

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

    // Check membership
    const isMember = workspace.members.some(
      (m) => m.user._id.toString() === req.user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, workspace });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/workspaces/:id ──────────────────────────────────────────────────
const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the owner can update this workspace.' });
    }

    const { name, description, icon } = req.body;
    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (icon) workspace.icon = icon;

    await workspace.save();
    await workspace.populate('members.user', 'name email avatar role');
    res.json({ success: true, workspace });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/workspaces/:id ───────────────────────────────────────────────
const deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

    if (workspace.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the owner can delete this workspace.' });
    }

    await workspace.deleteOne();
    res.json({ success: true, message: 'Workspace deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/workspaces/:id/members ─────────────────────────────────────────
const addMember = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

    // Only owner or admin can invite
    const requesterMembership = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!requesterMembership || requesterMembership.role === 'Viewer') {
      return res.status(403).json({ success: false, message: 'Not authorized to invite members.' });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'No user found with that email.' });
    }

    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) {
      return res.status(409).json({ success: false, message: 'User is already a member.' });
    }

    workspace.members.push({ user: userToAdd._id, role: role || 'Member' });
    await workspace.save();
    await workspace.populate('members.user', 'name email avatar role');

    res.json({ success: true, workspace });
  } catch (error) {
    next(error);
  }
};

module.exports = { createWorkspace, getWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace, addMember };
