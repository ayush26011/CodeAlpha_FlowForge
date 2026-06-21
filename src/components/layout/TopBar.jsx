import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import GlobalSearch from '../ui/GlobalSearch';
import { RiBellLine, RiSearchLine, RiMenuLine } from 'react-icons/ri';

const titles = {
  '/dashboard':     'Dashboard',
  '/workspace':     'Workspace',
  '/board':         'Project Board',
  '/calendar':      'Calendar',
  '/team':          'Team',
  '/notifications': 'Notifications',
  '/profile':       'Profile',
  '/settings':      'Settings',
};

export default function TopBar() {
  const { unreadCount, currentUser, setSidebarOpen } = useApp();
  const navigate  = useNavigate();
  const location  = useLocation();
  const title     = titles[location.pathname] || 'FlowForge';

  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const avatarSrc = currentUser?.avatar || currentUser?.avatarUrl
    || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`;

  return (
    <>
      <header
        className="h-14 flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-30"
        style={{
          background: 'rgba(22,23,16,0.85)',
          backdropFilter: 'blur(12px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
          borderBottom: '1px solid rgba(42,44,34,0.9)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.03), 0 4px 16px rgba(0,0,0,0.25)',
        }}
      >
        {/* Mobile hamburger */}
        <button
          id="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden btn-ghost p-2 -ml-1"
          aria-label="Open menu"
        >
          <RiMenuLine className="text-lg" />
        </button>

        {/* Page title */}
        <h1 className="text-sm font-semibold text-bone flex-1 tracking-tight">{title}</h1>

        {/* Search trigger */}
        <button
          id="global-search-btn"
          onClick={() => setSearchOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-all duration-200"
          style={{
            background: 'rgba(30,32,24,0.8)',
            border: '1px solid rgba(42,44,34,0.9)',
            color: 'rgba(107,102,89,0.8)',
            minWidth: '200px',
          }}
          aria-label="Search (⌘K)"
        >
          <RiSearchLine className="text-base flex-shrink-0" />
          <span className="flex-1 text-left">Search…</span>
          <kbd
            className="text-2xs px-1.5 py-0.5 rounded-md flex-shrink-0"
            style={{ background: 'rgba(46,48,40,0.8)', border: '1px solid rgba(58,59,51,0.8)', color: 'rgba(107,102,89,0.7)' }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Mobile search icon */}
        <button
          onClick={() => setSearchOpen(true)}
          className="sm:hidden btn-ghost p-2"
          aria-label="Search"
        >
          <RiSearchLine className="text-lg" />
        </button>

        {/* Notifications */}
        <button
          id="notifications-btn"
          onClick={() => navigate('/notifications')}
          className="relative btn-ghost p-2 flex-shrink-0"
          aria-label="Notifications"
        >
          <RiBellLine className="text-lg" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #B8975A, #9B8260)' }}
            />
          )}
        </button>

        {/* Avatar */}
        <button
          id="profile-btn"
          onClick={() => navigate('/profile')}
          className="flex-shrink-0 rounded-full transition-all duration-200 hover:ring-2 hover:ring-bronze/40 hover:ring-offset-1 hover:ring-offset-transparent"
          aria-label="Profile"
        >
          <img
            src={avatarSrc}
            alt={currentUser?.name}
            className="w-8 h-8 rounded-full bg-surface-2 object-cover"
            onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`; }}
          />
        </button>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
