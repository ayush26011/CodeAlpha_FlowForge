import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import { useApp } from '../../context/AppContext';
import TaskDetailModal from '../board/TaskDetailModal';
import Toast from '../ui/Toast';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function AppLayout({ children }) {
  const { isTaskModalOpen, closeTask, selectedTask, sidebarOpen, setSidebarOpen, currentUser, authLoading, toast } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-smoky flex">
        {/* Sidebar skeleton */}
        <div className="hidden lg:flex flex-col w-60 h-screen" style={{ background: '#161710', borderRight: '1px solid rgba(42,44,34,0.9)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(42,44,34,0.8)' }}>
            <div className="h-6 w-28 skeleton shimmer rounded-lg" />
          </div>
          <div className="px-2.5 py-3 space-y-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <div className="w-4 h-4 skeleton shimmer rounded" />
                <div className="h-3 skeleton shimmer rounded" style={{ width: `${60 + i * 8}px` }} />
              </div>
            ))}
          </div>
        </div>
        {/* Main area skeleton */}
        <div className="flex-1 flex flex-col">
          <div className="h-14" style={{ background: 'rgba(22,23,16,0.85)', borderBottom: '1px solid rgba(42,44,34,0.9)' }} />
          <div className="flex-1 p-6 space-y-6">
            <div className="h-8 w-48 skeleton shimmer rounded-xl" />
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-24 skeleton shimmer rounded-2xl" />)}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1,2,3].map(i => <div key={i} className="h-40 skeleton shimmer rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-smoky">
      <Sidebar className="hidden lg:flex w-64 fixed left-0 top-0 z-40" />

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-smoky/70 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 z-50 h-full"
            >
              <Sidebar className="flex w-64" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="lg:ml-60 flex flex-col min-h-screen">
        <TopBar />
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6"
        >
          {children}
        </motion.main>
      </div>

      <MobileNav />

      {/* Task Detail Modal */}
      <AnimatePresence>
        {isTaskModalOpen && selectedTask && (
          <TaskDetailModal task={selectedTask} onClose={closeTask} />
        )}
      </AnimatePresence>

      {/* Global Toast */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end">
        <AnimatePresence>
          {toast && (
            <Toast message={toast.message} type={toast.type} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
