import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RiBellLine, RiSearchLine, RiMenuLine } from 'react-icons/ri';

const titles = {
  '/dashboard': 'Dashboard',
  '/workspace': 'Workspace',
  '/board': 'Project Board',
  '/calendar': 'Calendar',
  '/team': 'Team',
  '/notifications': 'Notifications',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export default function TopBar() {
  const { unreadCount, currentUser, setSidebarOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const title = titles[location.pathname] || 'FlowForge';

  return (
    <header className="h-14 bg-smoky/80 backdrop-blur-sm border-b border-border flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-30">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden btn-ghost p-2"
      >
        <RiMenuLine className="text-lg" />
      </button>

      <h1 className="text-base font-semibold text-bone flex-1">{title}</h1>

      {/* Search */}
      <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-2 border border-border text-olive text-sm hover:border-border-light transition-all duration-200 min-w-[200px]">
        <RiSearchLine className="text-base" />
        <span>Search...</span>
        <kbd className="ml-auto text-xs bg-surface-3 px-1.5 py-0.5 rounded-md">⌘K</kbd>
      </button>

      {/* Notifications */}
      <button
        onClick={() => navigate('/notifications')}
        className="relative btn-ghost p-2"
      >
        <RiBellLine className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-bronze rounded-full" />
        )}
      </button>

      {/* Avatar */}
      <button onClick={() => navigate('/profile')} className="flex-shrink-0">
        <img
          src={currentUser.avatar || currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name || 'User')}`}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full bg-surface-2 hover:ring-2 hover:ring-bronze/40 transition-all duration-200"
          onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name || 'User')}`; }}
        />
      </button>
    </header>
  );
}
