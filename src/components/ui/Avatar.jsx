const getAvatarSrc = (user) => {
  if (!user) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown';
  return (
    user.avatar ||
    user.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || user.email || 'User')}`
  );
};

const onErr = (user) => (e) => {
  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`;
};

// ── Single Avatar ─────────────────────────────────────────────────────────────
export function Avatar({ user, size = 'sm', showStatus = false, className = '' }) {
  const sizes = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const src = getAvatarSrc(user);

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <img
        src={src}
        alt={user?.name || 'User'}
        title={user?.name || 'User'}
        className={`${sizes[size]} rounded-full object-cover`}
        style={{
          boxShadow: '0 0 0 1.5px rgba(42,44,34,0.9), 0 1px 3px rgba(0,0,0,0.4)',
        }}
        onError={onErr(user)}
      />
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-[1.5px]`}
          style={{
            borderColor: '#161710',
            background: user?.online ? '#4ade80' : 'rgba(107,102,89,0.6)',
            boxShadow: user?.online ? '0 0 6px rgba(74,222,128,0.5)' : 'none',
          }}
        />
      )}
    </div>
  );
}

// ── Avatar Group ──────────────────────────────────────────────────────────────
export function AvatarGroup({ users = [], max = 3, size = 'sm' }) {
  const shown = users.slice(0, max);
  const extra = users.length - max;

  const sizes = { xs: 'w-5 h-5', sm: 'w-6 h-6', md: 'w-8 h-8' };
  const textSizes = { xs: 'text-2xs', sm: 'text-2xs', md: 'text-xs' };

  return (
    <div className="flex -space-x-1.5">
      {shown.map((u, i) => (
        <img
          key={u._id || u.id || i}
          src={getAvatarSrc(u)}
          alt={u.name || 'User'}
          title={u.name || 'User'}
          className={`${sizes[size]} rounded-full object-cover`}
          style={{
            boxShadow: '0 0 0 2px #161710',
          }}
          onError={onErr(u)}
        />
      ))}
      {extra > 0 && (
        <div
          className={`${sizes[size]} ${textSizes[size]} rounded-full flex items-center justify-center font-semibold`}
          style={{
            background: 'rgba(42,44,34,0.8)',
            boxShadow: '0 0 0 2px #161710',
            color: 'rgba(107,102,89,0.9)',
          }}
          title={`+${extra} more`}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
