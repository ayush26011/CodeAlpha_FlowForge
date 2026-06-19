import api from './api';

const notificationService = {
  async getAll() {
    const { data } = await api.get('/notifications');
    return data;
  },

  async markRead(id) {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data.notification;
  },

  async markAllRead() {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },
};

export default notificationService;
