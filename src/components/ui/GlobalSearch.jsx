import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  RiSearchLine, RiCloseLine, RiLoader4Line,
  RiKanbanView2, RiFolderLine, RiLayoutGridLine,
  RiTeamLine
} from 'react-icons/ri';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function ResultRow({ item, onSelect, isActive }) {
  const iconMap = {
    workspace: <RiFolderLine className="text-bronze-light flex-shrink-0" />,
    project:   <RiLayoutGridLine className="text-bronze flex-shrink-0" />,
    task:      <RiKanbanView2 className="text-bone/70 flex-shrink-0" />,
    member:    <RiTeamLine className="text-olive-light flex-shrink-0" />,
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
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left transition-all duration-100 rounded-xl mx-1 border
        ${isActive
          ? 'bg-white/5 border-white/5 text-floral'
          : 'text-olive hover:bg-white/2 hover:text-bone border-transparent'
        }`}
      style={{ width: 'calc(100% - 8px)' }}
    >
      <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
        {iconMap[item.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-bone truncate">{item.title}</p>
        {item.subtitle && (
          <p className="text-3xs text-olive/80 truncate mt-0.5">{item.subtitle}</p>
        )}
      </div>
      <span className="text-[10px] text-olive/60 bg-white/5 px-2 py-0.5 rounded border border-white/5 flex-shrink-0 font-bold uppercase tracking-wider">
        {typeLabel[item.type]}
      </span>
    </button>
  );
}

export default function GlobalSearch({ isOpen, onClose }) {
  const { workspaces, projects, allTasks, activeWorkspace, openTask, setActiveWorkspace } = useApp();
  const navigate = useNavigate();

  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) { setResults([]); setLoading(false); return; }

    setLoading(true);
    const found = [];

    (workspaces || []).forEach(ws => {
      if (ws.name?.toLowerCase().includes(q) || ws.description?.toLowerCase().includes(q)) {
        found.push({ type: 'workspace', id: ws._id, title: ws.name, subtitle: ws.description || 'Workspace', _raw: ws });
      }
    });

    (projects || []).forEach(p => {
      if (p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)) {
        found.push({ type: 'project', id: p._id, title: p.name, subtitle: p.description || 'Project', _raw: p });
      }
    });

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

    ((activeWorkspace?.members) || []).forEach(m => {
      const user = m.user || m;
      const name = user.name || '';
      const email = user.email || '';
      if (name.toLowerCase().includes(q) || email.toLowerCase().includes(q)) {
        found.push({ type: 'member', id: user._id, title: name, subtitle: email, _raw: user });
      }
    });

    setResults(found.slice(0, 12));
    setLoading(false);
    setActiveIdx(0);
  }, [debouncedQuery, workspaces, projects, allTasks, activeWorkspace]);

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
            className="w-full max-w-xl border rounded-2xl overflow-hidden shadow-2xl"
            style={{
              maxHeight: '70vh',
              background: 'rgba(22,23,16,0.95)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(86,84,73,0.18)',
            }}
          >
            {/* Input wrap */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
              <RiSearchLine className="text-olive text-lg flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search workspaces, projects, tasks, members…"
                className="flex-1 bg-transparent text-xs text-bone placeholder-olive/60 outline-none"
                aria-label="Global search"
                autoComplete="off"
              />
              {loading && <RiLoader4Line className="animate-spin text-olive flex-shrink-0" />}
              {query && !loading && (
                <button onClick={() => setQuery('')} className="text-olive hover:text-bone p-1">
                  <RiCloseLine className="text-base" />
                </button>
              )}
              <kbd className="hidden sm:block text-[10px] bg-white/5 text-olive px-2 py-0.5 rounded border border-white/5 font-semibold">ESC</kbd>
            </div>

            {/* Results body */}
            <div className="overflow-y-auto column-scroll" style={{ maxHeight: 'calc(70vh - 56px)' }}>
              {!query && (
                <div className="px-5 py-10 text-center">
                  <RiSearchLine className="text-4xl text-olive/20 mx-auto mb-3" />
                  <p className="text-xs text-olive font-medium">Search across your workspaces</p>
                  <p className="text-3xs text-olive/40 mt-1 uppercase tracking-wider font-semibold">Tasks, projects, members and more</p>
                </div>
              )}

              {loading && (
                <div className="px-5 py-8 flex items-center justify-center gap-2 text-olive text-xs font-medium">
                  <RiLoader4Line className="animate-spin" /> Searching…
                </div>
              )}

              {showEmpty && (
                <div className="px-5 py-8 text-center">
                  <p className="text-xs text-olive">No results for <span className="text-bone font-bold">"{query}"</span></p>
                  <p className="text-3xs text-olive/40 mt-1 uppercase tracking-wider font-semibold">Try different terms</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="p-2 space-y-1">
                  {typeOrder.filter(t => grouped[t]).map(type => {
                    let groupStart = 0;
                    typeOrder.slice(0, typeOrder.indexOf(type)).forEach(t => {
                      groupStart += (grouped[t]?.length || 0);
                    });
                    return (
                      <div key={type}>
                        <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-olive/50 uppercase tracking-widest">
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

              {/* Navigation help bar */}
              <div className="px-5 py-3 border-t border-white/5 flex items-center gap-3 text-3xs text-olive/40 uppercase tracking-wider font-bold">
                <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/5 px-1.5 py-0.5 rounded border border-white/5">ESC</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
