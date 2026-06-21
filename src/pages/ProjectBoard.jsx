import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext } from '@hello-pangea/dnd';
import { useApp } from '../context/AppContext';
import taskService from '../services/taskService';
import KanbanColumn from '../components/board/KanbanColumn';
import { RiFilter3Line, RiAddLine, RiLayoutGridLine, RiCloseLine } from 'react-icons/ri';

const COLUMNS = ['backlog', 'todo', 'inprogress', 'review', 'done'];

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function ProjectBoard() {
  const { tasks, moveTask, reorderTasks, activeProject, activeWorkspace, currentUser, loadTasks, showToast } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
    labels: '',
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const srcCol = source.droppableId;
    const dstCol = destination.droppableId;

    if (srcCol === dstCol) {
      reorderTasks(srcCol, source.index, destination.index);
    } else {
      // Use _id (MongoDB) with fallback to id (mock data)
      const task = tasks[srcCol][source.index];
      const taskId = task?._id || task?.id;
      if (taskId) moveTask(taskId, srcCol, dstCol);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (!activeProject || !activeWorkspace) {
      showToast('No active project selected.', 'error');
      return;
    }
    try {
      setCreating(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        projectId: activeProject._id,
        workspaceId: activeWorkspace._id,
        assignee: currentUser._id,
        ...(form.dueDate ? { dueDate: form.dueDate } : {}),
        ...(form.labels.trim() ? { labels: form.labels.split(',').map(l => l.trim()).filter(Boolean) } : {}),
      };
      await taskService.create(payload);
      await loadTasks();
      showToast('Task created!', 'success');
      setShowAddModal(false);
      setForm({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', labels: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

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
            {activeProject && (
              <p className="text-2xs text-olive">{activeWorkspace?.name}</p>
            )}
          </div>
        </div>
        <div className="flex-1" />
        <button className="btn-ghost text-sm gap-1.5">
          <RiFilter3Line className="text-base" />Filter
        </button>
        <button
          id="add-task-btn"
          className="btn-primary text-sm"
          onClick={() => setShowAddModal(true)}
        >
          <RiAddLine />Add Task
        </button>
      </motion.div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
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

              {activeProject ? (
                <p className="text-xs text-olive -mt-3">
                  Adding to <span className="text-bone font-medium">{activeProject.name}</span>
                </p>
              ) : (
                <p className="text-xs text-red-400 -mt-3">
                  No project selected. Switch workspaces or create a project first.
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
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="What needs to be done?"
                    className="input resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Priority</label>
                    <select
                      value={form.priority}
                      onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                      className="input"
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
                      className="input"
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
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Labels <span className="text-olive/60">(comma separated)</span></label>
                    <input
                      value={form.labels}
                      onChange={e => setForm(f => ({ ...f, labels: e.target.value }))}
                      placeholder="Frontend, API, Bug"
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !activeProject}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
