import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { RiAddLine } from 'react-icons/ri';

const columnMeta = {
  backlog:    { label: 'Backlog',      color: '#6B6659', dotColor: 'rgba(107,102,89,0.8)' },
  todo:       { label: 'To Do',        color: '#D8CFBC', dotColor: 'rgba(216,207,188,0.8)' },
  inprogress: { label: 'In Progress',  color: '#9B8260', dotColor: 'rgba(155,130,96,0.9)' },
  review:     { label: 'Review',       color: '#a78bfa', dotColor: 'rgba(167,139,250,0.8)' },
  done:       { label: 'Done',         color: '#4ade80', dotColor: 'rgba(74,222,128,0.8)' },
};

export default function KanbanColumn({ columnId, tasks }) {
  const meta = columnMeta[columnId];

  return (
    <div className="flex flex-col w-[272px] flex-shrink-0">
      {/* Column header */}
      <div
        className="flex items-center justify-between px-1 mb-3"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: meta.dotColor, boxShadow: `0 0 6px ${meta.dotColor}` }}
          />
          <span className="text-xs font-semibold tracking-tight" style={{ color: meta.color }}>
            {meta.label}
          </span>
          <span
            className="text-2xs font-semibold px-1.5 py-0.5 rounded-md"
            style={{
              background: 'rgba(30,32,24,0.8)',
              border: '1px solid rgba(42,44,34,0.7)',
              color: 'rgba(107,102,89,0.8)',
            }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          className="flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-150 text-olive/50 hover:text-bone hover:bg-surface-3"
          aria-label={`Add task to ${meta.label}`}
        >
          <RiAddLine className="text-sm" />
        </button>
      </div>

      {/* Drop zone */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 space-y-2 min-h-[120px] rounded-xl p-1.5 transition-all duration-200 column-scroll"
            style={{
              background: snapshot.isDraggingOver
                ? 'rgba(155,130,96,0.04)'
                : 'transparent',
              outline: snapshot.isDraggingOver
                ? '1px solid rgba(155,130,96,0.15)'
                : '1px solid transparent',
              minHeight: '120px',
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id || task.id} task={task} index={index} />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div
                className="flex items-center justify-center h-20 rounded-xl text-2xs text-olive/30"
                style={{ border: '1px dashed rgba(42,44,34,0.6)' }}
              >
                Drop cards here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
