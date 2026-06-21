import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  RiSearchLine, RiCloseLine, RiLoader4Line,
  RiKanbanView2, RiFolderLine, RiLayoutGridLine,
  RiTeamLine, RiArrowRightUpLine, RiHistoryLine,
} from 'react-icons/ri';

// ── Debounce hook ─────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Result row ────────────────────────────────────────────────────────────────
function ResultRow({ item, onSelect, isActive }) {
  const iconMap = {
    workspace: <RiFolderLine className="text-bronze flex-shrink-0" />,
    project:   <RiLayoutGridLine className="text-blue-400/80 flex-shrink-0" />,
    task:      <RiKanbanView2 className="text-emerald-400/80 flex-shrink-0" />,
    member:    <RiTeamLine className="text-purple-400/80 flex-shrink-0" />,
  };

  const typeLabel = {
    workspace: 'Workspace',
    project:   'Project',
    task:      'Task',
    member:    'Member',
  };

  return (
    <button
      onClick={() => onSelect(item)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-100 rounded-xl mx-1
        ${isActive
          ? 'bg-surface-3 text-bone'
          : 'text-olive hover:bg-surface-2 hover:text-bone'
        }`}
      style={{ width: 'calc(100% - 8px)' }}
    >
      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {iconMap[item.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-bone truncate">{item.title}</p>
        {item.subtitle && (
          <p className="text-xs text-olive truncate">{item.subtitle}</p>
        )}
      </div>
      <span className="text-2xs text-olive/50 bg-surface-3 px-2 py-0.5 rounded-md flex-shrink-0">
        {typeLabel[item.type]}
      </span>
    </button>
  );
}

// ── Main Search Modal ─────────────────────────────────────────────────────────
export default function GlobalSearch({ isOpen, onClose }) {
  const { workspaces, projects, allTasks, activeWorkspace, openTask, setActiveWorkspace } = useApp();
  const navigate = useNavigate();

  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 200);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        // trigger open via parent
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Run search
  useEffect(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) { setResults([]); setLoading(false); return; }

    setLoading(true);
    const found = [];

    // Search workspaces
    (workspaces || []).forEach(ws => {
      if (ws.name?.toLowerCase().includes(q) || ws.description?.toLowerCase().includes(q)) {
        found.push({ type: 'workspace', id: ws._id, title: ws.name, subtitle: ws.description || 'Workspace', _raw: ws });
      }
    });

    // Search projects
    (projects || []).forEach(p => {
      if (p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)) {
        found.push({ type: 'project', id: p._id, title: p.name, subtitle: p.description || 'Project', _raw: p });
      }
    });

    // Search tasks
    (allTasks || []).forEach(t => {
      if (t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)) {
        found.push({
          type: 'task',
          id: t._id,
          title: t.title,
          subtitle: t.status ? `${t.status} · ${t.priority || ''}` : '',
          _raw: t,
        });
      }
    });

    // Search members (from active workspace)
    ((activeWorkspace?.members) || []).forEach(m => {
      const user = m.user || m;
      const name = user.name || '';
      const email = user.email || '';
      if (name.toLowerCase().includes(q) || email.toLowerCase().includes(q)) {
        found.push({ type: 'member', id: user._id, title: name, subtitle: email, _raw: user });
      }
    });

    setResults(found.slice(0, 12)); // cap at 12
    setLoading(false);
    setActiveIdx(0);
  }, [debouncedQuery, workspaces, projects, allTasks, activeWorkspace]);

  // Handle selection
  const handleSelect = useCallback((item) => {
    onClose();
    switch (item.type) {
      case 'workspace':
        setActiveWorkspace(item._raw);
        navigate('/dashboard');
        break;
      case 'project':
        navigate('/board');
        break;
      case 'task':
        openTask(item._raw);
        break;
      case 'member':
        navigate('/team');
        break;
    }
  }, [onClose, navigate, setActiveWorkspace, openTask]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); handleSelect(results[activeIdx]); }
    if (e.key === 'Escape')    { onClose(); }
  };

  const showEmpty = debouncedQuery && !loading && results.length === 0;
  const grouped = results.reduce((acc, r) => {
    (acc[r.type] = acc[r.type] || []).push(r);
    return acc;
  }, {});
  const typeOrder = ['workspace', 'project', 'task', 'member'];
  const typeLabel = { workspace: 'Workspaces', project: 'Projects', task: 'Tasks', member: 'Members' };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          style={{ background: 'rgba(17,18,13,0.7)', backdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-xl card-elevated overflow-hidden"
            style={{ maxHeight: '70vh' }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <RiSearchLine className="text-olive text-lg flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search workspaces, projects, tasks, members…"
                className="flex-1 bg-transparent text-sm text-bone placeholder-olive/50 outline-none"
                aria-label="Global search"
                autoComplete="off"
              />
              {loading && <RiLoader4Line className="animate-spin text-olive flex-shrink-0" />}
              {query && !loading && (
                <button onClick={() => setQuery('')} className="btn-ghost p-1">
                  <RiCloseLine className="text-base" />
                </button>
              )}
              <kbd className="hidden sm:block text-2xs bg-surface-3 text-olive px-2 py-1 rounded-md border border-border">ESC</kbd>
            </div>

            {/* Results */}
            <div className="overflow-y-auto column-scroll" style={{ maxHeight: 'calc(70vh - 56px)' }}>
              {/* No query — show hint */}
              {!query && (
                <div className="px-5 py-8 text-center">
                  <RiSearchLine className="text-3xl text-olive/30 mx-auto mb-3" />
                  <p className="text-sm text-olive">Search across your workspace</p>
                  <p className="text-2xs text-olive/50 mt-1">Tasks, projects, members and more</p>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="px-5 py-8 flex items-center justify-center gap-2 text-olive text-sm">
                  <RiLoader4Line className="animate-spin" /> Searching…
                </div>
              )}

              {/* Empty */}
              {showEmpty && (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-olive">No results for <span className="text-bone font-medium">"{query}"</span></p>
                  <p className="text-2xs text-olive/50 mt-1">Try a different keyword</p>
                </div>
              )}

              {/* Grouped results */}
              {!loading && results.length > 0 && (
                <div className="p-2 space-y-1">
                  {typeOrder.filter(t => grouped[t]).map(type => {
                    let groupStart = 0;
                    typeOrder.slice(0, typeOrder.indexOf(type)).forEach(t => {
                      groupStart += (grouped[t]?.length || 0);
                    });
                    return (
                      <div key={type}>
                        <p className="px-4 pt-3 pb-1 text-2xs font-semibold text-olive/50 uppercase tracking-widest">
                          {typeLabel[type]}
                        </p>
                        {grouped[type].map((r, i) => (
                          <ResultRow
                            key={r.id}
                            item={r}
                            onSelect={handleSelect}
                            isActive={activeIdx === groupStart + i}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer tip */}
              <div className="px-5 py-3 border-t border-border flex items-center gap-3 text-2xs text-olive/40">
                <span className="flex items-center gap-1"><kbd className="bg-surface-3 px-1.5 py-0.5 rounded border border-border">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-surface-3 px-1.5 py-0.5 rounded border border-border">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="bg-surface-3 px-1.5 py-0.5 rounded border border-border">ESC</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
