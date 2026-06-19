import { NavLink } from 'react-router-dom';
import {
  RiDashboardLine, RiKanbanView2, RiCalendarLine,
  RiTeamLine, RiUserLine,
} from 'react-icons/ri';

const mobileNav = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Home' },
  { to: '/board', icon: RiKanbanView2, label: 'Board' },
  { to: '/calendar', icon: RiCalendarLine, label: 'Calendar' },
  { to: '/team', icon: RiTeamLine, label: 'Team' },
  { to: '/profile', icon: RiUserLine, label: 'Profile' },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {mobileNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[52px]
               ${isActive ? 'text-bone' : 'text-olive'}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-bronze/20' : ''}`}>
                  <Icon className="text-xl" />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
