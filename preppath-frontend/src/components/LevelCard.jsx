import React from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, PlayCircle, Star } from 'lucide-react';

/**
 * LevelCard — shows one quiz level (Easy / Medium / Hard / Challenge).
 * Locked levels show a lock icon and a helpful message.
 */
export default function LevelCard({ level, onStart }) {
  const { type, locked, bestScore, passed } = level;

  // Visual config per level type
  const config = {
    EASY:      { label: 'Easy',      emoji: '🌱', color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200',  scoreBg: 'bg-emerald-100' },
    MEDIUM:    { label: 'Medium',    emoji: '🔥', color: 'text-orange-700',  bg: 'bg-orange-50',   border: 'border-orange-200',   scoreBg: 'bg-orange-100'  },
    HARD:      { label: 'Hard',      emoji: '⚡',  color: 'text-rose-700',    bg: 'bg-rose-50',     border: 'border-rose-200',     scoreBg: 'bg-rose-100'    },
    CHALLENGE: { label: 'Challenge', emoji: '🏆', color: 'text-purple-700',  bg: 'bg-purple-50',   border: 'border-purple-200',   scoreBg: 'bg-purple-100'  },
  };

  const c = config[type] || config.EASY;

  // Lock override — grey out everything
  const lockStyle = locked
    ? { bg: 'bg-slate-50', border: 'border-slate-200', color: 'text-slate-400' }
    : {};

  return (
    <motion.div
      whileHover={!locked ? { scale: 1.03, y: -3 } : {}}
      className={`rounded-2xl border p-5 flex flex-col gap-4 shadow-soft transition-all duration-200
        ${locked ? 'bg-slate-50 border-slate-200 opacity-75' : `${c.bg} ${c.border} hover:shadow-md`}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{locked ? '🔒' : c.emoji}</span>
          <div>
            <h4 className={`font-bold text-base ${locked ? 'text-slate-400' : c.color}`}>{c.label}</h4>
            <p className="text-xs text-slate-500">5 Questions • 5 min</p>
          </div>
        </div>

        {/* Best score badge */}
        {!locked && bestScore !== undefined && bestScore !== null && (
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${c.scoreBg} ${c.color}`}>
            Best: {Math.round(bestScore)}%
          </div>
        )}
      </div>

      {/* Status row */}
      {!locked && (
        <div className="flex items-center gap-2">
          {passed
            ? <><CheckCircle2 className="w-4 h-4 text-emerald-600" /><span className="text-xs font-semibold text-emerald-700">Passed ✓</span></>
            : <><Star className="w-4 h-4 text-slate-400" /><span className="text-xs text-slate-500">Need 70% to pass</span></>
          }
        </div>
      )}

      {/* Action button */}
      {locked ? (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Lock className="w-3.5 h-3.5" />
          Complete previous level with 70%+ to unlock.
        </div>
      ) : (
        <button
          onClick={onStart}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm
            transition-colors ${c.color} ${c.scoreBg} hover:opacity-90`}
        >
          <PlayCircle className="w-4 h-4" />
          {passed ? 'Replay' : 'Start Quiz'}
        </button>
      )}
    </motion.div>
  );
}
