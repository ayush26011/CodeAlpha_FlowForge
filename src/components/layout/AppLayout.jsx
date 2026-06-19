import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import { useApp } from '../../context/AppContext';
import TaskDetailModal from '../board/TaskDetailModal';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function AppLayout({ children }) {
  const { isTaskModalOpen, closeTask, selectedTask, sidebarOpen, setSidebarOpen, currentUser, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-smoky flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bronze" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-smoky">
      <Sidebar />

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
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 z-50 h-full"
            >
              <Sidebar />
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
    </div>
  );
}
