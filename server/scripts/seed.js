require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');

const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

const seed = async () => {
  await connectDB();
  console.log('\n🌱 Starting FlowForge seed...\n');

  // ─── Clear all collections ─────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Workspace.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
    Comment.deleteMany({}),
    Notification.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // ─── Create Users ──────────────────────────────────────────────────────────
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const usersData = [
    { name: 'Ayush Tiwari',  email: 'ayush@flowforge.io',  password: hashedPassword, role: 'Admin',     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayush' },
    { name: 'Priya Sharma',  email: 'priya@flowforge.io',  password: hashedPassword, role: 'Designer',   avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { name: 'Rohan Mehta',   email: 'rohan@flowforge.io',  password: hashedPassword, role: 'Developer',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan' },
    { name: 'Sneha Patel',   email: 'sneha@flowforge.io',  password: hashedPassword, role: 'PM',         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha' },
    { name: 'Dev Kapoor',    email: 'dev@flowforge.io',    password: hashedPassword, role: 'Developer',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev'   },
    { name: 'Isha Verma',    email: 'isha@flowforge.io',   password: hashedPassword, role: 'Marketing',  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isha'  },
  ];

  // insertMany bypasses pre-save hooks, so passwords are already hashed above
  const users = await User.insertMany(usersData);
  const [ayush, priya, rohan, sneha, dev, isha] = users;
  console.log(`✅ Created ${users.length} users`);

  // ─── Create Workspaces ─────────────────────────────────────────────────────
  const engineeringWS = await Workspace.create({
    name: 'Engineering',
    description: 'All engineering projects and sprints',
    icon: '⚙️',
    owner: ayush._id,
    members: [
      { user: ayush._id, role: 'Admin' },
      { user: rohan._id, role: 'Member' },
      { user: dev._id,   role: 'Member' },
    ],
  });

  const designWS = await Workspace.create({
    name: 'Design Studio',
    description: 'Design system, brand, and UX work',
    icon: '🎨',
    owner: ayush._id,
    members: [
      { user: ayush._id,  role: 'Admin' },
      { user: priya._id,  role: 'Member' },
      { user: sneha._id,  role: 'Member' },
    ],
  });

  const marketingWS = await Workspace.create({
    name: 'Marketing',
    description: 'Campaigns, content, and growth',
    icon: '📣',
    owner: ayush._id,
    members: [
      { user: ayush._id, role: 'Admin' },
      { user: sneha._id, role: 'Member' },
      { user: isha._id,  role: 'Member' },
    ],
  });
  console.log(`✅ Created 3 workspaces`);

  // ─── Create Projects ───────────────────────────────────────────────────────
  const [p1, p2, p3, p4, p5, p6] = await Project.insertMany([
    { name: 'FlowForge v2.0',    description: 'Next major release with AI features',     workspace: engineeringWS._id, members: [ayush._id, rohan._id, dev._id],   status: 'active',   color: '#8B7355', dueDate: new Date('2024-08-01'), createdBy: ayush._id },
    { name: 'API Gateway',        description: 'Unified API layer for microservices',     workspace: engineeringWS._id, members: [rohan._id, dev._id],               status: 'active',   color: '#5A6B8E', dueDate: new Date('2024-07-15'), createdBy: ayush._id },
    { name: 'Design System 3.0', description: 'New component library and tokens',        workspace: designWS._id,      members: [priya._id, sneha._id],             status: 'active',   color: '#6B8E5A', dueDate: new Date('2024-07-01'), createdBy: priya._id },
    { name: 'Brand Refresh',     description: 'Visual identity and brand guidelines',    workspace: designWS._id,      members: [ayush._id, priya._id],             status: 'planning', color: '#7A5A8E', dueDate: new Date('2024-09-01'), createdBy: ayush._id },
    { name: 'Q3 Campaign',       description: 'Summer product launch campaign',          workspace: marketingWS._id,   members: [sneha._id, isha._id],              status: 'active',   color: '#8E5A6B', dueDate: new Date('2024-07-20'), createdBy: sneha._id },
    { name: 'Content Strategy',  description: 'Blog, SEO, and social content plan',     workspace: marketingWS._id,   members: [isha._id],                         status: 'planning', color: '#5A8E7A', dueDate: new Date('2024-08-15'), createdBy: isha._id  },
  ]);
  console.log(`✅ Created 6 projects`);

  // ─── Create Tasks ──────────────────────────────────────────────────────────
  const tasks = await Task.insertMany([
    // ── Backlog ──
    { title: 'Design onboarding flow v2',  description: 'Redesign the onboarding experience.', project: p3._id, workspace: designWS._id,      status: 'backlog',    priority: 'high',   assignee: priya._id, labels: ['Design','UX'],         dueDate: new Date('2024-07-20'), checklist: [{ text: 'Audit current onboarding', done: true }, { text: 'Wireframe new flow', done: true }, { text: 'Prototype in Figma', done: false }], createdBy: priya._id },
    { title: 'Set up CI/CD pipeline',      description: 'Configure GitHub Actions.',           project: p1._id, workspace: engineeringWS._id, status: 'backlog',    priority: 'medium', assignee: dev._id,   labels: ['DevOps'],              dueDate: new Date('2024-07-25'), checklist: [{ text: 'Set up GitHub Actions', done: false }], createdBy: ayush._id },
    { title: 'Research competitor pricing',description: 'Analyse competitor pricing.',         project: p5._id, workspace: marketingWS._id,   status: 'backlog',    priority: 'low',    assignee: sneha._id, labels: ['Research','Strategy'],  dueDate: new Date('2024-07-30'), checklist: [], createdBy: sneha._id },
    // ── To Do ──
    { title: 'Implement dark mode toggle', description: 'Add dark/light theme toggle.',        project: p1._id, workspace: engineeringWS._id, status: 'todo',       priority: 'medium', assignee: rohan._id, labels: ['Frontend','UI'],       dueDate: new Date('2024-07-10'), checklist: [{ text: 'Add CSS variables', done: true }, { text: 'Build toggle component', done: false }], createdBy: ayush._id },
    { title: 'Write API documentation',    description: 'Document all REST endpoints.',        project: p2._id, workspace: engineeringWS._id, status: 'todo',       priority: 'high',   assignee: ayush._id, labels: ['Docs','API'],          dueDate: new Date('2024-07-08'), checklist: [{ text: 'Set up Swagger', done: true }], createdBy: ayush._id },
    { title: 'Brand color system audit',   description: 'Review brand color usages.',          project: p4._id, workspace: designWS._id,      status: 'todo',       priority: 'medium', assignee: priya._id, labels: ['Design','Brand'],      dueDate: new Date('2024-07-12'), checklist: [], createdBy: priya._id },
    // ── In Progress ──
    { title: 'Build Kanban board component', description: 'Implement drag-and-drop Kanban.',  project: p1._id, workspace: engineeringWS._id, status: 'inprogress', priority: 'urgent', assignee: rohan._id, labels: ['Frontend','Core'],     dueDate: new Date('2024-07-05'), checklist: [{ text: 'Set up DnD library', done: true }, { text: 'Build column component', done: true }, { text: 'Implement drag between columns', done: false }], createdBy: ayush._id },
    { title: 'Q3 landing page redesign',   description: 'Redesign marketing landing page.',   project: p5._id, workspace: marketingWS._id,   status: 'inprogress', priority: 'high',   assignee: priya._id, labels: ['Marketing','Design'], dueDate: new Date('2024-07-07'), checklist: [{ text: 'Design mockups', done: true }, { text: 'Implement in code', done: false }], createdBy: sneha._id },
    { title: 'Set up monitoring & alerts', description: 'Configure Datadog/Sentry.',          project: p2._id, workspace: engineeringWS._id, status: 'inprogress', priority: 'high',   assignee: dev._id,   labels: ['DevOps','Infrastructure'], dueDate: new Date('2024-07-06'), checklist: [{ text: 'Integrate Sentry', done: true }], createdBy: ayush._id },
    // ── Review ──
    { title: 'User authentication flow',   description: 'Complete auth flow with JWT/OAuth.', project: p1._id, workspace: engineeringWS._id, status: 'review',     priority: 'urgent', assignee: ayush._id, labels: ['Backend','Security'],  dueDate: new Date('2024-07-03'), checklist: [{ text: 'JWT implementation', done: true }, { text: 'Google OAuth', done: true }, { text: 'Security audit', done: false }], createdBy: ayush._id },
    { title: 'Component library docs',     description: 'Document all components in Storybook.', project: p3._id, workspace: designWS._id, status: 'review',     priority: 'medium', assignee: priya._id, labels: ['Design','Docs'],       dueDate: new Date('2024-07-02'), checklist: [{ text: 'Set up Storybook', done: true }, { text: 'Document base components', done: true }], createdBy: priya._id },
    // ── Done ──
    { title: 'Database schema design',     description: 'Design PostgreSQL schema.',           project: p1._id, workspace: engineeringWS._id, status: 'done',       priority: 'high',   assignee: rohan._id, labels: ['Backend','Database'], dueDate: new Date('2024-06-28'), checklist: [{ text: 'ERD diagram', done: true }, { text: 'Write migrations', done: true }], createdBy: ayush._id },
    { title: 'Logo and brand identity',    description: 'Create FlowForge logo.',              project: p4._id, workspace: designWS._id,      status: 'done',       priority: 'medium', assignee: priya._id, labels: ['Brand','Design'],      dueDate: new Date('2024-06-25'), checklist: [{ text: 'Logo concepts', done: true }, { text: 'Brand guidelines', done: true }], createdBy: priya._id },
  ]);
  console.log(`✅ Created ${tasks.length} tasks`);

  // ─── Create Comments ───────────────────────────────────────────────────────
  const kanbanTask = tasks.find(t => t.title === 'Build Kanban board component');
  const authTask   = tasks.find(t => t.title === 'User authentication flow');

  await Comment.insertMany([
    { task: kanbanTask._id, user: ayush._id, text: 'Great progress! Let me know when drag-between-columns is working.' },
    { task: kanbanTask._id, user: rohan._id, text: 'Almost done. Found a bug with touch drag on mobile — fixing now.' },
    { task: authTask._id,   user: sneha._id, text: 'Security audit scheduled for Friday. Can you prepare the test credentials?' },
    { task: authTask._id,   user: ayush._id, text: 'Sure, will have everything ready by Thursday EOD.' },
  ]);
  console.log(`✅ Created 4 comments`);

  // ─── Create Notifications ──────────────────────────────────────────────────
  await Notification.insertMany([
    { user: ayush._id, type: 'assigned', message: 'Sneha assigned you to "Write API documentation"',     entityType: 'task', entityId: tasks[4]._id, read: false },
    { user: ayush._id, type: 'comment',  message: 'Rohan commented on "User authentication flow"',        entityType: 'task', entityId: authTask._id,   read: false },
    { user: ayush._id, type: 'deadline', message: 'Deadline today: Set up monitoring & alerts',           entityType: 'task', entityId: tasks[8]._id,   read: false },
    { user: ayush._id, type: 'update',   message: 'Priya moved "Component library docs" to Review',       entityType: 'task', entityId: tasks[10]._id,  read: true  },
    { user: rohan._id, type: 'assigned', message: 'Ayush assigned you to "Build Kanban board component"', entityType: 'task', entityId: kanbanTask._id, read: false },
  ]);
  console.log(`✅ Created 5 notifications`);

  console.log('\n✨ Seed complete! Demo credentials:');
  console.log('   Email: ayush@flowforge.io');
  console.log('   Password: password123\n');

  mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  mongoose.connection.close();
  process.exit(1);
});
