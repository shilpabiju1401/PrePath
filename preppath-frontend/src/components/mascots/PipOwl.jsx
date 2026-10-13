import React from 'react';
import { motion } from 'framer-motion';

/**
 * Pip the Owl - PrepPath's cheerful celebration mascot
 * Celebrates victories, streaks, and correct answers!
 */
export default function PipOwl({ size = 120, mood = 'celebrating', className = '' }) {
  return (
    <motion.div
      className={`inline-flex flex-col items-center select-none ${className}`}
      animate={
        mood === 'celebrating'
          ? { y: [0, -10, 0], rotate: [-2, 2, -2] }
          : { y: [0, -4, 0] }
      }
      transition={{ repeat: Infinity, duration: mood === 'celebrating' ? 1.5 : 2.5, ease: 'easeInOut' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        {/* Feet */}
        <ellipse cx="65" cy="148" rx="10" ry="5" fill="#F59E0B" />
        <ellipse cx="95" cy="148" rx="10" ry="5" fill="#F59E0B" />

        {/* Body */}
        <rect x="35" y="45" width="90" height="100" rx="45" fill="#6366F1" />

        {/* Belly Patch */}
        <path
          d="M50 85 C50 65, 110 65, 110 85 C110 120, 50 120, 50 85 Z"
          fill="#EEF2FF"
        />

        {/* Wings */}
        {mood === 'celebrating' ? (
          <>
            {/* Raised celebration wings */}
            <path
              d="M38 75 C15 50, 15 30, 32 48 C36 54, 40 65, 38 75 Z"
              fill="#4F46E5"
            />
            <path
              d="M122 75 C145 50, 145 30, 128 48 C124 54, 120 65, 122 75 Z"
              fill="#4F46E5"
            />
          </>
        ) : (
          <>
            {/* Resting wings */}
            <path
              d="M35 70 C22 85, 22 110, 38 120 C36 100, 35 85, 35 70 Z"
              fill="#4F46E5"
            />
            <path
              d="M125 70 C138 85, 138 110, 122 120 C124 100, 125 85, 125 70 Z"
              fill="#4F46E5"
            />
          </>
        )}

        {/* Feather Details on Belly */}
        <path d="M72 92 Q80 97 88 92" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M66 104 Q80 110 94 104" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" />

        {/* Graduation Cap */}
        <path d="M40 38 L80 20 L120 38 L80 48 Z" fill="#1E1B4B" />
        <rect x="68" y="43" width="24" height="7" rx="3" fill="#312E81" />
        {/* Tassel */}
        <circle cx="80" cy="33" r="3.5" fill="#F59E0B" />
        <path d="M80 33 Q102 38 106 52" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
        <rect x="103" y="52" width="6" height="8" rx="2" fill="#F59E0B" />

        {/* Big Owl Eyes */}
        <circle cx="62" cy="68" r="16" fill="white" />
        <circle cx="98" cy="68" r="16" fill="white" />

        {/* Eye Pupils */}
        <circle cx="65" cy="67" r="8" fill="#1E1B4B" />
        <circle cx="95" cy="67" r="8" fill="#1E1B4B" />

        {/* Sparkle in eyes */}
        <circle cx="63" cy="64" r="3" fill="white" />
        <circle cx="93" cy="64" r="3" fill="white" />

        {/* Beak */}
        <polygon points="74,75 86,75 80,87" fill="#F59E0B" />

        {/* Cheerful Blush */}
        <circle cx="50" cy="78" r="5" fill="#F43F5E" opacity="0.4" />
        <circle cx="110" cy="78" r="5" fill="#F43F5E" opacity="0.4" />
      </svg>
      <span className="text-xs font-bold text-indigo-700 mt-1 tracking-wide">Pip the Owl</span>
    </motion.div>
  );
}
