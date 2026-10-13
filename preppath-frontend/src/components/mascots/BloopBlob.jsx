import React from 'react';
import { motion } from 'framer-motion';

/**
 * Bloop the Blob - PrepPath's friendly, encouraging mascot
 * Appears when students need hints or make a mistake, always supportive!
 */
export default function BloopBlob({ size = 120, mood = 'encouraging', className = '' }) {
  return (
    <motion.div
      className={`inline-flex flex-col items-center select-none ${className}`}
      animate={{
        scaleY: [1, 0.94, 1.03, 1],
        scaleX: [1, 1.05, 0.97, 1],
      }}
      transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <defs>
          <linearGradient id="blobGradient" x1="20" y1="20" x2="140" y2="150" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A78BFA" />
            <stop offset="1" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="blushGradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#FB7185" stopOpacity="0.8" />
            <stop offset="1" stopColor="#E11D48" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Jelly Body */}
        <path
          d="M80 25 C120 25, 145 55, 145 95 C145 130, 120 145, 80 145 C40 145, 15 130, 15 95 C15 55, 40 25, 80 25 Z"
          fill="url(#blobGradient)"
        />

        {/* Gloss highlight on top */}
        <ellipse cx="60" cy="45" rx="20" ry="10" fill="white" opacity="0.35" transform="rotate(-15 60 45)" />
        <circle cx="95" cy="40" r="4" fill="white" opacity="0.4" />

        {/* Cheeks */}
        <ellipse cx="44" cy="98" rx="8" ry="5" fill="url(#blushGradient)" />
        <ellipse cx="116" cy="98" rx="8" ry="5" fill="url(#blushGradient)" />

        {/* Big Curious Eyes */}
        <ellipse cx="58" cy="82" rx="10" ry="12" fill="#1E1B4B" />
        <ellipse cx="102" cy="82" rx="10" ry="12" fill="#1E1B4B" />

        {/* Eye Shine */}
        <circle cx="55" cy="78" r="4.5" fill="white" />
        <circle cx="62" cy="85" r="2" fill="white" />
        <circle cx="99" cy="78" r="4.5" fill="white" />
        <circle cx="106" cy="85" r="2" fill="white" />

        {/* Mouth */}
        {mood === 'encouraging' ? (
          // Sweet gentle smile
          <path d="M72 100 Q80 110 88 100" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : (
          // Curious "o" mouth
          <ellipse cx="80" cy="102" rx="5" ry="6" fill="#1E1B4B" />
        )}
      </svg>
      <span className="text-xs font-bold text-violet-700 mt-1 tracking-wide">Bloop the Blob</span>
    </motion.div>
  );
}
