import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import Logo from '../ui/Logo';
import {
  RiDashboardLine, RiKanbanView2, RiCalendarLine, RiTeamLine,
  RiBellLine, RiSettings3Line, RiUserLine, RiAddLine,
  RiArrowDownSLine, RiLogoutBoxLine,
} from 'react-icons/ri';

const navItems = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/board', icon: RiKanbanView2, label: 'Project Board' },
  { to: '/calendar', icon: RiCalendarLine, label: 'Calendar' },
  { to: '/team', icon: RiTeamLine, label: 'Team' },
  { to: '/notifications', icon: RiBellLine, label: 'Notifications' },
];

const bottomItems = [
  { to: '/profile', icon: RiUserLine, label: 'Profile' },
  { to: '/settings', icon: RiSettings3Line, label: 'Settings' },
];

function getAvatarUrl(user) {
  if (!user) return '';
  return user.avatar || user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`;
}

export default function Sidebar() {
  const { workspaces, activeWorkspace, setActiveWorkspace, currentUser, unreadCount, logout } = useApp();
  const [wsOpen, setWsOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="hidden lg:flex flex-col w-60 h-screen fixed left-0 top-0 z-40"
      style={{
        background: '#161710',
        borderRight: '1px solid rgba(42,44,34,0.9)',
        boxShadow: '1px 0 0 rgba(255,255,255,0.03), 4px 0 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center px-5 py-4" style={{ borderBottom: '1px solid rgba(42,44,34,0.8)' }}>
        <Logo size="md" />
      </div>

      {/* Workspace Switcher */}
      <div className="px-2.5 py-2.5" style={{ borderBottom: '1px solid rgba(42,44,34,0.7)' }}>
        {activeWorkspace ? (
          <button
            onClick={() => setWsOpen(o => !o)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150 group hover:bg-surface-3"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: 'rgba(46,48,40,0.8)', border: '1px solid rgba(58,59,51,0.6)' }}
            >
              {activeWorkspace.icon || '📁'}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold text-bone truncate">{activeWorkspace.name}</p>
              <p className="text-2xs text-olive/60 uppercase tracking-widest">Workspace</p>
            </div>
            <RiArrowDownSLine className={`text-olive/60 transition-transform duration-200 flex-shrink-0 text-sm ${wsOpen ? 'rotate-180' : ''}`} />
          </button>
        ) : (
          <button
            onClick={() => navigate('/workspace')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-2 transition-all duration-200 text-olive hover:text-bone text-sm"
          >
            <RiAddLine className="text-base" />
            <span>Create Workspace</span>
          </button>
        )}

        <AnimatePresence>
          {wsOpen && activeWorkspace && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-0.5">
                {workspaces.map(ws => (
                  <button
                    key={ws._id}
                    onClick={() => { setActiveWorkspace(ws); setWsOpen(false); navigate('/dashboard'); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150
                      ${activeWorkspace._id === ws._id ? 'bg-bronze/10 text-bone' : 'text-olive hover:text-bone hover:bg-surface-2'}`}
                  >
                    <span className="text-base">{ws.icon || '📁'}</span>
                    <span className="font-medium truncate">{ws.name}</span>
                    {activeWorkspace._id === ws._id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-bronze" />}
                  </button>
                ))}
                <button
                  onClick={() => { setWsOpen(false); navigate('/workspace'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-olive hover:text-bone hover:bg-surface-2 transition-all duration-150"
                >
                  <RiAddLine className="text-base" />
                  <span>New Workspace</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto no-scrollbar">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon className="text-base flex-shrink-0" />
            <span className="tracking-tight">{label}</span>
            {label === 'Notifications' && unreadCount > 0 && (
              <span
                className="ml-auto text-2xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center text-floral"
                style={{ background: 'linear-gradient(135deg, #B8975A, #9B8260)', fontSize: '10px' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}

        <div className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(42,44,34,0.7)' }}>
          <p className="px-3 text-2xs font-semibold text-olive/40 uppercase tracking-widest mb-1.5">Workspace</p>
          <NavLink to="/workspace" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="text-sm">{activeWorkspace?.icon || '📁'}</span>
            <span className="truncate text-sm">{activeWorkspace?.name || 'My Workspace'}</span>
          </NavLink>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2.5 py-2.5 space-y-0.5" style={{ borderTop: '1px solid rgba(42,44,34,0.7)' }}>
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Icon className="text-base flex-shrink-0" />
            <span className="tracking-tight">{label}</span>
          </NavLink>
        ))}
        <div
          className="mt-2 px-2.5 py-2 rounded-xl flex items-center gap-2.5"
          style={{ background: 'rgba(30,32,24,0.5)', border: '1px solid rgba(42,44,34,0.5)' }}
        >
          <img
            src={getAvatarUrl(currentUser)}
            alt={currentUser.name}
            className="w-7 h-7 rounded-full bg-surface-3 flex-shrink-0 ring-1 ring-border object-cover"
            onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`; }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-bone truncate">{currentUser.name}</p>
            <p className="text-2xs text-olive/60 truncate">{currentUser.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-olive/60 hover:text-red-400 transition-colors p-0.5"
            title="Logout"
          >
            <RiLogoutBoxLine className="text-sm" />
          </button>
        </div>
      </div>
    </aside>
  );
}
