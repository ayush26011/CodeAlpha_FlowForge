import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { RiAddLine, RiSettings3Line, RiKanbanView2, RiTimeLine } from 'react-icons/ri';

const container = { animate: { transition: { staggerChildren: 0.07 } } };
const item = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function Workspace() {
  const { activeWorkspace, projects, allTasks } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('projects');

  if (!activeWorkspace) return null;

  const wsProjects = projects;
  const wsMembers = (activeWorkspace.members || []).map(m => ({
    ...(m.user || m),
    id: m.user?._id || m.user || m._id,
    role: m.role || m.user?.role || 'Member'
  }));

  const creationDate = activeWorkspace.createdAt
    ? new Date(activeWorkspace.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

  // Build an activity feed from recent real tasks
  const recentActivity = [...allTasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 8)
    .map(t => {
      const assignee = t.assignee;
      const when = t.updatedAt || t.createdAt;
      const timeAgo = (() => {
        if (!when) return '';
        const diff = Date.now() - new Date(when).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
      })();
      return { task: t, assignee, timeAgo };
    });

  return (
    <motion.div variants={container} initial="initial" animate="animate" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={item} className="card p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-surface-3 flex items-center justify-center text-3xl">
          {activeWorkspace.icon}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-floral">{activeWorkspace.name}</h1>
          <p className="text-olive text-sm mt-0.5">{activeWorkspace.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-olive">{wsMembers.length} members</span>
            <span className="text-xs text-olive/40">·</span>
            <span className="text-xs text-olive">{wsProjects.length} projects</span>
            <span className="text-xs text-olive/40">·</span>
            <span className="text-xs text-olive">Created {creationDate}</span>
          </div>
        </div>
        <button className="btn-ghost p-2" onClick={() => navigate('/settings')}><RiSettings3Line className="text-lg" /></button>
      </motion.div>

      {/* Members */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Members</h2>
          <button className="btn-primary text-xs px-3 py-1.5" onClick={() => navigate('/team')}><RiAddLine />Invite</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {wsMembers.map(member => (
            <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors">
              <Avatar user={member} size="md" showStatus />
              <div className="min-w-0">
                <p className="text-sm font-medium text-bone truncate">{member.name}</p>
                <p className="text-xs text-olive">{member.role}</p>
              </div>
            </div>
          ))}
          <button
            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border hover:border-bronze/40 hover:bg-bronze/5 transition-all text-olive hover:text-bone text-sm"
            onClick={() => navigate('/team')}
          >
            <RiAddLine /> Invite member
          </button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item}>
        <div className="flex border-b border-border mb-5">
          {['projects', 'activity'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors
                ${tab === t ? 'border-bronze text-bone' : 'border-transparent text-olive hover:text-bone'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'projects' ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Projects</h2>
              <button className="btn-primary text-xs px-3 py-1.5" onClick={() => navigate('/settings')}><RiAddLine />New Project</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {wsProjects.length === 0 ? (
                <div className="card p-8 text-center col-span-full">
                  <p className="text-olive">No projects yet. Create one in Settings.</p>
                </div>
              ) : wsProjects.map(project => {
                const members = (project.members || []).map(m => ({ ...m, id: m._id }));
                const progress = project.taskCount > 0 ? Math.round((project.completedCount / project.taskCount) * 100) : 0;
                const dueDateStr = project.dueDate
                  ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'No due date';
                return (
                  <motion.div
                    key={project._id}
                    variants={item}
                    onClick={() => navigate('/board')}
                    className="card card-hover p-5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
                          style={{ backgroundColor: project.color + '22', color: project.color }}
                        >
                          {project.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-bone">{project.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${project.status === 'active' ? 'text-green-400 bg-green-900/20' : 'text-olive bg-surface-3'}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <button className="btn-ghost p-1.5" onClick={e => { e.stopPropagation(); navigate('/board'); }}>
                        <RiKanbanView2 className="text-base" />
                      </button>
                    </div>
                    <p className="text-xs text-olive mb-4 line-clamp-2">{project.description}</p>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-olive">{project.completedCount || 0}/{project.taskCount || 0} tasks</span>
                      <span className="text-xs text-bone font-medium">{progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-2 rounded-full mb-3">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, backgroundColor: project.color }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <AvatarGroup users={members} max={3} size="xs" />
                      <p className="text-xs text-olive">Due {dueDateStr}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="card p-5 space-y-4">
            <h2 className="section-title mb-2">Recent Activity</h2>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-olive text-center py-4">No activity yet.</p>
            ) : recentActivity.map(({ task, assignee, timeAgo }, i) => (
              <div key={task._id || i} className="flex gap-3 items-start">
                <Avatar user={assignee || { name: 'System', avatar: '' }} size="sm" />
                <div className="flex-1">
                  <p className="text-sm text-olive">
                    <span className="text-bone font-medium">{assignee?.name || 'Someone'}</span>
                    {' '}updated{' '}
                    <span className="text-bone">{task.title}</span>
                    {' '}→{' '}
                    <span className="capitalize text-bronze">{task.status}</span>
                  </p>
                  <p className="text-xs text-olive/60 mt-0.5 flex items-center gap-1">
                    <RiTimeLine className="text-xs" /> {timeAgo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
