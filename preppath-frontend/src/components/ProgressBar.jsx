import React from 'react';
import { motion } from 'framer-motion';

/**
 * ProgressBar — animated horizontal progress bar.
 * Props:
 *  - value: number 0–100 (percentage)
 *  - color: Tailwind bg class (e.g. "bg-brand-500")
 *  - label: optional text shown above the bar
 *  - showValue: whether to show the % number
 */
export default function ProgressBar({ value = 0, color = 'bg-brand-500', label, showValue = true, height = 'h-3', className = '' }) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${className}`}>
      {/* Label row */}
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs font-semibold text-slate-600">{label}</span>}
          {showValue && <span className="text-xs font-bold text-slate-700">{clamped}%</span>}
        </div>
      )}

      {/* Track */}
      <div className={`w-full ${height} bg-slate-100 rounded-full overflow-hidden`}>
        {/* Animated fill */}
        <motion.div
          className={`${height} ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
