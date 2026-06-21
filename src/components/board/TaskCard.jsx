import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge, LabelBadge } from '../ui/Badge';
import { Draggable } from '@hello-pangea/dnd';
import { RiChat1Line, RiCalendarLine, RiAlertFill } from 'react-icons/ri';

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function TaskCard({ task, index }) {
  const { openTask } = useApp();
  const assignee = task.assignee;
  const overdue   = isOverdue(task.dueDate);

  return (
    <Draggable draggableId={task._id || task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, delay: index * 0.03 }}
          onClick={() => openTask(task)}
          className={`select-none cursor-pointer rounded-xl transition-all duration-150 group
            ${snapshot.isDragging
              ? 'rotate-[1.5deg] scale-[1.03]'
              : ''
            }`}
          style={{
            background: snapshot.isDragging
              ? 'rgba(30,32,24,0.98)'
              : 'rgba(22,23,16,0.9)',
            border: snapshot.isDragging
              ? '1px solid rgba(155,130,96,0.4)'
              : '1px solid rgba(42,44,34,0.9)',
            boxShadow: snapshot.isDragging
              ? '0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(155,130,96,0.15)'
              : '0 1px 3px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)',
            padding: '12px 14px',
            backgroundImage: !snapshot.isDragging
              ? 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 100%)'
              : 'none',
          }}
          whileHover={!snapshot.isDragging ? {
            borderColor: 'rgba(58,59,51,0.95)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
            y: -1,
          } : {}}
        >
          {/* Labels */}
          {task.labels?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {task.labels.map(l => <LabelBadge key={l} label={l} />)}
            </div>
          )}

          {/* Title */}
          <p className="text-sm font-medium text-bone leading-snug mb-3 group-hover:text-floral transition-colors duration-100">
            {task.title}
          </p>

          {/* Priority row */}
          <div className="flex items-center gap-2 mb-3">
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between pt-2.5"
            style={{ borderTop: '1px solid rgba(42,44,34,0.7)' }}
          >
            {/* Due date */}
            <div className={`flex items-center gap-1 text-2xs font-medium ${overdue ? 'text-red-400' : 'text-olive/70'}`}>
              {overdue
                ? <RiAlertFill className="text-xs flex-shrink-0" />
                : <RiCalendarLine className="text-xs flex-shrink-0" />
              }
              <span>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'No date'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Comments count */}
              {task.comments > 0 && (
                <div className="flex items-center gap-1 text-2xs text-olive/60">
                  <RiChat1Line className="text-xs" />
                  <span>{task.comments}</span>
                </div>
              )}
              {/* Assignee avatar */}
              {assignee && <Avatar user={assignee} size="xs" />}
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}
