const priorityMap = {
  urgent: { label: 'Urgent', className: 'priority-urgent' },
  high:   { label: 'High',   className: 'priority-high' },
  medium: { label: 'Medium', className: 'priority-medium' },
  low:    { label: 'Low',    className: 'priority-low' },
};

const statusMap = {
  backlog:    { label: 'Backlog',    className: 'bg-olive/20 text-olive border border-olive/30' },
  todo:       { label: 'To Do',      className: 'bg-bone/10 text-bone border border-bone/20' },
  inprogress: { label: 'In Progress',className: 'bg-bronze/20 text-bronze-light border border-bronze/30' },
  review:     { label: 'Review',     className: 'bg-purple-900/30 text-purple-400 border border-purple-800/40' },
  done:       { label: 'Done',       className: 'bg-green-900/30 text-green-400 border border-green-800/40' },
};

export function PriorityBadge({ priority }) {
  const p = priorityMap[priority] || priorityMap.medium;
  return <span className={`badge ${p.className}`}>{p.label}</span>;
}

export function StatusBadge({ status }) {
  const s = statusMap[status] || statusMap.todo;
  return <span className={`badge ${s.className}`}>{s.label}</span>;
}

export function LabelBadge({ label }) {
  return (
    <span className="badge bg-surface-3 text-olive border border-border-light">
      {label}
    </span>
  );
}
