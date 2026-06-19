import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AvatarGroup } from '../components/ui/Avatar';
import { RiArrowRightLine, RiTimeLine, RiAddLine } from 'react-icons/ri';

const container = { animate: { transition: { staggerChildren: 0.07 } } };
const item = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

function StatCard({ label, value, sub, color }) {
  return (
    <motion.div variants={item} className="card p-5">
      <p className="text-xs text-olive mb-1">{label}</p>
      <p className={`text-3xl font-bold mb-1 ${color}`}>{value}</p>
      <p className="text-xs text-olive/60">{sub}</p>
    </motion.div>
  );
}

export default function Dashboard() {
  const { currentUser, activeWorkspace, projects, allTasks, workspaces } = useApp();
  const navigate = useNavigate();

  if (!currentUser || !activeWorkspace) return null;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const myTasks = allTasks.filter(t => (t.assignee?._id || t.assignee) === currentUser._id);
  const overdue = myTasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date());
  const upcoming = myTasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) >= new Date()).slice(0, 4);
  const completedTasks = myTasks.filter(t => t.status === 'done');
  const reviewTasks = allTasks.filter(t => t.status === 'review');

  const stats = [
    { label: 'Active Tasks', value: myTasks.filter(t => t.status !== 'done').length, sub: 'Assigned to you', color: 'text-bone' },
    { label: 'Completed', value: completedTasks.length, sub: 'Assigned to you', color: 'text-green-400' },
    { label: 'Overdue', value: overdue.length, sub: 'Needs attention', color: overdue.length > 0 ? 'text-red-400' : 'text-bone' },
    { label: 'In Review', value: reviewTasks.length, sub: 'Awaiting review', color: 'text-purple-400' },
  ];

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div variants={item} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-floral mb-1">{greeting}, {currentUser.name.split(' ')[0]} 👋</h1>
          <p className="text-olive">Here's what's happening in <span className="text-bone font-medium">{activeWorkspace.name}</span> today.</p>
        </div>
        <button onClick={() => navigate('/board')} className="btn-primary hidden sm:flex">
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
            <button onClick={() => navigate('/workspace')} className="btn-ghost text-xs">View all <RiArrowRightLine /></button>
          </div>
          {projects.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-olive">No projects yet in this workspace.</p>
            </div>
          ) : (
            projects.map((project, i) => {
              const members = (project.members || []).map(m => ({ ...m, id: m._id }));
              const progress = project.taskCount > 0 ? Math.round((project.completedCount / project.taskCount) * 100) : 0;
              return (
                <motion.div
                  key={project._id}
                  variants={item}
                  onClick={() => navigate('/board')}
                  className="card card-hover p-4 cursor-pointer flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: project.color + '22', color: project.color }}>
                    {project.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-bone">{project.name}</p>
                      <span className="text-xs text-olive">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-2 rounded-full mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-olive">{project.completedCount || 0}/{project.taskCount || 0} tasks</p>
                      <AvatarGroup users={members} max={3} size="xs" />
                    </div>
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
            {upcoming.length === 0 ? (
              <p className="text-sm text-olive text-center py-4">No upcoming tasks 🎉</p>
            ) : upcoming.map(task => (
              <div
                key={task._id || task.id}
                onClick={() => navigate('/board')}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-2 cursor-pointer transition-colors"
              >
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0
                  ${{ urgent: 'bg-red-400', high: 'bg-orange-400', medium: 'bg-yellow-400', low: 'bg-green-400' }[task.priority]}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-bone truncate">{task.title}</p>
                  <p className="text-xs text-olive mt-0.5 flex items-center gap-1">
                    <RiTimeLine className="text-xs" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
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
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {workspaces.map(ws => {
            const members = (ws.members || []).map(m => ({ ...(m.user || m), id: (m.user?._id || m.user || m._id) }));
            return (
              <motion.div
                key={ws._id}
                variants={item}
                onClick={() => navigate('/workspace')}
                className="card card-hover p-5 cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-3 flex items-center justify-center text-xl">
                    {ws.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-bone">{ws.name}</p>
                    <p className="text-xs text-olive">{ws.members?.length || 0} members</p>
                  </div>
                </div>
                <p className="text-xs text-olive leading-relaxed mb-3 line-clamp-2">{ws.description}</p>
                <AvatarGroup users={members} max={4} size="xs" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
