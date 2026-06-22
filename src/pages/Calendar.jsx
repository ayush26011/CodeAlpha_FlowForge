import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import taskService from '../services/taskService';
import { RiCalendarEventLine, RiArrowLeftSLine, RiArrowRightSLine, RiAddLine, RiCloseLine } from 'react-icons/ri';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar() {
  const { allTasks, openTask, activeWorkspace, projects, currentUser, loadTasks, showToast, activeProject, setActiveProject } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to current month
  const [viewMode, setViewMode] = useState('month'); // month | week

  useEffect(() => {
    if (!activeProject && projects && projects.length > 0) {
      setActiveProject(projects[0]);
    }
  }, [activeProject, projects, setActiveProject]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    projectId: '',
    priority: 'medium',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Find tasks belonging to a specific date (YYYY-MM-DD)
  const getTasksForDate = (dateStr) => {
    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      let datePart = '';
      try {
        if (typeof task.dueDate === 'string') {
          datePart = task.dueDate.substring(0, 10);
        } else {
          datePart = new Date(task.dueDate).toISOString().substring(0, 10);
        }
      } catch (e) {
        const d = new Date(task.dueDate);
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        datePart = `${y}-${m}-${day}`;
      }
      return datePart === dateStr;
    });
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    
    const selectedProjectId = form.projectId || (projects.length > 0 ? projects[0]._id : null);
    if (!selectedProjectId) {
      showToast('Create a project first before adding tasks.', 'error');
      return;
    }
    if (!activeWorkspace) {
      showToast('Please select a workspace first.', 'error');
      return;
    }

    try {
      setCreating(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: 'todo',
        projectId: selectedProjectId,
        project: selectedProjectId,
        workspaceId: activeWorkspace._id,
        workspace: activeWorkspace._id,
        assignee: currentUser._id,
        dueDate: form.dueDate || new Date().toISOString().split('T')[0],
      };
      await taskService.create(payload);
      await loadTasks();
      showToast('Task added to calendar!', 'success');
      setShowAddModal(false);
      setForm({ title: '', description: '', dueDate: '', projectId: '', priority: 'medium' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCreating(false);
    }
  };

  // Render Month View Grid
  const renderMonthGrid = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;
    const gridCells = [];

    for (let i = 0; i < totalSlots; i++) {
      const cellDate = new Date(year, month, 1 - firstDay + i);
      const cellYear = cellDate.getFullYear();
      const cellMonth = cellDate.getMonth();
      const cellDay = cellDate.getDate();
      const isCurrentMonth = cellMonth === month;
      const dateStr = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(cellDay).padStart(2, '0')}`;
      
      gridCells.push({
        day: cellDay,
        isCurrentMonth,
        dateStr
      });
    }

    return (
      <div className="grid grid-cols-7 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="bg-surface-2 p-3 text-center text-xs font-semibold text-olive border-b border-border">
            {d}
          </div>
        ))}
        {gridCells.map((cell, idx) => {
          const dayTasks = getTasksForDate(cell.dateStr);
          return (
            <div
              key={idx}
              className={`bg-surface p-2.5 min-h-[120px] flex flex-col justify-between transition-colors hover:bg-surface-2/40
                ${cell.isCurrentMonth ? '' : 'opacity-40'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold ${cell.isCurrentMonth ? 'text-bone' : 'text-olive'}`}>
                  {cell.day}
                </span>
                {dayTasks.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-bronze" />
                )}
              </div>
              <div className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar max-h-[80px]">
                {dayTasks.slice(0, 3).map(task => {
                  return (
                    <div
                      key={task._id || task.id}
                      onClick={() => openTask(task)}
                      className="p-1 px-2 text-[10px] font-medium rounded-lg bg-surface-3 border border-border-light hover:border-bronze/40 cursor-pointer truncate text-bone"
                    >
                      {task.title}
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-[9px] text-olive font-medium pl-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const hasProjects = projects.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <RiCalendarEventLine className="text-bronze text-2xl" />
          <h1 className="page-title">{MONTHS[month]} {year}</h1>
          <div className="flex items-center gap-1.5 ml-2">
            <button onClick={prevMonth} className="btn-ghost p-1.5">
              <RiArrowLeftSLine className="text-lg" />
            </button>
            <button onClick={nextMonth} className="btn-ghost p-1.5">
              <RiArrowRightSLine className="text-lg" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-surface-2 border border-border p-1">
            {['month', 'week'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all
                  ${viewMode === mode ? 'bg-surface-3 text-bone shadow-card' : 'text-olive hover:text-bone'}`}
              >
                {mode}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              const defaultProjId = activeProject?._id || (projects.length > 0 ? projects[0]._id : '');
              setForm(f => ({
                ...f,
                title: '',
                description: '',
                projectId: defaultProjId,
                dueDate: new Date().toISOString().split('T')[0]
              }));
              setShowAddModal(true);
            }}
            className="btn-primary text-xs"
          >
            <RiAddLine /> Add Event
          </button>
        </div>
      </div>

      {/* Grid */}
      {viewMode === 'month' ? (
        renderMonthGrid()
      ) : (
        <div className="card p-12 text-center text-olive bg-surface flex flex-col items-center justify-center border border-border rounded-2xl">
          <RiCalendarEventLine className="text-5xl opacity-20 mb-3" />
          <p className="text-sm font-medium">Weekly view is currently being forged.</p>
          <p className="text-xs text-olive/60 mt-1">Please toggle back to Monthly layout.</p>
        </div>
      )}

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
                <h2 className="text-lg font-bold text-floral">Add Task / Event</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-ghost p-1.5"
                >
                  <RiCloseLine className="text-xl" />
                </button>
              </div>

              {!hasProjects ? (
                <div className="text-center p-4">
                  <p className="text-sm text-red-400 font-semibold">Create a project first before adding tasks.</p>
                  <button
                    onClick={() => { setShowAddModal(false); }}
                    className="btn-secondary text-xs mt-3"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="label">Title *</label>
                    <input
                      required
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Event or Task title..."
                      className="input text-xs"
                    />
                  </div>

                  <div>
                    <label className="label">Description <span className="text-olive/50">(optional)</span></label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Add details..."
                      className="input resize-none text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Project *</label>
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

                    <div>
                      <label className="label">Priority</label>
                      <select
                        value={form.priority}
                        onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                        className="input text-xs"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={form.dueDate}
                      onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                      className="input text-xs"
                    />
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
                      disabled={creating}
                      className="btn-primary text-xs disabled:opacity-50"
                    >
                      {creating ? 'Adding...' : 'Add Event'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
