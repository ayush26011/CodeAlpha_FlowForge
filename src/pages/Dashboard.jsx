import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AvatarGroup } from '../components/ui/Avatar';
import { RiArrowRightLine, RiTimeLine, RiAddLine, RiDashboardLine, RiFolderAddLine, RiLoader4Line, RiSparklingLine } from 'react-icons/ri';
import { useState } from 'react';

const container = { animate: { transition: { staggerChildren: 0.05 } } };
const item      = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 260 } } };

// ── Skeleton pulse card ──────────────────────────────────────────────────────
function SkeletonCard({ className = '' }) {
  return (
    <div className={`card p-5 animate-pulse relative overflow-hidden ${className}`}>
      <div className="h-3.5 w-1/2 bg-surface-3 rounded-lg mb-4" />
      <div className="h-8 w-1/3 bg-surface-3 rounded-lg mb-3" />
      <div className="h-2 w-2/3 bg-surface-3 rounded-full" />
    </div>
  );
}

function SkeletonProjectRow() {
  return (
    <div className="card p-5 flex items-center gap-4 animate-pulse">
      <div className="w-11 h-11 rounded-xl bg-surface-3 flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 w-1/3 bg-surface-3 rounded" />
        <div className="h-2 w-full bg-surface-3 rounded-full" />
      </div>
    </div>
  );
}

