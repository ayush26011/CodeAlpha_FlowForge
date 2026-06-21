import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AvatarGroup } from '../components/ui/Avatar';
import { RiArrowRightLine, RiTimeLine, RiAddLine, RiDashboardLine, RiFolderAddLine, RiLoader4Line } from 'react-icons/ri';
import { useState } from 'react';

const container = { animate: { transition: { staggerChildren: 0.07 } } };
const item      = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

// ── Skeleton pulse card ──────────────────────────────────────────────────────
function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-5 animate-pulse ${className}`}>
      <div className="h-3 w-1/2 bg-surface-3 rounded mb-3" />
      <div className="h-8 w-1/3 bg-surface-3 rounded mb-2" />
      <div className="h-2 w-2/3 bg-surface-3 rounded" />
    </div>
  );
}

function SkeletonProjectRow() {
  return (
    <div className="card p-4 flex items-center gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-surface-3 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-1/3 bg-surface-3 rounded" />
        <div className="h-1.5 w-full bg-surface-3 rounded-full" />
        <div className="h-2 w-1/4 bg-surface-3 rounded" />
      </div>
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon }) {
  return (
    <motion.div
      variants={item}
      className="card p-5 relative overflow-hidden group card-hover"
    >
      {/* Subtle corner gradient */}
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-10 blur-xl"
        style={{ background: color === 'text-green-400' ? '#4ade80' : color === 'text-red-400' ? '#f87171' : color === 'text-purple-400' ? '#c084fc' : '#B8975A' }}
      />
      <p className="text-2xs text-olive uppercase tracking-widest mb-3 font-medium">{label}</p>
      <p className={`text-3xl font-bold mb-1 tracking-tight leading-none ${color}`}
        style={{ fontFeatureSettings: '"tnum"' }}>
        {value}
      </p>
      <p className="text-2xs text-olive/50 mt-2">{sub}</p>
    </motion.div>
  );
}

// ── Loading skeleton layout ──────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-surface-3 rounded mb-2" />
        <div className="h-4 w-80 bg-surface-3 rounded" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
      </div>
      {/* Projects / Deadlines */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {[1,2].map(i => <SkeletonProjectRow key={i} />)}
        </div>
        <SkeletonCard className="h-48" />
      </div>
    </div>
  );
}

// ── Empty state for new users ─────────────────────────────────────────────────
function EmptyDashboard({ onCreateWorkspace }) {
  const navigate = useNavigate();
  return (
    <motion.div
      variants={container} initial="initial" animate="animate"
      className="max-w-2xl mx-auto py-20 flex flex-col items-center text-center space-y-6"
    >
      <motion.div variants={item}
        className="w-20 h-20 rounded-2xl bg-surface-2 flex items-center justify-center"
      >
        <RiDashboardLine className="text-4xl text-olive" />
      </motion.div>

      <motion.div variants={item}>
        <h1 className="text-3xl font-bold text-floral mb-2">Welcome to FlowForge 🚀</h1>
        <p className="text-olive max-w-md">
          You don't have any workspaces yet. Create your first workspace to get started
          managing projects and tasks.
        </p>
      </motion.div>

      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <button
          id="create-workspace-cta"
          onClick={onCreateWorkspace}
          className="btn-primary flex items-center gap-2"
        >
          <RiAddLine /> Create Workspace
        </button>
        <button
          id="go-workspace-cta"
          onClick={() => navigate('/workspace')}
          className="btn-secondary flex items-center gap-2"
        >
          <RiFolderAddLine /> Go to Workspaces
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="max-w-md mx-auto py-20 flex flex-col items-center text-center space-y-4">
      <p className="text-red-400 text-lg font-semibold">Failed to load dashboard</p>
      <p className="text-olive text-sm">{message}</p>
      <button onClick={onRetry} className="btn-primary">Try again</button>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const {
    currentUser, activeWorkspace, projects, allTasks, workspaces,
    loading, error, loadWorkspaces,
  } = useApp();
  const navigate = useNavigate();
  const [creatingWs, setCreatingWs] = useState(false);

  // ── Loading guard: show skeleton while workspace is being fetched ──────────
  const isLoading = loading.workspace || loading.project || loading.tasks;

  // Show skeleton if we're loading and have no workspaces yet
  if (isLoading && workspaces.length === 0) {
    return <DashboardSkeleton />;
  }

  // Error state
  if (error && workspaces.length === 0) {
    return <ErrorState message={error} onRetry={loadWorkspaces} />;
  }

  // No workspaces — empty state with CTA
  if (!activeWorkspace && workspaces.length === 0 && !isLoading) {
    return (
      <EmptyDashboard
        onCreateWorkspace={() => navigate('/workspace')}
      />
    );
  }

  // Workspace exists but still loading its data — show partial skeleton
  if (!activeWorkspace && isLoading) {
    return <DashboardSkeleton />;
  }

  // Fallback: workspace resolving — spinner only (won't be visible long)
  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-20">
        <RiLoader4Line className="animate-spin text-3xl text-olive" />
      </div>
    );
  }

  // ── Normal render with real data ─────────────────────────────────────────
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const myTasks       = allTasks.filter(t => (t.assignee?._id || t.assignee) === currentUser._id);
  const overdue       = myTasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date());
  const upcoming      = myTasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) >= new Date()).slice(0, 4);
  const completedTasks = myTasks.filter(t => t.status === 'done');
  const reviewTasks   = allTasks.filter(t => t.status === 'review');

  const stats = [
    { label: 'Active Tasks',  value: myTasks.filter(t => t.status !== 'done').length, sub: 'Assigned to you',  color: 'text-bone' },
    { label: 'Completed',     value: completedTasks.length,                            sub: 'Assigned to you',  color: 'text-green-400' },
    { label: 'Overdue',       value: overdue.length,                                   sub: 'Needs attention',  color: overdue.length > 0 ? 'text-red-400' : 'text-bone' },
    { label: 'In Review',     value: reviewTasks.length,                               sub: 'Awaiting review',  color: 'text-purple-400' },
  ];

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="max-w-6xl mx-auto space-y-8">

      {/* Greeting */}
      <motion.div variants={item} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-floral mb-1 tracking-tight" style={{ letterSpacing: '-0.025em' }}>
            {greeting}, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-olive">
            Here's what's happening in{' '}
            <span className="text-bone font-medium">{activeWorkspace.name}</span> today.
          </p>
        </div>
        <button id="dashboard-new-task" onClick={() => navigate('/board')} className="btn-primary hidden sm:flex flex-shrink-0">
          <RiAddLine /> New Task
        </button>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Projects */}
        <motion.div variants={item} className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="section-title">Active Projects</h2>
            <button id="view-all-projects" onClick={() => navigate('/workspace')} className="btn-ghost text-xs">
              View all <RiArrowRightLine />
            </button>
          </div>

          {loading.project ? (
            <>{[1,2].map(i => <SkeletonProjectRow key={i} />)}</>
          ) : projects.length === 0 ? (
            <div className="card p-8 text-center space-y-4">
              <p className="text-olive">No projects yet in this workspace.</p>
              <button
                id="create-first-project"
                onClick={() => navigate('/workspace')}
                className="btn-primary mx-auto flex items-center gap-2"
              >
                <RiAddLine /> Create First Project
              </button>
            </div>
          ) : (
            projects.map((project, i) => {
              const members  = (project.members || []).map(m => ({ ...m, id: m._id }));
              const progress = project.taskCount > 0
                ? Math.round((project.completedCount / project.taskCount) * 100)
                : 0;
              const projectColor = project.color || '#9B8260';
              return (
                <motion.div
                  key={project._id}
                  variants={item}
                  onClick={() => navigate('/board')}
                  className="card card-hover p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-base font-bold"
                      style={{ background: projectColor + '1A', color: projectColor, border: `1px solid ${projectColor}30` }}
                    >
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-bone truncate">{project.name}</p>
                      <p className="text-2xs text-olive">{project.taskCount || 0} tasks · {members.length} members</p>
                    </div>
                    <span className="text-2xs text-olive bg-surface-3 px-2 py-1 rounded-lg flex-shrink-0 font-medium">
                      {progress}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="progress-track">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.9, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      className="progress-fill"
                      style={{ background: `linear-gradient(90deg, ${projectColor}99, ${projectColor})` }}
                    />
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={item}>
          <h2 className="section-title mb-3">Upcoming Deadlines</h2>
          <div className="card p-4 space-y-3">
            {loading.tasks ? (
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-surface-3 mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 bg-surface-3 rounded" />
                      <div className="h-2 w-1/3 bg-surface-3 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <p className="text-sm text-olive text-center py-4">No upcoming tasks 🎉</p>
            ) : upcoming.map(task => (
              <div
                key={task._id || task.id}
                onClick={() => navigate('/board')}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-2 cursor-pointer transition-colors"
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0
                  ${{ urgent: 'bg-red-400', high: 'bg-orange-400', medium: 'bg-yellow-400', low: 'bg-green-400' }[task.priority] || 'bg-olive'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-bone truncate">{task.title}</p>
                  <p className="text-xs text-olive mt-0.5 flex items-center gap-1">
                    <RiTimeLine className="text-xs" />
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'No due date'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Workspaces */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Your Workspaces</h2>
          <button id="go-to-workspaces" onClick={() => navigate('/workspace')} className="btn-ghost text-xs">
            Manage <RiArrowRightLine />
          </button>
        </div>

        {workspaces.length === 0 && !loading.workspace ? (
          <div className="card p-8 text-center space-y-4">
            <p className="text-olive">No workspaces found.</p>
            <button
              id="create-workspace-bottom"
              onClick={() => navigate('/workspace')}
              className="btn-primary mx-auto flex items-center gap-2"
            >
              <RiAddLine /> Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {loading.workspace
              ? [1,2,3].map(i => <SkeletonCard key={i} className="h-36" />)
              : workspaces.map(ws => {
                  const members = (ws.members || []).map(m => ({
                    ...(m.user || m),
                    id: m.user?._id || m.user || m._id,
                  }));
                  return (
                    <motion.div
                      key={ws._id}
                      variants={item}
                      onClick={() => navigate('/workspace')}
                      className="card card-hover p-5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-surface-3 flex items-center justify-center text-xl">
                          {ws.icon || '📁'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-bone">{ws.name}</p>
                          <p className="text-xs text-olive">{ws.members?.length || 0} members</p>
                        </div>
                      </div>
                      <p className="text-xs text-olive leading-relaxed mb-3 line-clamp-2">
                        {ws.description || 'No description'}
                      </p>
                      <AvatarGroup users={members} max={4} size="xs" />
                    </motion.div>
                  );
                })
            }
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
