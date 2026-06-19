import api from './api';

const userService = {
  async getProfile() {
    const { data } = await api.get('/users/me');
    return data.user;
  },

  async updateProfile(payload) {
    const { data } = await api.put('/users/profile', payload);
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data.user;
  },

  async updatePrivacy(payload) {
    const { data } = await api.put('/users/privacy', payload);
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data.user;
  },

  async updateNotifications(payload) {
    const { data } = await api.put('/users/notifications', payload);
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data.user;
  },

  async updateAppearance(payload) {
    const { data } = await api.put('/users/appearance', payload);
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data.user;
  },

  async changePassword(currentPassword, newPassword) {
    const { data } = await api.put('/users/security/password', { currentPassword, newPassword });
    return data;
  },

  async updateSecuritySettings(payload) {
    const { data } = await api.put('/users/security/settings', payload);
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data.user;
  },

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data.user;
  },

  async search(query) {
    const { data } = await api.get('/users/search', { params: { query } });
    return data.users;
  },
};

export default userService;
