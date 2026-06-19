import api from './api';

const taskService = {
  async getByProject(projectId) {
    const { data } = await api.get(`/tasks/project/${projectId}`);
    return data.tasks;
  },

  async getByWorkspace(workspaceId) {
    const { data } = await api.get(`/tasks/workspace/${workspaceId}`);
    return data.tasks;
  },

  async getById(id) {
    const { data } = await api.get(`/tasks/${id}`);
    return data.task;
  },

  async create(payload) {
    // payload: { title, description, projectId, workspaceId, status, priority, assignee, dueDate, labels, checklist }
    const { data } = await api.post('/tasks', payload);
    return data.task;
  },

  async update(id, payload) {
    const { data } = await api.put(`/tasks/${id}`, payload);
    return data.task;
  },

  async delete(id) {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await api.put(`/tasks/${id}/status`, { status });
    return data.task;
  },

  async assign(id, assignee) {
    const { data } = await api.put(`/tasks/${id}/assign`, { assignee });
    return data.task;
  },

  async updatePriority(id, priority) {
    const { data } = await api.put(`/tasks/${id}/priority`, { priority });
    return data.task;
  },
};

export default taskService;
