const getAvatarSrc = (user) => {
  if (!user) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown';
  return (
    user.avatar ||
    user.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || user.email || 'User')}`
  );
};

// Avatar
export function Avatar({ user, size = 'sm', showStatus = false, className = '' }) {
  const sizes = {
    xs: 'w-5 h-5 text-xs',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };
  const src = getAvatarSrc(user);
  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <img
        src={src}
        alt={user?.name || 'User'}
        className={`${sizes[size]} rounded-full bg-surface-2 object-cover ring-1 ring-border`}
        onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`; }}
      />
      {showStatus && (
        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-smoky
          ${user?.online ? 'bg-green-500' : 'bg-olive'}`}
        />
      )}
    </div>
  );
}

// AvatarGroup
export function AvatarGroup({ users = [], max = 3, size = 'sm' }) {
  const shown = users.slice(0, max);
  const extra = users.length - max;
  const sizes = { xs: 'w-5 h-5', sm: 'w-7 h-7', md: 'w-9 h-9' };
  return (
    <div className="flex -space-x-2">
      {shown.map((u, i) => (
        <img
          key={u._id || u.id || i}
          src={getAvatarSrc(u)}
          alt={u.name || 'User'}
          title={u.name || 'User'}
          className={`${sizes[size]} rounded-full ring-2 ring-smoky object-cover`}
          onError={e => { e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name || 'User')}`; }}
        />
      ))}
      {extra > 0 && (
        <div className={`${sizes[size]} rounded-full bg-surface-3 ring-2 ring-smoky flex items-center justify-center text-xs text-olive font-medium`}>
          +{extra}
        </div>
      )}
    </div>
  );
}
