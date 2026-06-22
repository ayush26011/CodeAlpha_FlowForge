import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext } from '@hello-pangea/dnd';
import { useApp } from '../context/AppContext';
import taskService from '../services/taskService';
import KanbanColumn from '../components/board/KanbanColumn';
import { RiFilter3Line, RiAddLine, RiLayoutGridLine, RiCloseLine } from 'react-icons/ri';

const COLUMNS = ['backlog', 'todo', 'inprogress', 'review', 'done'];

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function ProjectBoard() {
  const { tasks, moveTask, reorderTasks, activeProject, setActiveProject, activeWorkspace, projects, currentUser, loadTasks, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    labels: '',
    projectId: '',
  });

  const handleOpenAddModal = () => {
    const defaultProjId = activeProject?._id || (projects.length > 0 ? projects[0]._id : '');
    setForm(f => ({
      ...f,
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      labels: '',
      projectId: defaultProjId,
    }));
    setShowAddModal(true);
  };

  useEffect(() => {
    if (!activeProject && projects && projects.length > 0) {
      setActiveProject(projects[0]);
    }
  }, [activeProject, projects, setActiveProject]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcCol = source.droppableId;
    const dstCol = destination.droppableId;

    if (srcCol === dstCol) {
      reorderTasks(srcCol, source.index, destination.index);
    } else {
      const task = tasks[srcCol][source.index];
      const taskId = task?._id || task?.id;
      if (taskId) moveTask(taskId, srcCol, dstCol);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const selectedProjectId = activeProject?._id || form.projectId || (projects.length > 0 ? projects[0]._id : null);
    if (!selectedProjectId) {
      showToast('Please select a project or create one first.', 'error');
      return;
    }
    if (!activeWorkspace) {
      showToast('No active workspace selected.', 'error');
      return;
    }

    try {
      setCreating(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        projectId: selectedProjectId,
        project: selectedProjectId,
        workspaceId: activeWorkspace._id,
        workspace: activeWorkspace._id,
        assignee: currentUser._id,
        ...(form.dueDate ? { dueDate: form.dueDate } : {}),
        ...(form.labels.trim() ? { labels: form.labels.split(',').map(l => l.trim()).filter(Boolean) } : {}),
      };
      await taskService.create(payload);
      await loadTasks();
      showToast('Task created!', 'success');
      setShowAddModal(false);
      setForm({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', labels: '', projectId: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  const hasProjects = projects.length > 0;
  const currentProjectName = activeProject ? activeProject.name : (hasProjects ? 'No Project Selected' : 'No Projects');

  return (
    <div className="flex flex-col h-full">
      {/* Board Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-5 flex-wrap"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(155,130,96,0.12)', border: '1px solid rgba(155,130,96,0.2)' }}
          >
            <RiLayoutGridLine className="text-bronze text-sm" />
          </div>
          <div>
            <h1 className="text-base font-bold text-floral tracking-tight">
              {activeProject ? activeProject.name : 'Project Board'}
            </h1>
            {activeWorkspace && (
              <p className="text-2xs text-olive">{activeWorkspace.name}</p>
            )}
          </div>
        </div>

        {/* Project Selector dropdown in board header if no project is active */}
        {!activeProject && hasProjects && (
          <select
            onChange={(e) => {
              const proj = projects.find(p => p._id === e.target.value);
              if (proj) setActiveProject(proj);
            }}
            value=""
            className="input max-w-xs text-xs py-1.5 px-3 bg-surface border border-border"
          >
            <option value="" disabled>Select Project...</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        )}

        <div className="flex-1" />
        <button className="btn-ghost text-sm gap-1.5">
          <RiFilter3Line className="text-base" />Filter
        </button>
        <button
          id="add-task-btn"
          className="btn-primary text-sm"
          onClick={handleOpenAddModal}
        >
          <RiAddLine />Add Task
        </button>
      </motion.div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        {!activeProject && !hasProjects ? (
          <div className="card p-12 text-center text-olive bg-surface flex flex-col items-center justify-center border border-border rounded-2xl max-w-xl mx-auto mt-10">
            <RiLayoutGridLine className="text-5xl opacity-20 mb-3" />
            <p className="text-sm font-medium">Create a project first.</p>
            <p className="text-xs text-olive/60 mt-1">Please head over to Workspace and add a new project to start adding tasks.</p>
          </div>
        ) : !activeProject ? (
          <div className="card p-12 text-center text-olive bg-surface flex flex-col items-center justify-center border border-border rounded-2xl max-w-xl mx-auto mt-10">
            <RiLayoutGridLine className="text-5xl opacity-20 mb-3" />
            <p className="text-sm font-medium">Select a project to view board.</p>
            <p className="text-xs text-olive/60 mt-1">Choose a project from the header select dropdown above to view the Kanban columns.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 min-w-max px-0.5 pb-2">
              {COLUMNS.map(col => (
                <KanbanColumn
                  key={col}
                  columnId={col}
                  tasks={tasks[col] || []}
                />
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-smoky/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="max-w-lg w-full p-6 relative z-10 space-y-5 rounded-2xl"
              style={{
                background: '#1A1B14',
                border: '1px solid rgba(42,44,34,0.9)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-floral">New Task</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost p-1.5"
                >
                  <RiCloseLine className="text-xl" />
                </button>
              </div>

              {projects.length === 1 ? (
                <p className="text-xs text-olive -mt-3">
                  Adding to <span className="text-bone font-medium">{projects[0].name}</span>
                </p>
              ) : projects.length > 1 ? (
                <div className="space-y-1.5">
                  <label className="label">Select Project</label>
                  <select
                    value={form.projectId}
                    onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}
                    className="input text-xs"
                  >
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-xs text-red-400 -mt-3">
                  Create a project first.
                </p>
              )}

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Task title..."
                    className="input text-xs"
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="What needs to be done?"
                    className="input resize-none text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Priority</label>
                    <select
                      value={form.priority}
                      onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                      className="input text-xs"
                    >
                      {PRIORITIES.map(p => (
                        <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                      className="input text-xs"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Due Date</label>
                    <input
                      type="date"
                      value={form.dueDate}
                      onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                      className="input text-xs"
                    />
                  </div>
                  <div>
                    <label className="label">Labels <span className="text-olive/60">(comma separated)</span></label>
                    <input
                      value={form.labels}
                      onChange={e => setForm(f => ({ ...f, labels: e.target.value }))}
                      placeholder="Frontend, API, Bug"
                      className="input text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || (!activeProject && !hasProjects)}
                    className="btn-primary text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creating ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
