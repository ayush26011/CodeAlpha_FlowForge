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
  RiAddLine, RiTimeLine, RiEditLine, RiInformationLine
} from 'react-icons/ri';

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
      {/* Backdrop glass */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="flex-1 bg-smoky/70 backdrop-blur-sm"
      />

      {/* Modern sliding sidebar drawer panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
        className="w-full max-w-lg overflow-y-auto flex flex-col border-l border-white/5 shadow-2xl relative"
        style={{
          background: 'rgba(17,18,13,0.95)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header container */}
        <div className="flex items-start gap-4 p-6 border-b border-olive/10 sticky top-0 bg-surface/90 backdrop-blur-md z-10">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={currentCol} />
            </div>
            <h2 className="text-base font-bold text-floral leading-snug">{task.title}</h2>
          </div>
          <button onClick={onClose} className="text-olive hover:text-bone p-1.5 rounded-lg hover:bg-white/5 transition-all">
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-olive/10 px-6">
          {['details', 'activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all relative
                ${activeTab === tab ? 'border-bronze text-bone' : 'border-transparent text-olive hover:text-bone'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modal content */}
        <div className="flex-1 p-6 space-y-6">
          {activeTab === 'details' ? (
            <>
              {/* Properties Grid layout */}
              <div
                className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-white/5"
                style={{ background: 'rgba(86,84,73,0.03)' }}
              >
                <div>
                  <label className="text-[10px] font-bold text-olive uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><RiUserLine /> Assignee</label>
                  <div className="flex items-center gap-2">
                    {assignee ? (
                      <>
                        <Avatar user={assignee} size="xs" />
                        <span className="text-xs text-bone font-medium">{assignee.name}</span>
                      </>
                    ) : (
                      <span className="text-xs text-olive/60 font-medium">Unassigned</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-olive uppercase tracking-wider flex items-center gap-1.5 mb-1.5"><RiCalendarLine /> Due Date</label>
                  <span className="text-xs text-bone font-medium flex items-center gap-1.5">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}
                  </span>
                </div>
              </div>

              {/* Task description */}
              {task.description && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-olive uppercase tracking-wider flex items-center gap-1.5"><RiInformationLine /> Description</h3>
                  <p className="text-xs text-olive-light leading-relaxed whitespace-pre-line p-4 rounded-xl border border-white/5 bg-white/2" style={{ background: 'rgba(86,84,73,0.02)' }}>
                    {task.description}
                  </p>
                </div>
              )}

              {/* Checklist updates */}
              {checklist.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-olive uppercase tracking-wider flex items-center gap-1.5"><RiCheckboxLine /> Checklist</h3>
                    <span className="text-[10px] font-bold text-olive/60 bg-white/5 border border-white/5 px-2 py-0.5 rounded">{doneCount}/{checklist.length}</span>
                  </div>

                  {/* Checklist progress bar */}
                  <div className="w-full h-1 bg-surface-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-bronze transition-all duration-300"
                      style={{ width: `${(doneCount / checklist.length) * 100}%` }}
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {checklist.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all text-left group"
                      >
                        {item.done ? (
                          <RiCheckboxLine className="text-bronze text-lg flex-shrink-0" />
                        ) : (
                          <RiCheckboxBlankLine className="text-olive group-hover:text-bone text-lg flex-shrink-0" />
                        )}
                        <span className={`text-xs ${item.done ? 'line-through text-olive/50' : 'text-bone'}`}>{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Comments section */
            <div className="space-y-6 flex flex-col h-full">
              {/* Form submit */}
              <form onSubmit={submitComment} className="space-y-3">
                <div className="relative">
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Ask a question or post an update..."
                    className="input resize-none pr-12 text-xs"
                  />
                  <button
                    type="submit"
                    disabled={!comment.trim()}
                    className="absolute right-2 bottom-2.5 p-1.5 btn-primary rounded-lg text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <RiAddLine />
                  </button>
                </div>
              </form>

              {/* Feed items */}
              <div className="space-y-4 overflow-y-auto max-h-[350px] column-scroll pr-1.5">
                {loadingComments ? (
                  <div className="flex justify-center py-6 text-olive text-xs gap-2"><RiLoader4Line className="animate-spin text-sm" /> Loading discussions...</div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-olive/50 font-medium">No activity yet. Start the conversation!</p>
                  </div>
                ) : (
                  comments.map(c => {
                    const author = c.author || { name: 'System', avatar: '' };
                    return (
                      <div key={c._id || c.id} className="flex gap-3 items-start border border-white/5 rounded-xl p-3.5" style={{ background: 'rgba(86,84,73,0.02)' }}>
                        <Avatar user={author} size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-semibold text-bone">{author.name}</span>
                            <span className="text-[10px] text-olive/50 flex items-center gap-1"><RiTimeLine className="text-3xs" /> {formatTime(c.createdAt)}</span>
                          </div>
                          <p className="text-xs text-olive-light leading-relaxed whitespace-pre-wrap">{c.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
