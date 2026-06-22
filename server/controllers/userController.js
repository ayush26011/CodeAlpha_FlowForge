const { validationResult } = require('express-validator');
const User = require('../models/User');
const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper for buffer-based Cloudinary uploading
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'flowforge_avatars' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// ─── GET /api/users/me ────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/users/profile ───────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, role, avatar, phone, bio, website, timezone, location, title, accountType } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) updates.role = role;
    if (avatar !== undefined) updates.avatar = avatar;
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (website !== undefined) updates.website = website;
    if (timezone !== undefined) updates.timezone = timezone;
    if (location !== undefined) updates.location = location;
    if (title !== undefined) updates.title = title;
    if (accountType !== undefined) updates.accountType = accountType;

    // Check if email already exists
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email is already in use.' });
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/users/privacy ───────────────────────────────────────────────────
const updatePrivacy = async (req, res, next) => {
  try {
    const { profileVisibility, activityStatus, allowInvites, allowMessages } = req.body;
    const updates = {};
    if (profileVisibility !== undefined) updates['privacy.profileVisibility'] = profileVisibility;
    if (activityStatus !== undefined) updates['privacy.activityStatus'] = activityStatus;
    if (allowInvites !== undefined) updates['privacy.allowInvites'] = allowInvites;
    if (allowMessages !== undefined) updates['privacy.allowMessages'] = allowMessages;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/users/notifications ──────────────────────────────────────────────
const updateNotifications = async (req, res, next) => {
  try {
    const { taskAssigned, taskUpdated, comments, mentions, email, push, dueDateReminders, workspaceUpdates } = req.body;
    const updates = {};
    if (taskAssigned !== undefined) updates['notifications.taskAssigned'] = taskAssigned;
    if (taskUpdated !== undefined) updates['notifications.taskUpdated'] = taskUpdated;
    if (comments !== undefined) updates['notifications.comments'] = comments;
    if (mentions !== undefined) updates['notifications.mentions'] = mentions;
    if (email !== undefined) updates['notifications.email'] = email;
    if (push !== undefined) updates['notifications.push'] = push;
    if (dueDateReminders !== undefined) updates['notifications.dueDateReminders'] = dueDateReminders;
    if (workspaceUpdates !== undefined) updates['notifications.workspaceUpdates'] = workspaceUpdates;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/users/appearance ─────────────────────────────────────────────────
const updateAppearance = async (req, res, next) => {
  try {
    const { themeMode, reduceMotion, compactMode } = req.body;
    const updates = {};
    if (themeMode !== undefined) updates['appearance.themeMode'] = themeMode;
    if (reduceMotion !== undefined) updates['appearance.reduceMotion'] = reduceMotion;
    if (compactMode !== undefined) updates['appearance.compactMode'] = compactMode;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/users/security/password ──────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/users/security/settings ──────────────────────────────────────────
const updateSecuritySettings = async (req, res, next) => {
  try {
    const { loginAlerts, addDevice, removeDevice } = req.body;
    const updates = {};
    if (loginAlerts !== undefined) updates['security.loginAlerts'] = loginAlerts;

    if (addDevice) {
      updates['$addToSet'] = { 'security.savedDevices': addDevice };
    }
    if (removeDevice) {
      updates['$pull'] = { 'security.savedDevices': removeDevice };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/users/avatar ────────────────────────────────────────────────────
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file.' });
    }

    const result = await uploadFromBuffer(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/users/settings ──────────────────────────────────────────────────
const updateSettings = async (req, res, next) => {
  try {
    console.log('Update Settings Request Payload:', req.body);
    const { privacySettings, notificationSettings } = req.body;
    const updates = {};

    if (privacySettings) {
      const { profileVisibility, activityStatus, allowInvites, allowMessages } = privacySettings;
      if (profileVisibility !== undefined) {
        updates['privacy.profileVisibility'] = profileVisibility;
        updates['privacySettings.profileVisibility'] = profileVisibility;
      }
      if (activityStatus !== undefined) {
        updates['privacy.activityStatus'] = activityStatus;
        updates['privacySettings.activityStatus'] = activityStatus;
      }
      if (allowInvites !== undefined) {
        updates['privacy.allowInvites'] = allowInvites;
        updates['privacySettings.allowInvites'] = allowInvites;
      }
      if (allowMessages !== undefined) {
        updates['privacy.allowMessages'] = allowMessages;
        updates['privacySettings.allowMessages'] = allowMessages;
      }
    }

    if (notificationSettings) {
      const {
        taskAssigned, taskUpdated, comments, mentions,
        emailDigests, desktopPushNotifications, dueDateReminders, workspaceUpdates
      } = notificationSettings;
      
      if (taskAssigned !== undefined) {
        updates['notifications.taskAssigned'] = taskAssigned;
        updates['notificationSettings.taskAssigned'] = taskAssigned;
      }
      if (taskUpdated !== undefined) {
        updates['notifications.taskUpdated'] = taskUpdated;
        updates['notificationSettings.taskUpdated'] = taskUpdated;
      }
      if (comments !== undefined) {
        updates['notifications.comments'] = comments;
        updates['notificationSettings.comments'] = comments;
      }
      if (mentions !== undefined) {
        updates['notifications.mentions'] = mentions;
        updates['notificationSettings.mentions'] = mentions;
      }
      if (emailDigests !== undefined) {
        updates['notifications.email'] = emailDigests;
        updates['notificationSettings.emailDigests'] = emailDigests;
      }
      if (desktopPushNotifications !== undefined) {
        updates['notifications.push'] = desktopPushNotifications;
        updates['notificationSettings.desktopPushNotifications'] = desktopPushNotifications;
      }
      if (dueDateReminders !== undefined) {
        updates['notifications.dueDateReminders'] = dueDateReminders;
        updates['notificationSettings.dueDateReminders'] = dueDateReminders;
      }
      if (workspaceUpdates !== undefined) {
        updates['notifications.workspaceUpdates'] = workspaceUpdates;
        updates['notificationSettings.workspaceUpdates'] = workspaceUpdates;
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });
    console.log('Saved MongoDB Document:', user);
    console.log('Response Payload:', { success: true, user });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/users/search?query= ────────────────────────────────────────────
const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Query must be at least 2 characters.' });
    }

    const regex = new RegExp(query.trim(), 'i');
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
      _id: { $ne: req.user._id },
    }).select('name email avatar role').limit(10);

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePrivacy,
  updateNotifications,
  updateAppearance,
  changePassword,
  updateSecuritySettings,
  uploadAvatar,
  searchUsers,
  updateSettings,
};
