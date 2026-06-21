const { validationResult } = require('express-validator');
const Workspace   = require('../models/Workspace');
const User        = require('../models/User');
const Notification = require('../models/Notification');

// ── Helper: get socket io instance ────────────────────────────────────────────
const getIO = (req) => req.app.get('io');

// ── Helper: populate a workspace fully ───────────────────────────────────────
const populateWorkspace = (query) =>
  query
    .populate('owner', 'name email avatar role')
    .populate('members.user', 'name email avatar role');

// ── POST /api/workspaces ──────────────────────────────────────────────────────
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

    const populated = await populateWorkspace(
      Workspace.findById(workspace._id)
    );
    res.status(201).json({ success: true, workspace: populated });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/workspaces ───────────────────────────────────────────────────────
const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await populateWorkspace(
      Workspace.find({ 'members.user': req.user._id })
    ).sort({ createdAt: -1 });

    res.json({ success: true, count: workspaces.length, workspaces });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/workspaces/:id ───────────────────────────────────────────────────
const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await populateWorkspace(
      Workspace.findById(req.params.id)
    );

    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

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

// ── PUT /api/workspaces/:id ───────────────────────────────────────────────────
const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

    // Only owner or Admin can update
    const membership = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!membership || (membership.role !== 'Admin' && workspace.owner.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Only admins can update this workspace.' });
    }

    const { name, description, icon } = req.body;
    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (icon) workspace.icon = icon;

    await workspace.save();
    const populated = await populateWorkspace(Workspace.findById(workspace._id));
    res.json({ success: true, workspace: populated });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/workspaces/:id ────────────────────────────────────────────────
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

// ── POST /api/workspaces/:id/members ─────────────────────────────────────────
const addMember = async (req, res, next) => {
  try {
    const { email, role = 'Member' } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Basic email format validation
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

    // Only Admin members or the owner can invite
    const requesterMembership = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const isOwner = workspace.owner.toString() === req.user._id.toString();
    const isAdmin = requesterMembership?.role === 'Admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Only workspace admins can invite members.' });
    }

    // Find target user by email
    const userToAdd = await User.findOne({ email: email.trim().toLowerCase() });
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: `No user found with email "${email}". Ask them to register on FlowForge first.`,
      });
    }

    // Prevent duplicates
    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === userToAdd._id.toString()
    );
    if (alreadyMember) {
      return res.status(409).json({ success: false, message: 'This user is already a member of the workspace.' });
    }

    // Validate role
    const validRoles = ['Admin', 'Member', 'Viewer'];
    const normalizedRole = validRoles.find(r => r.toLowerCase() === role.toLowerCase()) || 'Member';

    // Add member
    workspace.members.push({ user: userToAdd._id, role: normalizedRole, joinedAt: new Date() });
    await workspace.save();

    // Populate and return
    const updated = await populateWorkspace(Workspace.findById(workspace._id));

    // Create notification for the invited user
    try {
      const notification = await Notification.create({
        user: userToAdd._id,
        type: 'invite',
        message: `${req.user.name} added you to workspace "${workspace.name}"`,
        entityType: 'workspace',
        entityId: workspace._id,
      });

      // Emit real-time notification to invited user
      const io = getIO(req);
      if (io) {
        io.to(`user_${userToAdd._id}`).emit('notification_created', notification);
        // Emit workspace member update to all workspace members
        io.to(`workspace_${workspace._id}`).emit('workspace_member_added', {
          workspaceId: workspace._id,
          workspace: updated,
        });
      }
    } catch (notifErr) {
      // Notification failure should NOT fail the invite
      console.warn('Notification creation failed (non-fatal):', notifErr.message);
    }

    res.json({ success: true, workspace: updated });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/workspaces/:id/members/:userId/role ──────────────────────────────
const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const { id: workspaceId, userId } = req.params;

    const validRoles = ['Admin', 'Member', 'Viewer'];
    const normalizedRole = validRoles.find(r => r.toLowerCase() === (role || '').toLowerCase());
    if (!normalizedRole) {
      return res.status(400).json({ success: false, message: `Role must be one of: ${validRoles.join(', ')}` });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

    // Only owner or Admin can change roles
    const requesterMembership = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const isOwner = workspace.owner.toString() === req.user._id.toString();
    if (!isOwner && requesterMembership?.role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Only admins can change member roles.' });
    }

    // Cannot change the owner's role
    if (workspace.owner.toString() === userId) {
      return res.status(400).json({ success: false, message: 'Cannot change the workspace owner role.' });
    }

    const member = workspace.members.find((m) => m.user.toString() === userId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found in workspace.' });
    }

    member.role = normalizedRole;
    await workspace.save();

    const updated = await populateWorkspace(Workspace.findById(workspace._id));

    // Real-time update
    const io = getIO(req);
    if (io) {
      io.to(`workspace_${workspace._id}`).emit('workspace_member_role_updated', {
        workspaceId: workspace._id,
        workspace: updated,
      });
    }

    res.json({ success: true, workspace: updated });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/workspaces/:id/members/:userId ────────────────────────────────
const removeMember = async (req, res, next) => {
  try {
    const { id: workspaceId, userId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ success: false, message: 'Workspace not found.' });
    }

    // Owner can remove anyone; Admin can remove Members/Viewers; Members can remove themselves
    const requesterMembership = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    const isOwner  = workspace.owner.toString() === req.user._id.toString();
    const isAdmin  = requesterMembership?.role === 'Admin';
    const isSelf   = req.user._id.toString() === userId;

    if (!isOwner && !isAdmin && !isSelf) {
      return res.status(403).json({ success: false, message: 'Not authorized to remove this member.' });
    }

    // Cannot remove the workspace owner
    if (workspace.owner.toString() === userId && !isSelf) {
      return res.status(400).json({ success: false, message: 'Cannot remove the workspace owner.' });
    }

    const memberIndex = workspace.members.findIndex((m) => m.user.toString() === userId);
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Member not found in workspace.' });
    }

    workspace.members.splice(memberIndex, 1);
    await workspace.save();

    const updated = await populateWorkspace(Workspace.findById(workspace._id));

    // Real-time update
    const io = getIO(req);
    if (io) {
      io.to(`workspace_${workspace._id}`).emit('workspace_member_removed', {
        workspaceId: workspace._id,
        removedUserId: userId,
        workspace: updated,
      });
    }

    res.json({ success: true, workspace: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  updateMemberRole,
  removeMember,
};
