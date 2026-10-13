import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

/**
 * BadgeCard — displays a single gamification badge.
 * If 'earned' is false, it shows as greyed-out (locked).
 */
export default function BadgeCard({ badge, earned = false, earnedAt }) {
  // Map badge criteriaKey to emoji
  const emojiMap = {
    FIRST_QUIZ_PASS:     '👣',
    PERFECT_HARD_SCORE:  '🎯',
    FIRST_CODE_ACCEPTED: '💻',
    STREAK_7_DAYS:       '🔥',
    SOLVED_10_DSA:       '🏆',
  };

  const emoji = emojiMap[badge.criteriaKey] || '🏅';

  return (
    <motion.div
      whileHover={earned ? { scale: 1.05 } : {}}
      className={`rounded-2xl border p-4 flex flex-col items-center text-center gap-2 transition-all duration-200
        ${earned
          ? 'bg-white border-amber-200 shadow-soft hover:shadow-md'
          : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
        }`}
    >
      {/* Badge icon */}
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl
        ${earned ? 'bg-amber-50' : 'bg-slate-100'}`}>
        {emoji}
      </div>

      {/* Badge name */}
      <h4 className={`font-bold text-sm ${earned ? 'text-slate-800' : 'text-slate-500'}`}>
        {badge.name}
      </h4>

      {/* Description */}
      <p className="text-xs text-slate-500 line-clamp-2">{badge.description}</p>

      {/* Earned date or "Locked" label */}
      {earned && earnedAt ? (
        <span className="text-xs text-amber-600 font-semibold">
          Earned {new Date(earnedAt).toLocaleDateString()}
        </span>
      ) : !earned ? (
        <span className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
          <Award className="w-3 h-3" /> Not yet earned
        </span>
      ) : null}
    </motion.div>
  );
}
