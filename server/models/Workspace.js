const mongoose = require('mongoose');

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
    members: [
      {
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
      },
    ],
  },
  { timestamps: true }
);

// Ensure owner is always in members array
workspaceSchema.pre('save', function (next) {
  const ownerInMembers = this.members.some(
    (m) => m.user.toString() === this.owner.toString()
  );
  if (!ownerInMembers) {
    this.members.unshift({ user: this.owner, role: 'Admin' });
  }
  next();
});

module.exports = mongoose.model('Workspace', workspaceSchema);
