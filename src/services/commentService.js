import api from './api';

const commentService = {
  async getByTask(taskId) {
    const { data } = await api.get(`/comments/${taskId}`);
    return data.comments;
  },

  async add(taskId, text) {
    const { data } = await api.post(`/comments/${taskId}`, { text });
    return data.comment;
  },

  async delete(commentId) {
    const { data } = await api.delete(`/comments/${commentId}`);
    return data;
  },
};

export default commentService;
