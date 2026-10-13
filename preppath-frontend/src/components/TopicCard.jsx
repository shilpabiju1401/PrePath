import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

/**
 * TopicCard — displays a single topic with its progress status.
 * States: LOCKED | UNLOCKED | IN_PROGRESS | COMPLETED
 */
export default function TopicCard({ topic, onClick, accentColor = 'blue' }) {
  const { name, description, status = 'LOCKED', sequenceOrder } = topic;

  // Color schemes per state
  const styles = {
    LOCKED:      { bg: 'bg-slate-50',    border: 'border-slate-200', text: 'text-slate-400', badge: 'bg-slate-100 text-slate-500' },
    UNLOCKED:    { bg: 'bg-white',       border: 'border-slate-200', text: 'text-slate-700', badge: `bg-${accentColor}-50 text-${accentColor}-700` },
    IN_PROGRESS: { bg: 'bg-white',       border: `border-${accentColor}-300`, text: 'text-slate-800', badge: `bg-${accentColor}-100 text-${accentColor}-800` },
    COMPLETED:   { bg: 'bg-emerald-50',  border: 'border-emerald-200', text: 'text-slate-800', badge: 'bg-emerald-100 text-emerald-800' },
  };

  const s = styles[status] || styles.LOCKED;
  const isLocked = status === 'LOCKED';

  return (
    <motion.button
      whileHover={!isLocked ? { scale: 1.02, y: -2 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      onClick={!isLocked ? onClick : undefined}
      disabled={isLocked}
      className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 shadow-soft
        ${s.bg} ${s.border} ${isLocked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:shadow-md'}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Topic number + title */}
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0
            ${isLocked ? 'bg-slate-200 text-slate-400' : `bg-${accentColor}-100 text-${accentColor}-700`}`}>
            {isLocked ? <Lock className="w-4 h-4" /> : sequenceOrder}
          </div>
          <div>
            <h3 className={`font-bold text-base ${s.text}`}>{name}</h3>
            {description && (
              <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">{description}</p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${s.badge}`}>
          {status === 'COMPLETED' ? '✓ Done' :
           status === 'IN_PROGRESS' ? '⏳ Active' :
           status === 'UNLOCKED' ? 'Start' : '🔒 Locked'}
        </span>
      </div>

      {/* Locked tooltip */}
      {isLocked && (
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Complete the previous topic's Challenge to unlock.
        </p>
      )}
    </motion.button>
  );
}
