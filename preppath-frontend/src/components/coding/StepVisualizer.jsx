import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';

/**
 * StepVisualizer — Reusable animated step-by-step visualizer built with React, SVG, and Framer Motion.
 * Supports:
 * - Variable Box animations ('BOX')
 * - Array element traversal & highlighting ('ARRAY')
 * - Custom step data from JSON
 */
export default function StepVisualizer({ vizType = 'DEFAULT', steps = [] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const totalSteps = steps.length;
  const activeStepData = steps[currentStep] || null;

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, totalSteps]);

  if (!steps || steps.length === 0) {
    return null;
  }

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl space-y-6">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-300">
            Interactive Concept Visualizer
          </h3>
        </div>
        <span className="text-xs font-mono bg-slate-800 px-3 py-1 rounded-full text-slate-400">
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      {/* SVG Canvas Area */}
      <div className="min-h-[220px] flex items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {vizType === 'BOX' && activeStepData?.data && (
            <motion.div
              key={`box-${currentStep}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex flex-col items-center justify-center"
            >
              {/* Variable Box Graphic */}
              <div className="relative">
                <div
                  className={`w-36 h-36 rounded-3xl border-4 flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
                    activeStepData.data.highlight
                      ? 'border-brand-400 bg-brand-500/20 shadow-brand-500/20'
                      : 'border-slate-600 bg-slate-800/50'
                  }`}
                >
                  <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                    {activeStepData.data.type || 'variable'}
                  </span>
                  <motion.span
                    key={activeStepData.data.value}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`text-4xl font-extrabold mt-1 ${
                      activeStepData.data.highlight ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    {activeStepData.data.value}
                  </motion.span>
                </div>

                {/* Box Label Tag */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white font-mono text-xs px-3 py-1 rounded-full font-bold shadow-md">
                  {activeStepData.data.label}
                </div>
              </div>
            </motion.div>
          )}

          {vizType === 'ARRAY' && activeStepData?.data && (
            <motion.div
              key={`array-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3"
            >
              {activeStepData.data.items?.map((item, idx) => {
                const isActive = activeStepData.data.activeIdx === idx;
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.15 : 1,
                        borderColor: isActive ? '#38bdf8' : '#334155',
                        backgroundColor: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                      }}
                      className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold text-lg text-white font-mono shadow-md"
                    >
                      {item}
                    </motion.div>
                    <span
                      className={`text-[11px] font-mono ${
                        isActive ? 'text-sky-400 font-extrabold' : 'text-slate-500'
                      }`}
                    >
                      idx {idx}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}

          {vizType !== 'BOX' && vizType !== 'ARRAY' && (
            <div className="text-center text-slate-400 text-sm">
              <span className="text-2xl block mb-2">⚡</span>
              Step {currentStep + 1}: {activeStepData?.title || 'Execution'}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Caption & Explanation */}
      <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 min-h-[72px]">
        <h4 className="text-sm font-extrabold text-amber-400 mb-1">
          {activeStepData?.title || 'Step Details'}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {activeStepData?.caption || ''}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleReset}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
          title="Previous Step"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-sm text-white flex items-center gap-2 shadow-lg transition-colors"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          <span>{isPlaying ? 'Pause' : 'Play Step-by-Step'}</span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep === totalSteps - 1}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
          title="Next Step"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
