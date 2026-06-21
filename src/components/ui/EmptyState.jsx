import { motion } from 'framer-motion';

export default function EmptyState({ icon, title, description, action, compact = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center text-center ${compact ? 'py-10 px-4' : 'py-20 px-6'}`}
    >
      {/* Icon container with layered glow */}
      <div className="relative mb-6">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
          style={{
            background: 'rgba(30,32,24,0.8)',
            border: '1px solid rgba(42,44,34,0.8)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <span className="opacity-60 text-bone">{icon}</span>
        </div>
        {/* Subtle glow underneath */}
        <div
          className="absolute inset-0 rounded-2xl blur-xl opacity-15 -z-10"
          style={{ background: 'rgba(155,130,96,0.6)' }}
        />
      </div>

      <h3
        className="font-semibold text-bone mb-2"
        style={{ fontSize: compact ? '0.875rem' : '1rem', letterSpacing: '-0.01em' }}
      >
        {title}
      </h3>
      <p
        className="text-olive leading-relaxed mb-6"
        style={{ fontSize: '0.8125rem', maxWidth: '280px' }}
      >
        {description}
      </p>
      {action && (
        <button
          id={`empty-state-cta-${title?.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={action.onClick}
          className="btn-primary text-sm"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
