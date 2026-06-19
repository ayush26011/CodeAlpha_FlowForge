import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import {
  RiUserAddLine, RiChat3Line, RiAlertLine, RiRefreshLine,
  RiCheckDoubleLine, RiInboxLine
} from 'react-icons/ri';

const iconMap = {
  assigned: { icon: RiUserAddLine, class: 'bg-bronze/20 text-bronze-light border border-bronze/35' },
  comment:  { icon: RiChat3Line, class: 'bg-blue-900/20 text-blue-400 border border-blue-800/40' },
  deadline: { icon: RiAlertLine, class: 'bg-red-900/20 text-red-400 border border-red-800/40' },
  update:   { icon: RiRefreshLine, class: 'bg-purple-900/20 text-purple-400 border border-purple-800/40' },
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function Notifications() {
  const { notifications, markAllNotificationsRead } = useApp();

  const handleMarkAll = () => {
    markAllNotificationsRead();
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="text-sm text-olive mt-0.5">Stay updated on assignments, comments, and project statuses.</p>
        </div>
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAll}
            className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5"
          >
            <RiCheckDoubleLine className="text-sm" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card p-12 text-center text-olive flex flex-col items-center justify-center border border-border rounded-2xl">
          <RiInboxLine className="text-5xl opacity-20 mb-3" />
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs text-olive/60 mt-1">No notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unread Section */}
          {unreadNotifications.length > 0 && (
            <div className="space-y-2">
              <h2 className="section-title text-xs uppercase tracking-wider text-olive pl-1">New</h2>
              <div className="card divide-y divide-border overflow-hidden">
                {unreadNotifications.map(item => {
                  const iconStyle = iconMap[item.type] || iconMap.update;
                  const Icon = iconStyle.icon;

                  return (
                    <div key={item._id || item.id} className="p-4 flex gap-4 bg-bronze/5 transition-colors duration-200">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyle.class}`}>
                        <Icon className="text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-bone">
                          <span className="text-olive">{item.message}</span>
                        </p>
                        <span className="text-[11px] text-olive mt-1 block">{formatTime(item.createdAt)}</span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-bronze self-center flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Earlier Section */}
          {readNotifications.length > 0 && (
            <div className="space-y-2">
              <h2 className="section-title text-xs uppercase tracking-wider text-olive pl-1 font-semibold">Earlier</h2>
              <div className="card divide-y divide-border overflow-hidden">
                {readNotifications.map(item => {
                  const iconStyle = iconMap[item.type] || iconMap.update;
                  const Icon = iconStyle.icon;

                  return (
                    <div key={item._id || item.id} className="p-4 flex gap-4 transition-colors hover:bg-surface-2/20">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyle.class} opacity-70`}>
                        <Icon className="text-base" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-olive">
                          <span>{item.message}</span>
                        </p>
                        <span className="text-[11px] text-olive/60 mt-1 block">{formatTime(item.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
