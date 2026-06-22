import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import Logo from '../ui/Logo';
import { getAvatarUrl } from '../../services/avatarHelper';
import {
  RiDashboardLine, RiKanbanView2, RiCalendarLine, RiTeamLine,
  RiBellLine, RiSettings3Line, RiUserLine, RiAddLine,
  RiArrowDownSLine, RiLogoutBoxLine, RiHexagonLine
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

export default function Sidebar({ className = "hidden lg:flex w-64 fixed left-0 top-0 z-40" }) {
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
      className={`flex flex-col h-screen ${className}`}
      style={{
        background: '#11120D',
        borderRight: '1px solid rgba(86,84,73,0.15)',
        boxShadow: '4px 0 32px rgba(0,0,0,0.5)',
      }}
    >
      {/* Brand logo container */}
      <div className="flex items-center px-6 py-5 border-b border-olive/10">
        <Logo size="md" />
      </div>

      {/* Workspace Switcher Section */}
      <div className="px-4 py-4 border-b border-olive/10">
        {activeWorkspace ? (
          <div className="relative">
            <button
              onClick={() => setWsOpen(o => !o)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 border border-white/5 shadow-inner"
              style={{ background: 'rgba(86,84,73,0.06)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 font-bold"
                style={{ background: 'linear-gradient(135deg, #B8975A 0%, #9B8260 100%)', color: '#FFFBF4' }}
              >
                {activeWorkspace.icon || activeWorkspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-bone truncate">{activeWorkspace.name}</p>
                <p className="text-2xs text-olive/60 uppercase tracking-widest font-semibold mt-0.5">Active Workspace</p>
              </div>
              <RiArrowDownSLine className={`text-olive/80 transition-transform duration-200 flex-shrink-0 text-base ${wsOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {wsOpen && (
                <>
                  {/* Global overlay backing to dismiss panel */}
                  <div className="fixed inset-0 z-10" onClick={() => setWsOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="absolute left-0 right-0 mt-2 p-2 rounded-xl z-20 overflow-hidden shadow-2xl border border-white/10"
                    style={{ background: '#161710', backdropFilter: 'blur(16px)' }}
                  >
                    <p className="px-3 py-1.5 text-2xs font-semibold text-olive/50 uppercase tracking-widest border-b border-white/5 mb-1">Select Workspace</p>
                    <div className="space-y-0.5 max-h-48 overflow-y-auto column-scroll">
                      {workspaces.map(ws => (
                        <button
                          key={ws._id}
                          onClick={() => { setActiveWorkspace(ws); setWsOpen(false); navigate('/dashboard'); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left
                            ${activeWorkspace._id === ws._id ? 'bg-bronze/10 text-floral font-medium border border-bronze/20' : 'text-olive hover:text-bone hover:bg-white/5 border border-transparent'}`}
                        >
                          <span className="text-base flex-shrink-0">{ws.icon || '📁'}</span>
                          <span className="truncate flex-1">{ws.name}</span>
                          {activeWorkspace._id === ws._id && <div className="w-1.5 h-1.5 rounded-full bg-bronze glow-bronze" />}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => { setWsOpen(false); navigate('/workspace'); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 mt-1.5 border border-dashed border-olive/30 rounded-lg text-sm text-olive hover:text-bone hover:bg-bronze/5 transition-all duration-150"
                    >
                      <RiAddLine className="text-base" />
                      <span>New Workspace</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={() => navigate('/workspace')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed border-olive/30 hover:border-bronze/50 hover:bg-bronze/5 transition-all duration-200 text-olive hover:text-bone text-sm"
          >
            <RiAddLine className="text-base" />
            <span>Create Workspace</span>
          </button>
        )}
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        <p className="px-3 text-2xs font-semibold text-olive/40 uppercase tracking-widest mb-2">Navigation</p>
        
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
              ${isActive ? 'text-floral bg-white/5 border border-white/5 shadow-xs font-semibold' : 'text-olive hover:text-bone hover:bg-white/5 border border-transparent'}`}
          >
            {({ isActive }) => (
              <>
                <Icon className={`text-lg flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-bronze-light' : 'text-olive group-hover:text-bone'}`} />
                <span className="tracking-tight">{label}</span>
                {label === 'Notifications' && unreadCount > 0 && (
                  <span
                    className="ml-auto text-2xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center text-floral"
                    style={{ background: 'linear-gradient(135deg, #B8975A, #9B8260)', boxShadow: '0 2px 6px rgba(184,151,90,0.3)' }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-bronze rounded-r-md"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-olive/10">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-2xs font-semibold text-olive/40 uppercase tracking-widest">Active Workspace</p>
            <RiHexagonLine className="text-xs text-olive/30" />
          </div>
          
          <NavLink
            to="/workspace"
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive ? 'text-floral bg-white/5 border border-white/5 font-semibold' : 'text-olive hover:text-bone hover:bg-white/5'}`}
          >
            <span className="text-base flex-shrink-0">{activeWorkspace?.icon || '📁'}</span>
            <span className="truncate flex-1 tracking-tight">{activeWorkspace?.name || 'My Workspace'}</span>
          </NavLink>
        </div>
      </nav>

      {/* Bottom Profile and Settings Card */}
      <div className="p-3 space-y-1 border-t border-olive/10" style={{ background: 'rgba(86,84,73,0.02)' }}>
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive ? 'text-floral bg-white/5 border border-white/5' : 'text-olive hover:text-bone hover:bg-white/5'}`}
          >
            <Icon className="text-lg flex-shrink-0" />
            <span className="tracking-tight">{label}</span>
          </NavLink>
        ))}

        <div
          className="mt-3 px-3 py-3 rounded-xl flex items-center gap-3 border border-white/5"
          style={{ background: 'rgba(22,23,16,0.5)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }}
        >
          <img
            src={getAvatarUrl(currentUser)}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full bg-surface-3 flex-shrink-0 ring-1 ring-white/10 object-cover"
            onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(currentUser.name)}`; }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-bone truncate">{currentUser.name}</p>
            <p className="text-2xs text-olive/60 truncate mt-0.5">{currentUser.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-olive hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
            title="Logout"
          >
            <RiLogoutBoxLine className="text-base" />
          </button>
        </div>
      </div>
    </aside>
  );
}
