import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '../../components/AppLayout';
import PipOwl from '../../components/mascots/PipOwl';
import BloopBlob from '../../components/mascots/BloopBlob';
import api from '../../services/api';
import { Clock, ChevronRight, AlertCircle, CheckCircle2, XCircle, Loader2, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────
// Timer component — counts down, calls onExpire when done
// ─────────────────────────────────────────────
function QuizTimer({ totalSeconds, onExpire }) {
  const [seconds, setSeconds] = useState(totalSeconds);

  useEffect(() => {
    if (seconds <= 0) { onExpire(); return; }
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, onExpire]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isUrgent = seconds <= 60;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors
      ${isUrgent ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'}`}
    >
      <Clock className={`w-4 h-4 ${isUrgent ? 'animate-pulse' : ''}`} />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
}

// ─────────────────────────────────────────────
// Answer feedback overlay — shown after each question
// ─────────────────────────────────────────────
function AnswerFeedback({ isCorrect, correctOption, explanation, onNext, optionLabels }) {
  useEffect(() => {
    // Fire confetti only on correct answers
    if (isCorrect) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    }
  }, [isCorrect]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl border p-6 space-y-4
        ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}
    >
      {/* Mascot + message */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {isCorrect ? <PipOwl size={80} mood="celebrating" /> : <BloopBlob size={80} mood="encouraging" />}
        </div>
        <div>
          {isCorrect ? (
            <>
              <div className="flex items-center gap-2 font-extrabold text-emerald-800 text-lg">
                <CheckCircle2 className="w-6 h-6" /> Excellent! That's correct! 🎉
              </div>
              <p className="text-emerald-700 text-sm mt-1">+10 XP earned!</p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 font-extrabold text-rose-800 text-lg">
                <XCircle className="w-6 h-6" /> Not quite, but that's okay!
              </div>
              <p className="text-rose-700 text-sm mt-1">
                Correct answer: <strong>{optionLabels[correctOption]}</strong>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Explanation */}
      {explanation && (
        <div className={`rounded-xl p-4 text-sm leading-relaxed
          ${isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}
        >
          <strong>💡 Explanation: </strong>{explanation}
        </div>
      )}

      <button
        onClick={onNext}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors
          ${isCorrect ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}
      >
        Next Question <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Results screen — shown after all questions
// ─────────────────────────────────────────────
function QuizResults({ result, topicId, levelType, onRetry, navigate }) {
  useEffect(() => {
    if (result.passed) confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
  }, [result.passed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto space-y-6 text-center"
    >
      <div className="flex justify-center">
        {result.passed ? <PipOwl size={120} mood="celebrating" /> : <BloopBlob size={120} mood="encouraging" />}
      </div>

      <div className={`rounded-3xl border p-8 ${result.passed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
        <h2 className={`text-2xl font-extrabold mb-2 ${result.passed ? 'text-emerald-900' : 'text-amber-900'}`}>
          {result.passed ? '🏆 Quiz Passed!' : '📚 Keep Practicing!'}
        </h2>
        <p className={`text-sm mb-6 ${result.passed ? 'text-emerald-700' : 'text-amber-700'}`}>
          {result.passed
            ? 'Great job! The next level is now unlocked.'
            : 'You need 70% to pass. Review the topic and try again!'}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 text-left">
          {[
            { label: 'Score', value: `${result.score}/${result.totalQuestions}` },
            { label: 'Accuracy', value: `${result.accuracy?.toFixed(1)}%` },
            { label: 'Time Taken', value: `${Math.floor(result.timeTaken / 60)}m ${result.timeTaken % 60}s` },
            { label: 'XP Earned', value: `+${result.xpEarned ?? 0} XP` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/60 rounded-xl p-3">
              <div className="text-xs text-slate-500 font-medium">{label}</div>
              <div className="text-lg font-extrabold text-slate-900">{value}</div>
            </div>
          ))}
        </div>
        {result.newBadges && result.newBadges.length > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-100/80 border border-amber-300 text-left space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wide text-amber-900 flex items-center gap-1.5">
              <span>🎖️</span> New Achievement Unlocked!
            </div>
            {result.newBadges.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl">✨</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{b.name}</div>
                  <div className="text-xs text-slate-600">{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onRetry} className="flex-1 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm">
          Try Again
        </button>
        <button onClick={() => navigate(`/topic/${topicId}`)} className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-colors text-sm">
          Back to Topic
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Quiz Screen
// ─────────────────────────────────────────────
export default function QuizScreen() {
  const { topicId, levelType } = useParams(); // e.g. /quiz/1/easy
  const navigate = useNavigate();

  // Quiz state machine: 'loading' → 'active' → 'feedback' → 'finished'
  const [phase, setPhase] = useState('loading');
  const [questions, setQuestions] = useState([]);    // All questions (without correct answers)
  const [attemptId, setAttemptId] = useState(null);  // Server-assigned attempt ID
  const [currentIdx, setCurrentIdx] = useState(0);   // Index of current question
  const [selectedOption, setSelectedOption] = useState(null); // Which option user clicked
  const [answers, setAnswers] = useState([]);         // Accumulated answers for submission
  const [feedback, setFeedback] = useState(null);    // Feedback after each answer
  const [startTime] = useState(Date.now());           // Quiz start timestamp
  const [result, setResult] = useState(null);         // Final quiz result
  const [error, setError] = useState('');

  const LEVEL_TIME = 5 * 60; // 5 minutes per quiz (for 5 questions)

  // ── Step 1: Start the quiz and get questions (no correct answers!) ──
  useEffect(() => {
    const startQuiz = async () => {
      try {
        const res = await api.post('/quizzes/start', {
          topicId: parseInt(topicId),
          levelType: levelType.toUpperCase(),
        });
        setAttemptId(res.data.attemptId);
        setQuestions(res.data.questions);
        setPhase('active');
      } catch (err) {
        const msg = err.response?.data?.message || 'Cannot start quiz. The level may be locked.';
        setError(msg);
        setPhase('error');
      }
    };
    startQuiz();
  }, [topicId, levelType]);

  // ── Step 2: User selects an answer ──
  const handleSelectOption = useCallback(async (option) => {
    if (selectedOption) return; // Prevent double-clicking

    setSelectedOption(option);
    const q = questions[currentIdx];

    try {
      // Submit this single answer to get immediate feedback
      // The backend checks the answer and returns isCorrect + explanation
      const res = await api.post('/quizzes/answer', {
        attemptId,
        questionId: q.id,
        selectedOption: option,
      });

      const { isCorrect, correctOption, explanation } = res.data;

      // Record this answer for the final submit
      setAnswers(prev => [...prev, { questionId: q.id, selectedOption: option, isCorrect }]);

      // Show feedback overlay
      setFeedback({ isCorrect, correctOption, explanation });
      setPhase('feedback');
    } catch (err) {
      console.error('Failed to check answer:', err);
    }
  }, [selectedOption, questions, currentIdx, attemptId]);

  // ── Step 3: Move to next question or finish ──
  const handleNext = useCallback(() => {
    setSelectedOption(null);
    setFeedback(null);

    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      // All questions done — submit the quiz
      submitQuiz();
    } else {
      setCurrentIdx(nextIdx);
      setPhase('active');
    }
  }, [currentIdx, questions.length]);

  // ── Step 4: Submit quiz and get final result ──
  const submitQuiz = useCallback(async () => {
    setPhase('loading');
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    try {
      const res = await api.post('/quizzes/submit', {
        attemptId,
        timeTaken,
      });
      setResult(res.data);
      setPhase('finished');
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      setPhase('error');
    }
  }, [attemptId, startTime]);

  // Timer expired — submit whatever we have
  const handleTimeExpire = useCallback(() => {
    submitQuiz();
  }, [submitQuiz]);

  // Option labels for feedback display
  const q = questions[currentIdx];
  const optionLabels = q
    ? { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD }
    : {};

  // ── Render states ──

  if (phase === 'loading') {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading your quiz…</p>
        </div>
      </AppLayout>
    );
  }

  if (phase === 'error') {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto text-center py-16 space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <p className="text-rose-600 font-semibold">{error}</p>
          <button onClick={() => navigate(-1)} className="text-sm text-slate-500 underline">Go back</button>
        </div>
      </AppLayout>
    );
  }

  if (phase === 'finished' && result) {
    return (
      <AppLayout>
        <QuizResults
          result={result}
          topicId={topicId}
          levelType={levelType}
          onRetry={() => window.location.reload()}
          navigate={navigate}
        />
      </AppLayout>
    );
  }

  // Active quiz or feedback
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Progress bar + timer header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span>{Math.round(((currentIdx) / questions.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-brand-500 rounded-full"
                animate={{ width: `${((currentIdx) / questions.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
          <QuizTimer totalSeconds={LEVEL_TIME} onExpire={handleTimeExpire} />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          {(phase === 'active' || phase === 'feedback') && q && (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-6"
            >
              {/* Question text */}
              <h2 className="text-base font-bold text-slate-900 leading-relaxed">{q.questionText}</h2>

              {/* Options */}
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((opt) => {
                  const text = q[`option${opt}`];
                  if (!text) return null;

                  // After answering, highlight correct/wrong
                  let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-brand-50 hover:border-brand-300';
                  if (phase === 'feedback') {
                    if (opt === feedback?.correctOption) btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900';
                    else if (opt === selectedOption) btnClass = 'bg-rose-50 border-rose-400 text-rose-900';
                    else btnClass = 'bg-slate-50 border-slate-200 text-slate-400';
                  }
                  if (selectedOption === opt && phase === 'active') btnClass = 'bg-brand-50 border-brand-400 text-brand-900';

                  return (
                    <button
                      key={opt}
                      onClick={() => phase === 'active' && handleSelectOption(opt)}
                      disabled={phase !== 'active'}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold text-left transition-all duration-150 ${btnClass}`}
                    >
                      <span className="w-7 h-7 rounded-lg bg-white border border-current flex items-center justify-center font-bold text-xs flex-shrink-0">{opt}</span>
                      {text}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer feedback overlay */}
        <AnimatePresence>
          {phase === 'feedback' && feedback && (
            <AnswerFeedback
              isCorrect={feedback.isCorrect}
              correctOption={feedback.correctOption}
              explanation={feedback.explanation}
              optionLabels={optionLabels}
              onNext={handleNext}
            />
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
}
