import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Avatar, AvatarGroup } from '../components/ui/Avatar';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import workspaceService from '../services/workspaceService';
import {
  RiAddLine, RiSettings3Line, RiKanbanView2, RiTimeLine,
  RiCloseLine, RiLoader4Line, RiRefreshLine,
} from 'react-icons/ri';

const container = { animate: { transition: { staggerChildren: 0.07 } } };
const item      = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

// ── Emoji options for workspace icon ─────────────────────────────────────────
const ICONS = ['📁','🚀','💡','⚡','🔥','🎯','🌟','🛠️','📊','🎨','🌐','🧩'];

// ── Create Workspace Modal ────────────────────────────────────────────────────
function CreateWorkspaceModal({ onClose, onCreated }) {
  const [name, setName]           = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon]           = useState('📁');
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Workspace name is required'); return; }
    setSaving(true);
    setError('');
    try {
      const ws = await workspaceService.create({ name: name.trim(), description: description.trim(), icon });
      onCreated(ws);
    } catch (err) {
      setError(err.message || 'Failed to create workspace');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-smoky/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="card w-full max-w-md p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-floral">Create Workspace</h2>
          <button id="close-create-workspace" onClick={onClose} className="btn-ghost p-1.5">
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Icon picker */}
          <div>
            <label className="block text-xs text-olive mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(em => (
                <button
                  key={em} type="button"
                  onClick={() => setIcon(em)}
                  className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all
                    ${icon === em ? 'bg-bronze/30 ring-1 ring-bronze' : 'bg-surface-2 hover:bg-surface-3'}`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs text-olive mb-1.5" htmlFor="ws-name">
              Workspace Name <span className="text-red-400">*</span>
            </label>
            <input
              id="ws-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Design Team, Engineering, Marketing"
              className="input w-full"
              autoFocus
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs text-olive mb-1.5" htmlFor="ws-desc">
              Description <span className="text-olive/50">(optional)</span>
            </label>
            <textarea
              id="ws-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this workspace for?"
              className="input w-full resize-none"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              id="submit-create-workspace"
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving ? <RiLoader4Line className="animate-spin" /> : <RiAddLine />}
              {saving ? 'Creating…' : 'Create Workspace'}
            </button>
            <button
              id="cancel-create-workspace"
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Create Project Modal ──────────────────────────────────────────────────────
function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate]         = useState('');
  const [color, setColor]             = useState('#8B7355');
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');

  const colors = ['#8B7355', '#4E6A56', '#8B5A2B', '#5C6C7C', '#8A6D3B', '#7A6B8A'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Project name is required'); return; }
    setSaving(true);
    setError('');
    try {
      await onCreated({ name: name.trim(), description: description.trim(), dueDate, color });
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-smoky/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="card w-full max-w-md p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-floral">Create Project</h2>
          <button id="close-create-project" onClick={onClose} className="btn-ghost p-1.5">
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-olive mb-1.5" htmlFor="proj-name">
              Project Name <span className="text-red-400">*</span>
            </label>
            <input
              id="proj-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Website V2, Q3 Campaign, Mobile App"
              className="input w-full text-xs"
              autoFocus
              maxLength={150}
            />
          </div>

          <div>
            <label className="block text-xs text-olive mb-1.5" htmlFor="proj-desc">
              Description <span className="text-olive/50">(optional)</span>
            </label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What is this project about?"
              className="input w-full resize-none text-xs"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-olive mb-1.5">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="input w-full text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-olive mb-2">Color Tag</label>
              <div className="flex gap-1.5 flex-wrap">
                {colors.map(c => (
                  <button
                    key={c} type="button"
                    onClick={() => setColor(c)}
                    className="w-6 h-6 rounded-lg transition-transform hover:scale-110"
                    style={{ backgroundColor: c, border: color === c ? '2px solid #FFFBF4' : 'none' }}
                  />
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              id="submit-create-project"
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving ? <RiLoader4Line className="animate-spin" /> : <RiAddLine />}
              {saving ? 'Creating…' : 'Create Project'}
            </button>
            <button
              id="cancel-create-project"
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Workspace Card (populated state) ─────────────────────────────────────────
function WorkspaceCard({ ws, isActive, onClick }) {
  const members = (ws.members || []).map(m => ({
    ...(m.user || m),
    id: m.user?._id || m.user || m._id,
  }));

  return (
    <motion.div
      variants={item}
      onClick={onClick}
      className={`card card-hover p-5 cursor-pointer ${isActive ? 'ring-1 ring-bronze/50' : ''}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-2xl bg-surface-3 flex items-center justify-center text-2xl flex-shrink-0">
          {ws.icon || '📁'}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-bone truncate">{ws.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-olive">{ws.members?.length || 0} members</span>
            {isActive && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-bronze/20 text-bronze">Active</span>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-olive leading-relaxed mb-4 line-clamp-2 min-h-[2rem]">
        {ws.description || 'No description'}
      </p>
      <AvatarGroup users={members} max={4} size="xs" />
    </motion.div>
  );
}

