import { motion, AnimatePresence } from 'framer-motion';
import { RiCheckLine, RiCloseLine, RiErrorWarningLine, RiInformationLine } from 'react-icons/ri';

const iconMap = {
  success: { icon: RiCheckLine, color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.15)' },
  error:   { icon: RiErrorWarningLine, color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' },
  info:    { icon: RiInformationLine, color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.15)' },
};

export default function Toast({ message, type = 'success', onDismiss }) {
  const config = iconMap[type] || iconMap.success;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{   opacity: 0, y: 8,   scale: 0.97 }}
      transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl max-w-sm w-full"
      style={{
        background: '#1A1B14',
        border: `1px solid ${config.border}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: config.bg }}
      >
        <Icon className="text-sm" style={{ color: config.color }} />
      </div>
      <p className="flex-1 text-sm text-bone leading-snug">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-olive hover:text-bone transition-colors p-0.5 flex-shrink-0"
        >
          <RiCloseLine className="text-sm" />
        </button>
      )}
    </motion.div>
  );
}
