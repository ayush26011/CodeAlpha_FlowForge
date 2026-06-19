const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a workspace room
    socket.on('join_workspace', (workspaceId) => {
      socket.join(`workspace_${workspaceId}`);
      console.log(`📦 Socket ${socket.id} joined workspace_${workspaceId}`);
    });

    // Join a project room
    socket.on('join_project', (projectId) => {
      socket.join(`project_${projectId}`);
      console.log(`📋 Socket ${socket.id} joined project_${projectId}`);
    });

    // Join user-specific notification room
    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 Socket ${socket.id} joined user_${userId}`);
    });

    // Leave rooms on request
    socket.on('leave_workspace', (workspaceId) => {
      socket.leave(`workspace_${workspaceId}`);
    });

    socket.on('leave_project', (projectId) => {
      socket.leave(`project_${projectId}`);
    });

    // Client-side task move (optimistic UI support)
    socket.on('task_moved', ({ taskId, fromCol, toCol, projectId }) => {
      socket.to(`project_${projectId}`).emit('task_moved', { taskId, fromCol, toCol });
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;
