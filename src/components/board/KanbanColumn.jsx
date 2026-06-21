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
    <div className="flex flex-col w-[280px] flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-2 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: meta.dotColor,
              boxShadow: `0 0 8px ${meta.dotColor}`,
            }}
          />
          <span className="text-xs font-bold tracking-tight uppercase" style={{ color: meta.color, letterSpacing: '0.05em' }}>
            {meta.label}
          </span>
          <span
            className="text-3xs font-extrabold px-1.5 py-0.5 rounded-lg border"
            style={{
              background: 'rgba(22,23,16,0.8)',
              borderColor: 'rgba(86,84,73,0.15)',
              color: 'rgba(216,207,188,0.8)',
            }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          className="flex items-center justify-center w-6.5 h-6.5 rounded-lg transition-all duration-150 text-olive hover:text-bone hover:bg-white/5 border border-transparent hover:border-white/5"
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
            className="flex-1 space-y-2.5 min-h-[150px] rounded-2xl p-2 transition-all duration-200 column-scroll"
            style={{
              background: snapshot.isDraggingOver
                ? 'rgba(86,84,73,0.03)'
                : 'transparent',
              outline: snapshot.isDraggingOver
                ? '1px dashed rgba(184,151,90,0.2)'
                : '1px solid transparent',
              minHeight: '150px',
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id || task.id} task={task} index={index} />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div
                className="flex items-center justify-center h-24 rounded-2xl text-3xs text-olive/40 font-medium uppercase tracking-wider"
                style={{ border: '1px dashed rgba(86,84,73,0.15)' }}
              >
                Drop tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
