import api from './api';

const workspaceService = {
  async getAll() {
    const { data } = await api.get('/workspaces');
    return data.workspaces;
  },

  async getById(id) {
    const { data } = await api.get(`/workspaces/${id}`);
    return data.workspace;
  },

  async create(payload) {
    const { data } = await api.post('/workspaces', payload);
    return data.workspace;
  },

  async update(id, payload) {
    const { data } = await api.put(`/workspaces/${id}`, payload);
    return data.workspace;
  },

  async delete(id) {
    const { data } = await api.delete(`/workspaces/${id}`);
    return data;
  },

  async addMember(id, email, role = 'Member') {
    const { data } = await api.post(`/workspaces/${id}/members`, { email, role });
    return data.workspace;
  },
};

export default workspaceService;
