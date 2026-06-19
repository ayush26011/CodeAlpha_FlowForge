import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import commentService from '../../services/commentService';
import socketService from '../../services/socketService';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge, StatusBadge, LabelBadge } from '../ui/Badge';
import {
  RiCloseLine, RiCalendarLine, RiUserLine, RiFlag2Line,
  RiChat1Line, RiCheckboxLine, RiCheckboxBlankLine,
  RiAddLine, RiTimeLine, RiEditLine,
} from 'react-icons/ri';

const colLabels = { backlog: 'Backlog', todo: 'To Do', inprogress: 'In Progress', review: 'Review', done: 'Done' };

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function TaskDetailModal({ task, onClose }) {
  const { moveTask, currentUser, showToast } = useApp();
  const [checklist, setChecklist] = useState(task.checklist || []);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  const assignee = task.assignee;
  const currentCol = task.status || 'todo';

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const list = await commentService.getByTask(task._id || task.id);
        setComments(list);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [task._id, task.id]);

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;
    const handleCommentAdded = (newCm) => {
      if (newCm.task === (task._id || task.id)) {
        setComments(prev => {
          if (prev.find(c => c._id === newCm._id)) return prev;
          return [...prev, newCm];
        });
      }
    };
    const off = socketService.on('comment_added', handleCommentAdded);
    return () => off();
  }, [task._id, task.id]);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const newCm = await commentService.add(task._id || task.id, comment.trim());
      setComments(prev => [...prev, newCm]);
      setComment('');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const doneCount = checklist.filter(c => c.done).length;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="flex-1 bg-smoky/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="w-full max-w-xl bg-surface border-l border-border overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-border sticky top-0 bg-surface z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={currentCol} />
            </div>
            <h2 className="text-lg font-bold text-floral leading-snug">{task.title}</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 flex-shrink-0 -mt-1">
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-5">
          {['details', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors duration-200
                ${activeTab === tab ? 'border-bronze text-bone' : 'border-transparent text-olive hover:text-bone'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 p-5 space-y-6">
          {activeTab === 'details' ? (
            <>
              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-1.5"><RiUserLine />Assignee</label>
                  <div className="flex items-center gap-2">
                    {assignee ? (
                      <>
                        <Avatar user={assignee} size="sm" />
                        <span className="text-sm text-bone">{assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-sm text-olive">Unassigned</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><RiCalendarLine />Due Date</label>
                  <p className="text-sm text-bone">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No due date'}
                  </p>
                </div>
                <div>
                  <label className="label flex items-center gap-1.5"><RiFlag2Line />Priority</label>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    defaultValue={currentCol}
                    onChange={e => moveTask(task._id || task.id, currentCol, e.target.value)}
                    className="input text-sm py-1.5"
                  >
                    {Object.entries(colLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Labels */}
              {task.labels?.length > 0 && (
                <div>
                  <label className="label">Labels</label>
                  <div className="flex flex-wrap gap-1.5">
                    {task.labels.map(l => <LabelBadge key={l} label={l} />)}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="label flex items-center gap-1.5"><RiEditLine />Description</label>
                <p className="text-sm text-olive leading-relaxed bg-surface-2 rounded-xl p-3 border border-border">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              {/* Checklist */}
              {checklist.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label flex items-center gap-1.5 mb-0"><RiCheckboxLine />Checklist</label>
                    <span className="text-xs text-olive">{doneCount}/{checklist.length}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-surface-3 rounded-full mb-3">
                    <div
                      className="h-full bg-bronze rounded-full transition-all duration-300"
                      style={{ width: `${checklist.length ? (doneCount / checklist.length) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="space-y-2">
                    {checklist.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="w-full flex items-center gap-3 text-left group"
                      >
                        {item.done
                          ? <RiCheckboxLine className="text-bronze flex-shrink-0 text-lg" />
                          : <RiCheckboxBlankLine className="text-olive flex-shrink-0 text-lg group-hover:text-bone transition-colors" />
                        }
                        <span className={`text-sm transition-colors ${item.done ? 'line-through text-olive' : 'text-bone'}`}>
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <label className="label flex items-center gap-1.5"><RiChat1Line />Comments</label>
                <div className="space-y-4 mb-4">
                  {loadingComments ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-bronze" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-sm text-olive">No comments yet.</p>
                  ) : comments.map(cm => {
                    const user = cm.user || { name: 'System User', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=System' };
                    return (
                      <div key={cm._id || cm.id} className="flex gap-3">
                        <Avatar user={user} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-bone">{user.name}</span>
                            <span className="text-xs text-olive">{formatTime(cm.createdAt)}</span>
                          </div>
                          <p className="text-sm text-olive leading-relaxed bg-surface-2 rounded-xl px-3 py-2 border border-border">
                            {cm.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <form onSubmit={submitComment} className="flex gap-2">
                  <Avatar user={currentUser} size="sm" />
                  <input
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="input flex-1 text-sm"
                  />
                  <button type="submit" className="btn-primary px-3 py-2">
                    <RiAddLine />
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* Activity Timeline */
            <div className="space-y-4">
              <label className="label flex items-center gap-1.5"><RiTimeLine />Activity Timeline</label>
              {[
                { text: `${assignee?.name} was assigned this task`, time: '2 days ago' },
                { text: 'Task moved to In Progress', time: '1 day ago' },
                { text: 'Priority set to ' + task.priority, time: '3 hours ago' },
                { text: 'Due date set', time: '1 hour ago' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-bronze mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-olive">{item.text}</p>
                    <p className="text-xs text-olive/60 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