// ── Skeleton loading state ────────────────────────────────────────────────────
function WorkspaceSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="card p-6 flex items-center gap-5 animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-surface-3" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-48 bg-surface-3 rounded" />
          <div className="h-3 w-64 bg-surface-3 rounded" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <SkeletonCard key={i} lines={4} />)}
      </div>
    </div>
  );
}

// ── Active workspace detail panel ─────────────────────────────────────────────
function WorkspaceDetail({ workspace, projects, allTasks, navigate, setActiveProject, onCreateProject }) {
  const [tab, setTab] = useState('projects');

  const wsMembers = (workspace.members || []).map(m => ({
    ...(m.user || m),
    id: m.user?._id || m.user || m._id,
    role: m.role || m.user?.role || 'Member',
  }));

  const creationDate = workspace.createdAt
    ? new Date(workspace.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';

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
    <motion.div variants={container} initial="initial" animate="animate" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="card p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-surface-3 flex items-center justify-center text-3xl">
          {workspace.icon || '📁'}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-floral">{workspace.name}</h1>
          <p className="text-olive text-sm mt-0.5">{workspace.description || 'No description'}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-xs text-olive">{wsMembers.length} members</span>
            <span className="text-xs text-olive/40">·</span>
            <span className="text-xs text-olive">{projects.length} projects</span>
            <span className="text-xs text-olive/40">·</span>
            <span className="text-xs text-olive">Created {creationDate}</span>
          </div>
        </div>
        <button className="btn-ghost p-2" onClick={() => navigate('/settings')}>
          <RiSettings3Line className="text-lg" />
        </button>
      </motion.div>

      {/* Members */}
      <motion.div variants={item} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Members</h2>
          <button id="invite-member" className="btn-primary text-xs px-3 py-1.5" onClick={() => navigate('/team')}>
            <RiAddLine /> Invite
          </button>
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
            id="invite-member-tile"
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
              <button id="new-project-btn" className="btn-primary text-xs px-3 py-1.5" onClick={onCreateProject}>
                <RiAddLine /> New Project
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <div className="card p-8 text-center col-span-full">
                  <p className="text-4xl mb-3 opacity-40">🗂️</p>
                  <p className="text-sm font-semibold text-bone mb-1">No projects yet</p>
                  <p className="text-xs text-olive mb-4">Create your first project to start tracking work.</p>
                  <button id="create-project-cta" className="btn-primary mx-auto" onClick={onCreateProject}>
                    <RiAddLine /> Create Project
                  </button>
                </div>
              ) : projects.map(project => {
                const members  = (project.members || []).map(m => ({ ...m, id: m._id }));
                const progress = project.taskCount > 0 ? Math.round((project.completedCount / project.taskCount) * 100) : 0;
                const dueDateStr = project.dueDate
                  ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'No due date';
                return (
                  <motion.div
                    key={project._id}
                    variants={item}
                    onClick={() => { setActiveProject(project); navigate('/board'); }}
                    className="card card-hover p-5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold"
                          style={{ backgroundColor: (project.color || '#8B7355') + '22', color: project.color || '#8B7355' }}
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
                        style={{ width: `${progress}%`, backgroundColor: project.color || '#8B7355' }}
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

// ── Main Workspace page ───────────────────────────────────────────────────────
export default function Workspace() {
  const {
    workspaces, activeWorkspace, setActiveWorkspace,
    projects, allTasks, loading, error,
    loadWorkspaces, showToast, setActiveProject, createProject
  } = useApp();
  const navigate  = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
 
  // ── After workspace is created, inject into context ───────────────────────
  const handleWorkspaceCreated = useCallback((ws) => {
    // AppContext.loadWorkspaces will re-fetch; but also eagerly update:
    loadWorkspaces();
    setActiveWorkspace(ws);
    setShowCreateModal(false);
    showToast(`Workspace "${ws.name}" created!`, 'success');
  }, [loadWorkspaces, setActiveWorkspace, showToast]);

  const handleProjectCreated = async (projData) => {
    try {
      const proj = await createProject(projData);
      if (proj) {
        setShowCreateProjectModal(false);
        showToast(`Project "${proj.name}" created!`, 'success');
        navigate('/board');
      }
    } catch (e) {
      showToast(e.message || 'Failed to create project', 'error');
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading.workspace && workspaces.length === 0) {
    return <WorkspaceSkeleton />;
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error && workspaces.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="card p-10 flex flex-col items-center text-center space-y-4">
          <p className="text-4xl">⚠️</p>
          <p className="text-bone font-semibold">Failed to load workspaces</p>
          <p className="text-sm text-olive">{error}</p>
          <button id="retry-load-workspaces" onClick={loadWorkspaces} className="btn-primary flex items-center gap-2">
            <RiRefreshLine /> Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Empty state: no workspaces ────────────────────────────────────────────
  const hasWorkspaces = workspaces.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page header — always visible */}
      <motion.div variants={item} initial="initial" animate="animate"
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-floral">Workspaces</h1>
          <p className="text-sm text-olive mt-0.5">
            {hasWorkspaces
              ? `${workspaces.length} workspace${workspaces.length !== 1 ? 's' : ''} — click any card to make it active`
              : 'Get started by creating your first workspace'}
          </p>
        </div>
        <button
          id="create-workspace-btn"
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <RiAddLine /> Create Workspace
        </button>
      </motion.div>

      {/* Workspace grid or empty state */}
      {!hasWorkspaces ? (
        <motion.div variants={item} initial="initial" animate="animate" className="card">
          <EmptyState
            icon="🗂️"
            title="No Workspaces Yet"
            description="Create your first workspace to start managing projects and tasks with your team."
            action={{ label: 'Create Workspace', onClick: () => setShowCreateModal(true) }}
          />
        </motion.div>
      ) : (
        <>
          {/* Workspace selector grid */}
          <motion.div
            variants={container} initial="initial" animate="animate"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {workspaces.map(ws => (
              <WorkspaceCard
                key={ws._id}
                ws={ws}
                isActive={activeWorkspace?._id === ws._id}
                onClick={() => setActiveWorkspace(ws)}
              />
            ))}
          </motion.div>

          {/* Active workspace detail */}
          {activeWorkspace && (
            <WorkspaceDetail
              workspace={activeWorkspace}
              projects={projects}
              allTasks={allTasks}
              navigate={navigate}
              setActiveProject={setActiveProject}
              onCreateProject={() => setShowCreateProjectModal(true)}
            />
          )}
        </>
      )}

      {/* Create Workspace / Project Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateWorkspaceModal
            onClose={() => setShowCreateModal(false)}
            onCreated={handleWorkspaceCreated}
          />
        )}
        {showCreateProjectModal && (
          <CreateProjectModal
            onClose={() => setShowCreateProjectModal(false)}
            onCreated={handleProjectCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
