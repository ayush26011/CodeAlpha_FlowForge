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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.02 }}
          onClick={() => openTask(task)}
          className={`select-none cursor-pointer rounded-xl transition-all duration-150 group border ${
            snapshot.isDragging ? 'rotate-[1.5deg] scale-[1.02]' : ''
          }`}
          style={{
            ...provided.draggableProps.style,
            background: snapshot.isDragging ? '#1E2018' : 'rgba(22,23,16,0.85)',
            borderColor: snapshot.isDragging ? 'rgba(184,151,90,0.5)' : 'rgba(86,84,73,0.15)',
            boxShadow: snapshot.isDragging
              ? '0 20px 48px rgba(0,0,0,0.7), 0 0 1px 1px rgba(184,151,90,0.3)'
              : '0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)',
            padding: '14px 16px',
            backdropFilter: 'blur(8px)',
          }}
          whileHover={!snapshot.isDragging ? {
            y: -2,
            borderColor: 'rgba(184,151,90,0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)',
          } : {}}
        >
          {/* Labels Row */}
          {task.labels?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {task.labels.map(l => <LabelBadge key={l} label={l} />)}
            </div>
          )}

          {/* Task Title */}
          <p className="text-xs font-semibold text-bone leading-snug mb-3 group-hover:text-floral transition-colors duration-100">
            {task.title}
          </p>

          {/* Middle info/status row */}
          <div className="flex items-center gap-2 mb-3.5">
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Card Footer */}
          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: '1px solid rgba(86,84,73,0.1)' }}
          >
            {/* Due date indicator */}
            <div className={`flex items-center gap-1.5 text-3xs font-bold uppercase tracking-wider ${overdue ? 'text-red-400' : 'text-olive/80'}`}>
              {overdue
                ? <RiAlertFill className="text-xs flex-shrink-0" />
                : <RiCalendarLine className="text-xs flex-shrink-0" />
              }
              <span>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'No Date'}
              </span>
            </div>

            {/* Interaction details (comments / avatars) */}
            <div className="flex items-center gap-2.5">
              {task.comments > 0 && (
                <div className="flex items-center gap-1 text-3xs text-olive/60 font-semibold">
                  <RiChat1Line className="text-xs" />
                  <span>{task.comments}</span>
                </div>
              )}
              {assignee && <Avatar user={assignee} size="xs" />}
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}
