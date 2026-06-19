import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

import { RiCalendarEventLine, RiArrowLeftSLine, RiArrowRightSLine, RiAddLine } from 'react-icons/ri';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar() {
  const { allTasks, openTask } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to current month
  const [viewMode, setViewMode] = useState('month'); // month | week

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Find tasks belonging to a specific date (YYYY-MM-DD)
  const getTasksForDate = (dateStr) => {
    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}` === dateStr;
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

  // Render Month View Grid
  const renderMonthGrid = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const totalSlots = Math.ceil((daysInMonth + firstDay) / 7) * 7;
    const gridCells = [];

    // Prev Month Overlapping Days
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      gridCells.push({ day: dayNum, isCurrentMonth: false, dateStr: `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}` });
    }

    // Current Month Days
    for (let i = 1; i <= daysInMonth; i++) {
      gridCells.push({
        day: i,
        isCurrentMonth: true,
        dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    // Next Month Overlapping Days
    const remaining = totalSlots - gridCells.length;
    for (let i = 1; i <= remaining; i++) {
      gridCells.push({ day: i, isCurrentMonth: false, dateStr: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}` });
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
          <button className="btn-primary text-xs">
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
    </motion.div>
  );
}
