// ─── Mock Users ───────────────────────────────────────────────────────────────
export const mockUsers = [
  { id: 'u1', name: 'Ayush Tiwari', email: 'ayush@flowforge.io', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayush', online: true, color: '#8B7355' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@flowforge.io', role: 'Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', online: true, color: '#6B8E5A' },
  { id: 'u3', name: 'Rohan Mehta', email: 'rohan@flowforge.io', role: 'Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan', online: false, color: '#5A6B8E' },
  { id: 'u4', name: 'Sneha Patel', email: 'sneha@flowforge.io', role: 'PM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', online: true, color: '#8E5A6B' },
  { id: 'u5', name: 'Dev Kapoor', email: 'dev@flowforge.io', role: 'Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dev', online: false, color: '#5A8E7A' },
  { id: 'u6', name: 'Isha Verma', email: 'isha@flowforge.io', role: 'Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isha', online: true, color: '#7A5A8E' },
];

export const currentUser = mockUsers[0];

// ─── Mock Workspaces ──────────────────────────────────────────────────────────
export const mockWorkspaces = [
  { id: 'w1', name: 'Engineering', icon: '⚙️', description: 'All engineering projects and sprints', color: '#8B7355', members: ['u1','u3','u5'], createdAt: '2024-01-10' },
  { id: 'w2', name: 'Design Studio', icon: '🎨', description: 'Design system, brand, and UX work', color: '#6B8E5A', members: ['u1','u2','u4'], createdAt: '2024-02-05' },
  { id: 'w3', name: 'Marketing', icon: '📣', description: 'Campaigns, content, and growth', color: '#8E5A6B', members: ['u1','u4','u6'], createdAt: '2024-03-01' },
];

// ─── Mock Projects ────────────────────────────────────────────────────────────
export const mockProjects = [
  { id: 'p1', workspaceId: 'w1', name: 'FlowForge v2.0', description: 'Next major release with AI features', color: '#8B7355', progress: 68, status: 'active', dueDate: '2024-08-01', members: ['u1','u3','u5'], taskCount: 24, completedCount: 16 },
  { id: 'p2', workspaceId: 'w1', name: 'API Gateway', description: 'Unified API layer for microservices', color: '#5A6B8E', progress: 45, status: 'active', dueDate: '2024-07-15', members: ['u3','u5'], taskCount: 18, completedCount: 8 },
  { id: 'p3', workspaceId: 'w2', name: 'Design System 3.0', description: 'New component library and tokens', color: '#6B8E5A', progress: 80, status: 'active', dueDate: '2024-07-01', members: ['u2','u4'], taskCount: 15, completedCount: 12 },
  { id: 'p4', workspaceId: 'w2', name: 'Brand Refresh', description: 'Visual identity and brand guidelines', color: '#7A5A8E', progress: 30, status: 'planning', dueDate: '2024-09-01', members: ['u1','u2'], taskCount: 10, completedCount: 3 },
  { id: 'p5', workspaceId: 'w3', name: 'Q3 Campaign', description: 'Summer product launch campaign', color: '#8E5A6B', progress: 55, status: 'active', dueDate: '2024-07-20', members: ['u4','u6'], taskCount: 20, completedCount: 11 },
  { id: 'p6', workspaceId: 'w3', name: 'Content Strategy', description: 'Blog, SEO, and social content plan', color: '#5A8E7A', progress: 20, status: 'planning', dueDate: '2024-08-15', members: ['u6'], taskCount: 12, completedCount: 2 },
];

// ─── Mock Tasks ───────────────────────────────────────────────────────────────
export const mockTasks = {
  backlog: [
    {
      id: 't1', title: 'Design onboarding flow v2', priority: 'high', assignee: 'u2',
      dueDate: '2024-07-20', labels: ['Design', 'UX'], comments: 3,
      description: 'Redesign the onboarding experience to improve activation rate. Include tooltips, progress indicators, and a sample workspace setup.',
      checklist: [
        { id: 'c1', text: 'Audit current onboarding', done: true },
        { id: 'c2', text: 'Wireframe new flow', done: true },
        { id: 'c3', text: 'Prototype in Figma', done: false },
        { id: 'c4', text: 'User testing', done: false },
      ],
      projectId: 'p3',
    },
    {
      id: 't2', title: 'Set up CI/CD pipeline', priority: 'medium', assignee: 'u5',
      dueDate: '2024-07-25', labels: ['DevOps'], comments: 1,
      description: 'Configure GitHub Actions for automated testing and deployment to staging/production.',
      checklist: [
        { id: 'c1', text: 'Set up GitHub Actions workflow', done: false },
        { id: 'c2', text: 'Configure secrets', done: false },
        { id: 'c3', text: 'Test deployment pipeline', done: false },
      ],
      projectId: 'p1',
    },
    {
      id: 't3', title: 'Research competitor pricing', priority: 'low', assignee: 'u4',
      dueDate: '2024-07-30', labels: ['Research', 'Strategy'], comments: 0,
      description: 'Analyze pricing models from Linear, Notion, Asana, and Jira. Prepare comparison report.',
      checklist: [],
      projectId: 'p5',
    },
  ],
  todo: [
    {
      id: 't4', title: 'Implement dark mode toggle', priority: 'medium', assignee: 'u3',
      dueDate: '2024-07-10', labels: ['Frontend', 'UI'], comments: 5,
      description: 'Add system-preference-based and manual dark/light mode toggle with smooth transitions.',
      checklist: [
        { id: 'c1', text: 'Add CSS variables for themes', done: true },
        { id: 'c2', text: 'Build toggle component', done: false },
        { id: 'c3', text: 'Persist preference to localStorage', done: false },
      ],
      projectId: 'p1',
    },
    {
      id: 't5', title: 'Write API documentation', priority: 'high', assignee: 'u1',
      dueDate: '2024-07-08', labels: ['Docs', 'API'], comments: 2,
      description: 'Document all REST endpoints with request/response examples using OpenAPI spec.',
      checklist: [
        { id: 'c1', text: 'Set up Swagger/OpenAPI', done: true },
        { id: 'c2', text: 'Document auth endpoints', done: false },
        { id: 'c3', text: 'Document project endpoints', done: false },
        { id: 'c4', text: 'Document task endpoints', done: false },
      ],
      projectId: 'p2',
    },
    {
      id: 't6', title: 'Brand color system audit', priority: 'medium', assignee: 'u2',
      dueDate: '2024-07-12', labels: ['Design', 'Brand'], comments: 1,
      description: 'Review all brand color usages across web, mobile, and print materials for consistency.',
      checklist: [],
      projectId: 'p4',
    },
  ],
  inprogress: [
    {
      id: 't7', title: 'Build Kanban board component', priority: 'urgent', assignee: 'u3',
      dueDate: '2024-07-05', labels: ['Frontend', 'Core'], comments: 8,
      description: 'Implement drag-and-drop Kanban board with column management, card creation, and real-time updates.',
      checklist: [
        { id: 'c1', text: 'Set up DnD library', done: true },
        { id: 'c2', text: 'Build column component', done: true },
        { id: 'c3', text: 'Build task card component', done: true },
        { id: 'c4', text: 'Implement drag between columns', done: false },
        { id: 'c5', text: 'Add optimistic UI updates', done: false },
      ],
      projectId: 'p1',
    },
    {
      id: 't8', title: 'Q3 landing page redesign', priority: 'high', assignee: 'u2',
      dueDate: '2024-07-07', labels: ['Marketing', 'Design'], comments: 4,
      description: 'Redesign the marketing landing page for the Q3 campaign launch with new hero section and pricing.',
      checklist: [
        { id: 'c1', text: 'Design mockups in Figma', done: true },
        { id: 'c2', text: 'Get design approval', done: true },
        { id: 'c3', text: 'Implement in code', done: false },
        { id: 'c4', text: 'A/B test setup', done: false },
      ],
      projectId: 'p5',
    },
    {
      id: 't9', title: 'Set up monitoring & alerts', priority: 'high', assignee: 'u5',
      dueDate: '2024-07-06', labels: ['DevOps', 'Infrastructure'], comments: 2,
      description: 'Configure Datadog/Sentry for error tracking, uptime monitoring, and performance alerts.',
      checklist: [
        { id: 'c1', text: 'Integrate Sentry', done: true },
        { id: 'c2', text: 'Configure alerts', done: false },
        { id: 'c3', text: 'Set up dashboards', done: false },
      ],
      projectId: 'p2',
    },
  ],
  review: [
    {
      id: 't10', title: 'User authentication flow', priority: 'urgent', assignee: 'u1',
      dueDate: '2024-07-03', labels: ['Backend', 'Security'], comments: 12,
      description: 'Complete auth flow including JWT, refresh tokens, OAuth providers, and password reset.',
      checklist: [
        { id: 'c1', text: 'JWT implementation', done: true },
        { id: 'c2', text: 'Google OAuth', done: true },
        { id: 'c3', text: 'Password reset flow', done: true },
        { id: 'c4', text: 'Security audit', done: false },
      ],
      projectId: 'p1',
    },
    {
      id: 't11', title: 'Component library documentation', priority: 'medium', assignee: 'u2',
      dueDate: '2024-07-02', labels: ['Design', 'Docs'], comments: 3,
      description: 'Document all components in Storybook with examples, props, and usage guidelines.',
      checklist: [
        { id: 'c1', text: 'Set up Storybook', done: true },
        { id: 'c2', text: 'Document base components', done: true },
        { id: 'c3', text: 'Document form components', done: true },
      ],
      projectId: 'p3',
    },
  ],
  done: [
    {
      id: 't12', title: 'Database schema design', priority: 'high', assignee: 'u3',
      dueDate: '2024-06-28', labels: ['Backend', 'Database'], comments: 6,
      description: 'Design and implement the PostgreSQL schema for projects, tasks, users, and workspaces.',
      checklist: [
        { id: 'c1', text: 'Entity relationship diagram', done: true },
        { id: 'c2', text: 'Write migrations', done: true },
        { id: 'c3', text: 'Seed data', done: true },
      ],
      projectId: 'p1',
    },
    {
      id: 't13', title: 'Set up project repository', priority: 'low', assignee: 'u1',
      dueDate: '2024-06-20', labels: ['Setup'], comments: 0,
      description: 'Initialize GitHub repository with proper branching strategy and contributing guidelines.',
      checklist: [],
      projectId: 'p1',
    },
    {
      id: 't14', title: 'Logo and brand identity', priority: 'medium', assignee: 'u2',
      dueDate: '2024-06-25', labels: ['Brand', 'Design'], comments: 4,
      description: 'Create FlowForge logo, wordmark, and initial brand guidelines document.',
      checklist: [
        { id: 'c1', text: 'Logo concepts', done: true },
        { id: 'c2', text: 'Final logo files', done: true },
        { id: 'c3', text: 'Brand guidelines doc', done: true },
      ],
      projectId: 'p4',
    },
  ],
};

// ─── Mock Notifications ───────────────────────────────────────────────────────
export const mockNotifications = [
  { id: 'n1', type: 'assigned', read: false, user: 'u4', action: 'assigned you to', target: 'Build Kanban board component', link: '/board', time: '10 minutes ago' },
  { id: 'n2', type: 'comment', read: false, user: 'u3', action: 'commented on', target: 'User authentication flow', link: '/board', time: '1 hour ago' },
  { id: 'n3', type: 'deadline', read: false, user: null, action: 'Deadline today:', target: 'Set up monitoring & alerts', link: '/board', time: '2 hours ago' },
  { id: 'n4', type: 'update', read: true, user: 'u2', action: 'moved', target: 'Component library documentation to Review', link: '/board', time: '3 hours ago' },
  { id: 'n5', type: 'comment', read: true, user: 'u1', action: 'replied to your comment on', target: 'User authentication flow', link: '/board', time: '5 hours ago' },
  { id: 'n6', type: 'assigned', read: true, user: 'u5', action: 'assigned you to', target: 'Set up CI/CD pipeline', link: '/board', time: 'Yesterday' },
  { id: 'n7', type: 'update', read: true, user: 'u2', action: 'completed', target: 'Logo and brand identity', link: '/board', time: 'Yesterday' },
  { id: 'n8', type: 'deadline', read: true, user: null, action: 'Deadline tomorrow:', target: 'Write API documentation', link: '/board', time: '2 days ago' },
];

// ─── Mock Activity ────────────────────────────────────────────────────────────
export const mockActivity = [
  { id: 'a1', user: 'u1', action: 'moved "Build Kanban board" to In Progress', time: '10m ago' },
  { id: 'a2', user: 'u2', action: 'completed "Logo and brand identity"', time: '2h ago' },
  { id: 'a3', user: 'u3', action: 'added a comment on "User auth flow"', time: '3h ago' },
  { id: 'a4', user: 'u4', action: 'created project "Q3 Campaign"', time: '1d ago' },
  { id: 'a5', user: 'u5', action: 'joined Engineering workspace', time: '2d ago' },
];

// ─── Mock Comments ────────────────────────────────────────────────────────────
export const mockComments = [
  { id: 'cm1', taskId: 't7', user: 'u1', text: 'Great progress! Let me know when drag-between-columns is working.', time: '2h ago' },
  { id: 'cm2', taskId: 't7', user: 'u3', text: 'Almost done. Found a bug with touch drag on mobile — fixing now.', time: '1h ago' },
  { id: 'cm3', taskId: 't10', user: 'u4', text: 'Security audit scheduled for Friday. Can you prepare the test credentials?', time: '3h ago' },
  { id: 'cm4', taskId: 't10', user: 'u1', text: 'Sure, will have everything ready by Thursday EOD.', time: '2h ago' },
];

// ─── Calendar Tasks ───────────────────────────────────────────────────────────
export const calendarTasks = [
  { date: '2024-07-03', tasks: [{ id: 't10', title: 'User authentication flow', priority: 'urgent' }] },
  { date: '2024-07-05', tasks: [{ id: 't7', title: 'Build Kanban board component', priority: 'urgent' }] },
  { date: '2024-07-06', tasks: [{ id: 't9', title: 'Set up monitoring & alerts', priority: 'high' }] },
  { date: '2024-07-07', tasks: [{ id: 't8', title: 'Q3 landing page redesign', priority: 'high' }] },
  { date: '2024-07-08', tasks: [{ id: 't5', title: 'Write API documentation', priority: 'high' }] },
  { date: '2024-07-10', tasks: [{ id: 't4', title: 'Implement dark mode toggle', priority: 'medium' }] },
  { date: '2024-07-12', tasks: [{ id: 't6', title: 'Brand color system audit', priority: 'medium' }] },
  { date: '2024-07-20', tasks: [{ id: 't1', title: 'Design onboarding flow v2', priority: 'high' }, { id: 't11', title: 'Component docs', priority: 'medium' }] },
  { date: '2024-07-25', tasks: [{ id: 't2', title: 'Set up CI/CD pipeline', priority: 'medium' }] },
  { date: '2024-07-30', tasks: [{ id: 't3', title: 'Research competitor pricing', priority: 'low' }] },
];
