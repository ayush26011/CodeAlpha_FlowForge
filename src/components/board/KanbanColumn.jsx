import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { RiAddLine } from 'react-icons/ri';

const columnMeta = {
  backlog:    { label: 'Backlog',      dot: 'bg-olive' },
  todo:       { label: 'To Do',        dot: 'bg-bone' },
  inprogress: { label: 'In Progress',  dot: 'bg-bronze' },
  review:     { label: 'Review',       dot: 'bg-purple-400' },
  done:       { label: 'Done',         dot: 'bg-green-500' },
};

export default function KanbanColumn({ columnId, tasks }) {
  const meta = columnMeta[columnId];

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${meta.dot}`} />
          <span className="text-sm font-semibold text-bone">{meta.label}</span>
          <span className="text-xs text-olive bg-surface-2 px-1.5 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
        <button className="btn-ghost p-1.5 text-olive hover:text-bone">
          <RiAddLine className="text-base" />
        </button>
      </div>

      {/* Drop zone */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2.5 min-h-[120px] rounded-2xl p-2 transition-all duration-200
              ${snapshot.isDraggingOver ? 'bg-bronze/5 ring-1 ring-bronze/20' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task._id || task.id} task={task} index={index} />
            ))}
            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-border text-olive text-xs">
                Drop here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
