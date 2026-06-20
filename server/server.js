require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const initSocket = require('./socket/socketServer');

// ─── Route imports ─────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const workspaceRoutes = require('./routes/workspaceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// ─── Build allowed origins list ───────────────────────────────────────────────
const DEV_PORTS = [5173, 5174, 5175, 5176];
const DEV_HOSTS = ['localhost', '127.0.0.1'];

function getAllowedOrigins() {
  const origins = new Set();

  // Always allow all standard Vite dev ports on both hostnames
  for (const host of DEV_HOSTS) {
    for (const port of DEV_PORTS) {
      origins.add(`http://${host}:${port}`);
    }
  }

  // Add any production/custom origins from CLIENT_URL (supports comma-separated)
  const clientUrl = process.env.CLIENT_URL;
  if (clientUrl) {
    clientUrl.split(',').forEach((url) => {
      const trimmed = url.trim();
      if (trimmed) origins.add(trimmed);
    });
  }

  return [...origins];
}

const ALLOWED_ORIGINS = getAllowedOrigins();

// ─── CORS origin validator ────────────────────────────────────────────────────
function corsOriginValidator(origin, callback) {
  // Allow requests with no origin (curl, Postman, server-to-server)
  if (!origin) return callback(null, true);
  if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
  return callback(new Error(`CORS: origin '${origin}' not allowed`));
}

// ─── Connect to database ───────────────────────────────────────────────────────
connectDB();

// ─── Create Express app ────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─── Socket.IO setup ──────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
app.set('io', io);
initSocket(io);

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: corsOriginValidator,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🔥 FlowForge API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    allowedOrigins: ALLOWED_ORIGINS,
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── Error handlers ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 FlowForge server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS allowed origins (${ALLOWED_ORIGINS.length}):`);
  ALLOWED_ORIGINS.forEach((o) => console.log(`   • ${o}`));
  console.log(`🔗 Health: http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

