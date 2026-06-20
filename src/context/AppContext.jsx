/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService';
import workspaceService from '../services/workspaceService';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import notificationService from '../services/notificationService';
import socketService from '../services/socketService';

const AppContext = createContext(null);

// ── helpers ──────────────────────────────────────────────────────────────────
const tasksToColumns = (taskArray) => ({
  backlog:    taskArray.filter(t => t.status === 'backlog'),
  todo:       taskArray.filter(t => t.status === 'todo'),
  inprogress: taskArray.filter(t => t.status === 'inprogress'),
  review:     taskArray.filter(t => t.status === 'review'),
  done:       taskArray.filter(t => t.status === 'done'),
});

export function AppProvider({ children }) {
  // ── Auth state ─────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser]       = useState(authService.getStoredUser());
  const [authLoading, setAuthLoading]       = useState(true);

  // ── Workspace/Project/Task state ───────────────────────────────────────────
  const [workspaces, setWorkspaces]           = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [projects, setProjects]               = useState([]);
  const [activeProject, setActiveProject]     = useState(null);
  const [tasks, setTasks]                     = useState({ backlog: [], todo: [], inprogress: [], review: [], done: [] });
  const [allTasks, setAllTasks]               = useState([]);

  // ── Notifications ──────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState([]);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [selectedTask, setSelectedTask]       = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [loading, setLoading]                 = useState({ workspace: false, project: false, tasks: false });
  const [error, setError]                     = useState(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Refs to avoid stale closure deps without causing re-render loops
  const activeWorkspaceRef = useRef(null);
  const activeProjectRef   = useRef(null);

  useEffect(() => { activeWorkspaceRef.current = activeWorkspace; }, [activeWorkspace]);
  useEffect(() => { activeProjectRef.current   = activeProject;   }, [activeProject]);

  // ─────────────────────────────────────────────────────────────────────────
  // Auth helpers
  // ─────────────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setCurrentUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    setCurrentUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    socketService.disconnect();
    setCurrentUser(null);
    setWorkspaces([]);
    setActiveWorkspace(null);
    setProjects([]);
    setTasks({ backlog: [], todo: [], inprogress: [], review: [], done: [] });
    setAllTasks([]);
    setNotifications([]);
    setError(null);
    activeWorkspaceRef.current = null;
    activeProjectRef.current   = null;
  };

  const updateCurrentUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('flowforge_user', JSON.stringify(user));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Bootstrap: restore session
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      if (!authService.isAuthenticated()) {
        setAuthLoading(false);
        return;
      }
      try {
        const user = await authService.getMe();
        setCurrentUser(user);
      } catch {
        authService.logout();
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    init();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Data loading helpers
  // NOTE: loadWorkspaces does NOT depend on activeWorkspace — it reads from
  //       the ref to avoid an infinite loop (set ws → set activeWs → reload).
  // ─────────────────────────────────────────────────────────────────────────
  const loadWorkspaces = useCallback(async () => {
    try {
      setLoading(l => ({ ...l, workspace: true }));
      const ws = await workspaceService.getAll();
      setWorkspaces(ws);
      // Only auto-select the first workspace if none is currently active
      if (ws.length > 0 && !activeWorkspaceRef.current) {
        setActiveWorkspace(ws[0]);
      }
    } catch (e) {
      showToast(e.message, 'error');
      setError(e.message);
    } finally {
      setLoading(l => ({ ...l, workspace: false }));
    }
  }, [showToast]); // ← no activeWorkspace dep → stable reference

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data.notifications || []);
    } catch {
      // silent — not critical
    }
  }, []);

  const loadProjects = useCallback(async (workspaceId) => {
    if (!workspaceId) return;
    try {
      setLoading(l => ({ ...l, project: true }));
      const ps = await projectService.getByWorkspace(workspaceId);
      setProjects(ps);
      // Only auto-select the first project if none is active in this workspace
      if (ps.length > 0) {
        const hasActiveInNew = ps.some(p => p._id === activeProjectRef.current?._id);
        if (!hasActiveInNew) setActiveProject(ps[0]);
      } else {
        setActiveProject(null);
      }
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(l => ({ ...l, project: false }));
    }
  }, [showToast]); // ← stable reference

  const loadWorkspaceTasks = useCallback(async (workspaceId) => {
    if (!workspaceId) return;
    try {
      setLoading(l => ({ ...l, tasks: true }));
      const ts = await taskService.getByWorkspace(workspaceId);
      setAllTasks(Array.isArray(ts) ? ts : []);
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(l => ({ ...l, tasks: false }));
    }
  }, [showToast]);

  const loadTasks = useCallback(async () => {
    if (activeWorkspaceRef.current) {
      await loadWorkspaceTasks(activeWorkspaceRef.current._id);
    }
  }, [loadWorkspaceTasks]);

  // ─────────────────────────────────────────────────────────────────────────
  // Effects
  // ─────────────────────────────────────────────────────────────────────────

  // Load workspaces + connect socket once user is known
  useEffect(() => {
    if (!currentUser) return;
    loadWorkspaces();
    loadNotifications();

    const socket = socketService.connect();
    if (socket) {
      const doJoin = () => socketService.joinUser(currentUser._id);
      if (socket.connected) doJoin();
      else socket.once('connect', doJoin);
    }
  }, [currentUser, loadWorkspaces, loadNotifications]);

  // Load projects + tasks when activeWorkspace changes
  useEffect(() => {
    if (!activeWorkspace) return;
    loadProjects(activeWorkspace._id);
    loadWorkspaceTasks(activeWorkspace._id);

    const socket = socketService.getSocket();
    if (socket?.connected) {
      socketService.joinWorkspace(activeWorkspace._id);
    } else if (socket) {
      socket.once('connect', () => socketService.joinWorkspace(activeWorkspace._id));
    }
  }, [activeWorkspace, loadProjects, loadWorkspaceTasks]);

  // Derive column-grouped tasks when activeProject or allTasks changes
  useEffect(() => {
    if (!activeProject) {
      setTasks({ backlog: [], todo: [], inprogress: [], review: [], done: [] });
      return;
    }
    socketService.joinProject(activeProject._id);
    const projTasks = allTasks.filter(
      t => (t.project?._id || t.project) === activeProject._id
    );
    setTasks(tasksToColumns(projTasks));
  }, [activeProject, allTasks]);

  // ─────────────────────────────────────────────────────────────────────────
  // Socket real-time listeners
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return;

    const attachListeners = () => {
      const socket = socketService.getSocket();
      if (!socket) return;

      const handleTaskCreated = (task) => {
        setAllTasks(prev => {
          if (prev.find(t => t._id === task._id)) return prev;
          return [task, ...prev];
        });
      };

      const handleTaskUpdated = (task) => {
        if (task.deleted) {
          setAllTasks(prev => prev.filter(t => t._id !== task._id));
          return;
        }
        setAllTasks(prev => prev.map(t => t._id === task._id ? task : t));
      };

      const handleTaskMoved = ({ taskId, status, task }) => {
        if (task) {
          setAllTasks(prev => prev.map(t => t._id === task._id ? task : t));
        } else {
          setAllTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
        }
      };

      const handleNotification = (notif) => {
        setNotifications(prev => [notif, ...prev]);
        showToast(notif.message, 'success');
      };

      const off1 = socketService.on('task_created',      handleTaskCreated);
      const off2 = socketService.on('task_updated',      handleTaskUpdated);
      const off3 = socketService.on('task_moved',        handleTaskMoved);
      const off4 = socketService.on('task_assigned',     handleTaskUpdated);
      const off5 = socketService.on('notification_created', handleNotification);

      return () => { off1(); off2(); off3(); off4(); off5(); };
    };

    const socket = socketService.getSocket();
    if (socket?.connected) {
      return attachListeners();
    } else if (socket) {
      let cleanup;
      socket.once('connect', () => { cleanup = attachListeners(); });
      return () => { if (cleanup) cleanup(); };
    }
  }, [currentUser, showToast]);

  // ─────────────────────────────────────────────────────────────────────────
  // Task actions
  // ─────────────────────────────────────────────────────────────────────────
  const moveTask = async (taskId, fromCol, toCol) => {
    if (fromCol === toCol) return;
    setAllTasks(prev =>
      prev.map(t => (t._id === taskId || t.id === taskId) ? { ...t, status: toCol } : t)
    );
    try {
      await taskService.updateStatus(taskId, toCol);
    } catch (e) {
      setAllTasks(prev =>
        prev.map(t => (t._id === taskId || t.id === taskId) ? { ...t, status: fromCol } : t)
      );
      showToast(e.message, 'error');
    }
  };

  const reorderTasks = (col, startIndex, endIndex) => {
    setTasks(prev => {
      const list = Array.from(prev[col] || []);
      const [removed] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, removed);
      return { ...prev, [col]: list };
    });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Notification actions
  // ─────────────────────────────────────────────────────────────────────────
  const markNotificationRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Task modal
  // ─────────────────────────────────────────────────────────────────────────
  const openTask = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTask = () => {
    setIsTaskModalOpen(false);
    setTimeout(() => setSelectedTask(null), 300);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      // Auth
      currentUser, authLoading,
      login, register, logout, updateCurrentUser,
      // Workspaces
      workspaces, activeWorkspace, setActiveWorkspace,
      loadWorkspaces,
      // Projects
      projects, activeProject, setActiveProject,
      loadProjects,
      // Tasks
      tasks, allTasks, setTasks,
      moveTask, reorderTasks, loadTasks,
      // Notifications
      notifications, unreadCount,
      markNotificationRead, markAllNotificationsRead, loadNotifications,
      // Task modal
      selectedTask, isTaskModalOpen, openTask, closeTask,
      // UI
      sidebarOpen, setSidebarOpen,
      loading, error,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