// ── Premium Stat Card ────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon, index }) {
  const isOverdue = label === 'Overdue' && value > 0;
  
  return (
    <motion.div
      variants={item}
      className="card p-6 relative overflow-hidden group transition-all duration-300"
      style={{
        background: 'rgba(22,23,16,0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(86,84,73,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
      whileHover={{
        y: -3,
        borderColor: 'rgba(184,151,90,0.4)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* Decorative radial brand glow */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-[0.04] blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none"
        style={{
          background: isOverdue ? '#f87171' : 'radial-gradient(circle, #B8975A 0%, transparent 80%)',
        }}
      />
      
      {/* Micro status dot */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xs text-olive uppercase tracking-widest font-semibold">{label}</p>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            label === 'Completed' ? 'bg-green-400 glow-green' :
            isOverdue ? 'bg-red-400 glow-red' :
            label === 'In Review' ? 'bg-purple-400' : 'bg-bronze-light'
          }`}
        />
      </div>

      <p className={`text-3xl font-bold tracking-tight leading-none ${color}`} style={{ fontFeatureSettings: '"tnum"' }}>
        {value}
      </p>
      
      <p className="text-2xs text-olive/60 mt-3 font-medium flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-olive/40" />
        {sub}
      </p>
    </motion.div>
  );
}

// ── Loading skeleton layout ──────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-1">
      {/* Greeting */}
      <div className="animate-pulse space-y-3">
        <div className="h-9 w-64 bg-surface-3 rounded-lg" />
        <div className="h-4.5 w-80 bg-surface-3 rounded-lg" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
      </div>
      {/* Projects / Deadlines */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[1,2].map(i => <SkeletonProjectRow key={i} />)}
        </div>
        <SkeletonCard className="h-56" />
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
      className="max-w-2xl mx-auto py-24 flex flex-col items-center text-center space-y-8"
    >
      <motion.div
        variants={item}
        className="w-20 h-20 rounded-2xl flex items-center justify-center relative overflow-hidden"
        style={{
          background: 'rgba(86,84,73,0.06)',
          border: '1px solid rgba(86,84,73,0.15)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-bronze/10 to-transparent opacity-60" />
        <RiDashboardLine className="text-4xl text-bronze-light relative z-10" />
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        <h1 className="text-3xl font-extrabold text-floral tracking-tight" style={{ letterSpacing: '-0.03em' }}>
          Welcome to FlowForge 🚀
        </h1>
        <p className="text-olive max-w-md text-sm leading-relaxed">
          Create your collaborative workspace to design, coordinate, and execute project pipelines with your team.
        </p>
      </motion.div>

      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <button
          id="create-workspace-cta"
          onClick={onCreateWorkspace}
          className="btn-primary"
        >
          <RiAddLine className="text-base" /> Create Workspace
        </button>
        <button
          id="go-workspace-cta"
          onClick={() => navigate('/workspace')}
          className="btn-secondary"
        >
          <RiFolderAddLine className="text-base" /> Go to Workspaces
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="max-w-md mx-auto py-24 flex flex-col items-center text-center space-y-5">
      <div className="w-12 h-12 rounded-xl bg-red-950/30 border border-red-900/40 flex items-center justify-center text-red-400 text-xl font-bold">⚠️</div>
      <div className="space-y-1">
        <p className="text-floral font-bold">Failed to load dashboard</p>
        <p className="text-olive text-xs">{message}</p>
      </div>
      <button onClick={onRetry} className="btn-primary py-2 px-5 text-sm">Try again</button>
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

  const isLoading = loading.workspace || loading.project || loading.tasks;

  if (isLoading && workspaces.length === 0) {
    return <DashboardSkeleton />;
  }

  if (error && workspaces.length === 0) {
    return <ErrorState message={error} onRetry={loadWorkspaces} />;
  }

  if (!activeWorkspace && workspaces.length === 0 && !isLoading) {
    return (
      <EmptyDashboard
        onCreateWorkspace={() => navigate('/workspace')}
      />
    );
  }

  if (!activeWorkspace && isLoading) {
    return <DashboardSkeleton />;
  }

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-32">
        <RiLoader4Line className="animate-spin text-3xl text-bronze" />
      </div>
    );
  }

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
    <motion.div variants={container} initial="initial" animate="animate" className="max-w-6xl mx-auto space-y-8 pb-12">

      {/* Hero Header Section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden p-6 lg:p-8 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(135deg, rgba(86,84,73,0.06) 0%, rgba(22,23,16,0.5) 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Subtle decorative mesh */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-[0.03] pointer-events-none hidden md:block">
          <svg className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" />
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#FFFBF4" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <RiSparklingLine className="text-bronze text-base" />
            <span className="text-2xs text-bronze uppercase tracking-widest font-semibold">Active workspace overview</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-floral tracking-tight leading-none" style={{ letterSpacing: '-0.03em' }}>
            {greeting}, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-olive flex items-center gap-1.5">
            You are managing <span className="text-bone font-medium underline decoration-bronze/40 underline-offset-4">{activeWorkspace.name}</span>
          </p>
        </div>
        <button
          id="dashboard-new-task"
          onClick={() => navigate('/board')}
          className="btn-primary sm:flex-shrink-0 relative z-10 flex items-center justify-center"
        >
          <RiAddLine className="text-base" /> New Task
        </button>
      </motion.div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => <StatCard key={s.label} index={idx} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Projects Panel */}
        <motion.div variants={item} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="section-title">Active Projects</h2>
              <span className="text-3xs text-olive/50 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full font-bold">{projects.length} Total</span>
            </div>
            <button id="view-all-projects" onClick={() => navigate('/workspace')} className="btn-ghost text-xs">
              View all <RiArrowRightLine />
            </button>
          </div>

          {loading.project ? (
            <div className="space-y-3">{[1,2].map(i => <SkeletonProjectRow key={i} />)}</div>
          ) : projects.length === 0 ? (
            <div
              className="p-8 text-center rounded-2xl border border-dashed border-olive/20 flex flex-col items-center justify-center space-y-4"
              style={{ background: 'rgba(22,23,16,0.3)' }}
            >
              <p className="text-olive text-sm font-medium">No projects created yet in this workspace.</p>
              <button
                id="create-first-project"
                onClick={() => navigate('/workspace')}
                className="btn-primary text-xs px-4 py-2"
              >
                <RiAddLine /> Create First Project
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project, i) => {
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
                    className="card p-5 cursor-pointer relative overflow-hidden group"
                    style={{
                      background: 'rgba(22,23,16,0.6)',
                      borderColor: 'rgba(86,84,73,0.15)',
                    }}
                    whileHover={{
                      y: -2,
                      borderColor: 'rgba(184,151,90,0.3)',
                      boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <div
                        className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-bold"
                        style={{ background: projectColor + '15', color: projectColor, border: `1px solid ${projectColor}25` }}
                      >
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-bone truncate group-hover:text-floral transition-colors">{project.name}</p>
                        <p className="text-2xs text-olive/70 font-medium mt-0.5">{project.taskCount || 0} tasks · {members.length} members</p>
                      </div>
                      <span
                        className="text-2xs px-2.5 py-1 rounded-lg flex-shrink-0 font-bold border border-white/5"
                        style={{ background: 'rgba(22,23,16,0.7)', color: progress === 100 ? '#4ade80' : '#D8CFBC' }}
                      >
                        {progress}%
                      </span>
                    </div>
                    
                    {/* Double-layered Premium Progress Bar */}
                    <div className="w-full h-1 bg-surface-3 rounded-full overflow-hidden mb-1.5 relative z-10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] }}
                        className="h-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${projectColor}aa, ${projectColor})`,
                          boxShadow: `0 0 8px ${projectColor}50`,
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Upcoming Deadlines Panel */}
        <motion.div variants={item} className="space-y-4">
          <h2 className="section-title px-1">Upcoming Deadlines</h2>
          <div
            className="card p-4 space-y-2 relative overflow-hidden"
            style={{
              background: 'rgba(22,23,16,0.6)',
              borderColor: 'rgba(86,84,73,0.15)',
            }}
          >
            {loading.tasks ? (
              <div className="space-y-4 py-2">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-2.5 h-2.5 rounded-full bg-surface-3 mt-1 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-3/4 bg-surface-3 rounded" />
                      <div className="h-2 w-1/3 bg-surface-3 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-olive">All caught up! No impending deadlines. 🎉</p>
              </div>
            ) : upcoming.map(task => (
              <div
                key={task._id || task.id}
                onClick={() => navigate('/board')}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-all duration-150"
              >
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0
                  ${{ urgent: 'bg-red-400 glow-red', high: 'bg-orange-400', medium: 'bg-yellow-400', low: 'bg-green-400' }[task.priority] || 'bg-olive'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-bone truncate">{task.title}</p>
                  <p className="text-3xs text-olive mt-1 flex items-center gap-1.5 font-medium uppercase tracking-wider">
                    <RiTimeLine className="text-xs text-olive/70" />
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

      {/* Workspaces Panel */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="section-title">Your Workspaces</h2>
          <button id="go-to-workspaces" onClick={() => navigate('/workspace')} className="btn-ghost text-xs">
            Manage <RiArrowRightLine />
          </button>
        </div>

        {workspaces.length === 0 && !loading.workspace ? (
          <div className="card p-10 text-center space-y-4">
            <p className="text-olive text-sm font-medium">No workspaces found.</p>
            <button
              id="create-workspace-bottom"
              onClick={() => navigate('/workspace')}
              className="btn-primary mx-auto"
            >
              <RiAddLine /> Create Workspace
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {loading.workspace
              ? [1,2,3].map(i => <SkeletonCard key={i} className="h-40" />)
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
                      className="card p-5 cursor-pointer relative overflow-hidden group"
                      style={{
                        background: 'rgba(22,23,16,0.6)',
                        borderColor: 'rgba(86,84,73,0.15)',
                      }}
                      whileHover={{
                        y: -3,
                        borderColor: 'rgba(184,151,90,0.3)',
                        boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
                      }}
                    >
                      <div className="flex items-center gap-3.5 mb-4 relative z-10">
                        <div
                          className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center text-xl"
                          style={{ background: 'rgba(86,84,73,0.06)', border: '1px solid rgba(86,84,73,0.12)' }}
                        >
                          {ws.icon || '📁'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-bone group-hover:text-floral transition-colors">{ws.name}</p>
                          <p className="text-2xs text-olive/60 font-semibold">{ws.members?.length || 0} members</p>
                        </div>
                      </div>
                      <p className="text-xs text-olive leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem] relative z-10">
                        {ws.description || 'No description provided'}
                      </p>
                      <div className="relative z-10 flex items-center justify-between">
                        <AvatarGroup users={members} max={3} size="xs" />
                        <span className="text-3xs text-olive/40 font-bold uppercase tracking-wider group-hover:text-bronze transition-colors flex items-center gap-0.5">
                          View details <RiArrowRightLine className="text-xs" />
                        </span>
                      </div>
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
