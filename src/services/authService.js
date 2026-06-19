import api from './api';

const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('flowforge_token', data.token);
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data;
  },

  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('flowforge_token', data.token);
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data;
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    localStorage.setItem('flowforge_user', JSON.stringify(data.user));
    return data.user;
  },

  logout() {
    localStorage.removeItem('flowforge_token');
    localStorage.removeItem('flowforge_user');
  },

  getStoredUser() {
    try {
      const u = localStorage.getItem('flowforge_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('flowforge_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('flowforge_token');
  },
};

export default authService;
