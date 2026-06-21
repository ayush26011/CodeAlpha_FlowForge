export function getAvatarUrl(user) {
  if (!user) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Unknown';
  return user.avatar || user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`;
}
