const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.name}`;
      },
    },
    role: {
      type: String,
      default: 'Developer',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    location: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    accountType: {
      type: String,
      default: 'Personal',
    },
    privacy: {
      profileVisibility: { type: Boolean, default: true },
      activityStatus: { type: Boolean, default: true },
      allowInvites: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
    },
    privacySettings: {
      profileVisibility: { type: Boolean, default: true },
      activityStatus: { type: Boolean, default: true },
      allowInvites: { type: Boolean, default: true },
      allowMessages: { type: Boolean, default: true },
    },
    notifications: {
      taskAssigned: { type: Boolean, default: true },
      taskUpdated: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      dueDateReminders: { type: Boolean, default: true },
      workspaceUpdates: { type: Boolean, default: true },
    },
    notificationSettings: {
      taskAssigned: { type: Boolean, default: true },
      taskUpdated: { type: Boolean, default: true },
      comments: { type: Boolean, default: true },
      mentions: { type: Boolean, default: true },
      emailDigests: { type: Boolean, default: true },
      desktopPushNotifications: { type: Boolean, default: true },
      dueDateReminders: { type: Boolean, default: true },
      workspaceUpdates: { type: Boolean, default: true },
    },
    appearance: {
      themeMode: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
      reduceMotion: { type: Boolean, default: false },
      compactMode: { type: Boolean, default: false },
    },
    security: {
      loginAlerts: { type: Boolean, default: true },
      savedDevices: { type: [String], default: ['Chrome on macOS (Current)'] },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password to hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
