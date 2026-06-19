import api from './api';

const projectService = {
  async getByWorkspace(workspaceId) {
    const { data } = await api.get(`/projects/workspace/${workspaceId}`);
    return data.projects;
  },

  async getById(id) {
    const { data } = await api.get(`/projects/${id}`);
    return data.project;
  },

  async create(payload) {
    // payload: { name, description, workspaceId, dueDate, color, members }
    const { data } = await api.post('/projects', payload);
    return data.project;
  },

  async update(id, payload) {
    const { data } = await api.put(`/projects/${id}`, payload);
    return data.project;
  },

  async delete(id) {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  },
};

export default projectService;
