import api from './api';

const settingsService = {
  async updateSettings(payload) {
    // payload: { privacySettings, notificationSettings }
    console.log('PUT /users/settings Request Payload:', payload);
    const { data } = await api.put('/users/settings', payload);
    console.log('PUT /users/settings Response Payload:', data);
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data.user;
  }
};

export default settingsService;
