import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Avatar } from '../ui/Avatar';
import { PriorityBadge, LabelBadge } from '../ui/Badge';
import { Draggable } from '@hello-pangea/dnd';
import { RiChat1Line, RiCalendarLine, RiAlertLine } from 'react-icons/ri';

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export default function TaskCard({ task, index }) {
  const { openTask } = useApp();
  const assignee = task.assignee;

  return (
    <Draggable draggableId={task._id || task.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.04 }}
          onClick={() => openTask(task)}
          className={`card p-3.5 cursor-pointer select-none group
            ${snapshot.isDragging
              ? 'shadow-modal rotate-1 scale-105 border-bronze/40'
              : 'hover:shadow-card-hover hover:-translate-y-0.5 hover:border-border-light'
            } transition-all duration-200`}
        >
          {/* Labels */}
          {task.labels?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {task.labels.map(l => <LabelBadge key={l} label={l} />)}
            </div>
          )}

          {/* Title */}
          <p className="text-sm font-medium text-bone leading-snug mb-3 group-hover:text-floral transition-colors">
            {task.title}
          </p>

          {/* Priority */}
          <div className="flex items-center gap-2 mb-3">
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {/* Due date */}
            <div className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate) ? 'text-red-400' : 'text-olive'}`}>
              {isOverdue(task.dueDate) && <RiAlertLine className="text-xs" />}
              <RiCalendarLine className="text-xs" />
              <span>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'No date'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Comments */}
              {task.comments > 0 && (
                <div className="flex items-center gap-1 text-xs text-olive">
                  <RiChat1Line className="text-xs" />
                  <span>{task.comments}</span>
                </div>
              )}
              {/* Assignee */}
              {assignee && <Avatar user={assignee} size="xs" />}
            </div>
          </div>
        </motion.div>
      )}
    </Draggable>
  );
}
