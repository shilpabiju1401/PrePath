import React, { useEffect, useState, useRef } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { Clock, CheckCircle2, ChevronRight, ChevronLeft, Flag, AlertCircle, Trophy, BarChart2, Award } from 'lucide-react';

export default function PlacementPage() {
  const [phase, setPhase] = useState('intro'); // 'intro', 'active', 'results'
  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: 'A' }
  const [flagged, setFlagged] = useState({}); // { questionId: true }
  const [timeLeft, setTimeLeft] = useState(900);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const timerRef = useRef(null);

  const startTest = async () => {
    setLoading(true);
    try {
      const res = await api.post('/placement/start');
      setSession(res.data);
      setTimeLeft(res.data.timeLimitSeconds || 900);
      setAnswers({});
      setFlagged({});
      setCurrentIdx(0);
      setPhase('active');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start placement test.');
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (phase !== 'active') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [phase, session]);

  const submitTest = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setLoading(true);
    try {
      const formattedAnswers = Object.entries(answers).map(([qId, opt]) => ({
        questionId: Number(qId),
        selectedOption: opt,
      }));

      const timeTaken = (session?.timeLimitSeconds || 900) - timeLeft;

      const res = await api.post('/placement/submit', {
        sessionId: session.sessionId,
        answers: formattedAnswers,
        timeTakenSeconds: timeTaken,
      });

      setResults(res.data);
      setPhase('results');
      if (res.data.readinessScore >= 70) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit test.');
    } finally {
      setLoading(false);
    }
  };

  const currentQ = session?.questions?.[currentIdx];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 1. INTRO SCREEN
  if (phase === 'intro') {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto py-12 space-y-6 text-center">
          <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Placement Readiness Mock Test</h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Simulate actual campus drive assessments with mixed Aptitude, Reasoning, and Verbal questions, plus review flags and time-bound submission.
          </p>

          <div className="grid grid-cols-3 gap-4 text-left my-8">
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 block uppercase">Questions</span>
              <span className="text-xl font-extrabold text-slate-900">5 Mixed MCQs</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 block uppercase">Time Limit</span>
              <span className="text-xl font-extrabold text-slate-900">15 Minutes</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 block uppercase">Assessment</span>
              <span className="text-xl font-extrabold text-slate-900">Readiness %</span>
            </div>
          </div>

          <button
            onClick={startTest}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all text-base disabled:opacity-50"
          >
            {loading ? 'Preparing Test...' : 'Start Mock Test Now'}
          </button>
        </div>
      </AppLayout>
    );
  }

  // 2. ACTIVE TEST SCREEN
  if (phase === 'active' && currentQ) {
    const isFlagged = flagged[currentQ.id];
    const isAnswered = answers[currentQ.id];

    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-600">
                Question {currentIdx + 1} of {session.questions.length}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setFlagged(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border
                  ${isFlagged ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
              >
                <Flag className="w-3.5 h-3.5" />
                {isFlagged ? 'Flagged for Review' : 'Mark for Review'}
              </button>

              <div className="flex items-center gap-1.5 text-sm font-extrabold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Question Body */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-soft">
            <h2 className="text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.questionText}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const text = currentQ[`option${opt}`];
                if (!text) return null;
                const isSelected = answers[currentQ.id] === opt;

                return (
                  <button
                    key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left text-sm font-semibold transition-all
                      ${isSelected ? 'bg-brand-50 border-brand-500 text-brand-900' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'}`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-white border border-current flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {opt}
                    </span>
                    {text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {currentIdx < session.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 font-bold text-sm text-white"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submitTest}
                disabled={loading}
                className="flex items-center gap-1 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-sm text-white shadow-sm"
              >
                {loading ? 'Submitting...' : 'Submit Test'}
              </button>
            )}
          </div>
        </div>
      </AppLayout>
    );
  }

  // 3. RESULTS SCREEN
  if (phase === 'results' && results) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-soft">
            <div className="inline-flex p-3 bg-brand-50 text-brand-600 rounded-2xl">
              <Award className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">Placement Assessment Report</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 text-left">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 block uppercase">Readiness</span>
                <span className="text-2xl font-extrabold text-brand-600">{results.readinessScore}%</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 block uppercase">Score</span>
                <span className="text-2xl font-extrabold text-slate-900">{results.score}/{results.totalQuestions}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 block uppercase">Accuracy</span>
                <span className="text-2xl font-extrabold text-slate-900">{results.accuracy}%</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 block uppercase">XP Earned</span>
                <span className="text-2xl font-extrabold text-emerald-600">+{results.xpEarned}</span>
              </div>
            </div>

            <button
              onClick={() => setPhase('intro')}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm"
            >
              Take Another Test
            </button>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Answer Explanations & Review</h2>
            {results.reviewDetails?.map((item, idx) => (
              <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  {item.isCorrect ? (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Correct ✓</span>
                  ) : (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Incorrect ✗</span>
                  )}
                  <span className="text-xs text-slate-400">Question {idx + 1}</span>
                </div>
                <p className="font-semibold text-sm text-slate-800">{item.questionText}</p>
                <p className="text-xs text-slate-500">
                  Your Answer: <strong className="text-slate-800">{item.selectedOption || 'Unanswered'}</strong> | Correct Answer: <strong className="text-emerald-700">{item.correctOption}</strong>
                </p>
                {item.explanation && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                    💡 <strong>Explanation:</strong> {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}
