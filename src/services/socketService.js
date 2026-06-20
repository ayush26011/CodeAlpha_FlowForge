import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';


let socket = null;

const socketService = {
  connect() {
    if (socket?.connected) return socket;
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
    socket.on('connect', () => console.log('🔌 Socket connected:', socket.id));
    socket.on('disconnect', () => console.log('🔴 Socket disconnected'));
    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket() {
    return socket;
  },

  // ── Room management ──────────────────────────────────────────────────────
  joinWorkspace(workspaceId) {
    socket?.emit('join_workspace', workspaceId);
  },

  leaveWorkspace(workspaceId) {
    socket?.emit('leave_workspace', workspaceId);
  },

  joinProject(projectId) {
    socket?.emit('join_project', projectId);
  },

  leaveProject(projectId) {
    socket?.emit('leave_project', projectId);
  },

  joinUser(userId) {
    socket?.emit('join_user', userId);
  },

  // ── Event emitters ───────────────────────────────────────────────────────
  emitTaskMoved(taskId, fromCol, toCol, projectId) {
    socket?.emit('task_moved', { taskId, fromCol, toCol, projectId });
  },

  // ── Event listeners (returns cleanup fn) ─────────────────────────────────
  on(event, handler) {
    socket?.on(event, handler);
    return () => socket?.off(event, handler);
  },

  off(event, handler) {
    socket?.off(event, handler);
  },
};

export default socketService;
