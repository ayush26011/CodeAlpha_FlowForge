const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Member', 'Viewer'],
    default: 'Member',
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    icon: {
      type: String,
      default: '📁',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [memberSchema],
  },
  { timestamps: true }
);

// Ensure owner is always in members array as Admin
workspaceSchema.pre('save', function (next) {
  const ownerInMembers = this.members.some(
    (m) => m.user.toString() === this.owner.toString()
  );
  if (!ownerInMembers) {
    this.members.unshift({ user: this.owner, role: 'Admin', joinedAt: new Date() });
  }
  next();
});

module.exports = mongoose.model('Workspace', workspaceSchema);
