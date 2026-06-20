import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Avatar } from '../components/ui/Avatar';
import { PriorityBadge } from '../components/ui/Badge';
import { RiAwardLine, RiCheckboxCircleLine, RiTimeLine, RiGitMergeLine, RiCalendarCheckLine, RiLoader4Line } from 'react-icons/ri';

export default function Profile() {
  const { currentUser, authLoading, allTasks, projects, openTask } = useApp();

  // Show spinner while session is restoring — never go blank
  if (authLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center py-24">
        <RiLoader4Line className="animate-spin text-3xl text-olive" />
      </div>
    );
  }

  // Tasks calculations
  const assignedTasks = allTasks.filter(t => (t.assignee?._id || t.assignee) === currentUser._id);
  
  // Completed/Active tasks
  const completedTasks = assignedTasks.filter(t => t.status === 'done');
  const activeTasks = assignedTasks.filter(t => t.status !== 'done');

  // Productivity metrics
  const completionRate = assignedTasks.length > 0 
    ? Math.round((completedTasks.length / assignedTasks.length) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Banner / Cover and Avatar block */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-surface">
        <div className="h-32 bg-gradient-to-r from-bronze-dark to-olive opacity-40" />
        <div className="p-6 relative flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-10">
          <div className="relative">
            <Avatar user={currentUser} size="xl" className="ring-4 ring-smoky bg-surface" />
          </div>
          <div className="flex-1 min-w-0 pt-2 sm:pt-0">
            <h1 className="text-xl font-bold text-floral leading-tight">{currentUser.name}</h1>
            <p className="text-sm text-olive">{currentUser.role} · {currentUser.email}</p>
          </div>
          <button className="btn-secondary text-xs self-start sm:self-auto">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Assigned Tasks', value: assignedTasks.length, icon: RiTimeLine, color: 'text-bone' },
          { label: 'Completed Tasks', value: completedTasks.length, icon: RiCheckboxCircleLine, color: 'text-green-400' },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: RiAwardLine, color: 'text-bronze-light' },
          { label: 'Active Projects', value: projects.length, icon: RiGitMergeLine, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-olive mb-0.5">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
            <stat.icon className="text-2xl text-olive/40" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Active Assigned Tasks list */}
        <div className="md:col-span-2 space-y-3">
          <h2 className="section-title">Active Assignments ({activeTasks.length})</h2>
          <div className="space-y-3">
            {activeTasks.length === 0 ? (
              <div className="card p-6 text-center text-olive text-sm">
                No active tasks assigned to you.
              </div>
            ) : (
              activeTasks.map(task => (
                <div
                  key={task._id || task.id}
                  onClick={() => openTask(task)}
                  className="card card-hover p-4 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-bone truncate">{task.title}</p>
                    <p className="text-xs text-olive mt-1 flex items-center gap-1">
                      <RiCalendarCheckLine className="text-xs" />
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
                    </p>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Productivity highlights */}
        <div className="space-y-3">
          <h2 className="section-title">Productivity Insights</h2>
          <div className="card p-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-olive">Weekly Target</span>
                <span className="text-bone">4/5 tasks</span>
              </div>
              <div className="w-full h-1.5 bg-surface-2 rounded-full">
                <div className="h-full bg-bronze rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-olive">Focus Hours</span>
                <span className="text-bone">18.5 hrs</span>
              </div>
              <div className="w-full h-1.5 bg-surface-2 rounded-full">
                <div className="h-full bg-bronze rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-olive leading-relaxed">
                🎉 You completed <strong className="text-bone">2 tasks</strong> ahead of their deadlines this week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
