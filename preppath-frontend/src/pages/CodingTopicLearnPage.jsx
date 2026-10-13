import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import AppLayout from '../components/AppLayout';
import StepVisualizer from '../components/coding/StepVisualizer';
import PipOwl from '../components/mascots/PipOwl';
import api from '../services/api';
import confetti from 'canvas-confetti';
import FormattedMarkdown from '../components/common/FormattedMarkdown';
import { useAuth } from '../context/AuthContext';
import {
  ChevronLeft, ChevronRight, Play, Sparkles, AlertCircle, CheckCircle2,
  Terminal, Code2, BookOpen, Lightbulb, CheckSquare, Award
} from 'lucide-react';

export default function CodingTopicLearnPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeLang, setActiveLang] = useState('python');

  // Playground state
  const [userCode, setUserCode] = useState('');
  const [stdin, setStdin] = useState('');
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [showRunCelebration, setShowRunCelebration] = useState(false);

  // Next-button state
  const [nextLoading, setNextLoading] = useState(false);
  const [nextXpPopup, setNextXpPopup] = useState(null); // null | { xpAwarded, alreadyCompleted }

  const fetchTopic = async () => {
    setLoading(true);
    setError(null);
    setRunResult(null);
    setShowRunCelebration(false);
    setNextXpPopup(null);
    try {
      const res = await api.get(`/coding/topics/${topicId}`);
      setTopic(res.data);
      setUserCode('');
    } catch (err) {
      console.error('Failed to load topic:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to load topic.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, [topicId]);

  const handleLangChange = (lang) => {
    setActiveLang(lang);
    setUserCode('');
  };

  // ── Run Code ──────────────────────────────────────────────────────────────
  const handleRunCode = async () => {
    setRunning(true);
    setRunResult(null);
    setShowRunCelebration(false);
    try {
      const res = await api.post('/coding/run', {
        topicId: Number(topicId),
        language: activeLang,
        code: userCode,
        stdin,
      });
      setRunResult(res.data);
      if (res.data.isFirstSuccess) {
        setShowRunCelebration(true);
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 } });
        await refreshUser(); // update XP in header / dashboard
      }
    } catch (err) {
      setRunResult({ status: 'ERROR', stderr: err.response?.data?.message || err.message });
    } finally {
      setRunning(false);
    }
  };

  // ── Next Topic button ─────────────────────────────────────────────────────
  const handleNext = useCallback(async () => {
    if (nextLoading) return;
    setNextLoading(true);
    try {
      const res = await api.post(`/coding/topics/${topicId}/complete`);
      const { xpAwarded, alreadyCompleted } = res.data;

      if (xpAwarded > 0) {
        // First time completing this topic — celebrate!
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        await refreshUser(); // sync XP to dashboard immediately
      }

      setNextXpPopup({ xpAwarded, alreadyCompleted });

      // Navigate to next topic after a short delay (so popup is visible)
      setTimeout(() => {
        if (topic?.nextTopicId) {
          navigate(`/coding/topic/${topic.nextTopicId}`);
        } else {
          // Last topic — go back to roadmap
          navigate('/coding');
        }
      }, xpAwarded > 0 ? 1800 : 600);
    } catch (err) {
      console.error('Failed to complete topic:', err);
      // Even on error, still navigate
      if (topic?.nextTopicId) navigate(`/coding/topic/${topic.nextTopicId}`);
      else navigate('/coding');
    } finally {
      setNextLoading(false);
    }
  }, [topicId, topic, navigate, refreshUser, nextLoading]);

  // ── Loading / Error states ─────────────────────────────────────────────────
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
          Loading topic learning content...
        </div>
      </AppLayout>
    );
  }

  if (error || !topic) {
    return (
      <AppLayout>
        <div className="max-w-xl mx-auto text-center py-20 px-4 space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-sm">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {error || 'Topic Not Found'}
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            {error?.toLowerCase().includes('locked')
              ? 'This topic is locked. Complete all topics in the previous level on your roadmap to unlock it!'
              : 'Unable to load this topic from the server. Please check your connection or return to the roadmap.'}
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/coding')}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
            >
              ← Back to Roadmap
            </button>
            <button
              onClick={fetchTopic}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
            >
              Retry
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Parse visualization steps
  let vizSteps = [];
  try {
    if (topic.visualization?.stepsJson) vizSteps = JSON.parse(topic.visualization.stepsJson);
  } catch (e) { /* skip */ }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-10 pb-16">

        {/* ── Header ── */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/coding')}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Roadmap
          </button>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-3">
              Level {topic.levelNumber} Concept
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">{topic.name}</h1>
            <p className="text-slate-600 text-base leading-relaxed">{topic.summary}</p>
          </div>
        </div>

        {/* ── 1. Sections ── */}
        <div className="space-y-6">
          {topic.sections?.map((sec) => (
            <div
              key={sec.id}
              className={`rounded-3xl p-6 sm:p-8 border ${
                sec.sectionType === 'ANALOGY'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                  : sec.sectionType === 'MISTAKES'
                  ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                  : 'bg-white border-slate-200 text-slate-800'
              } shadow-soft`}
            >
              <div className="flex items-center gap-2 mb-3">
                {sec.sectionType === 'ANALOGY'  && <Lightbulb   className="w-5 h-5 text-amber-600" />}
                {sec.sectionType === 'CONCEPT'  && <BookOpen    className="w-5 h-5 text-brand-600" />}
                {sec.sectionType === 'MISTAKES' && <AlertCircle className="w-5 h-5 text-rose-600" />}
                {sec.sectionType === 'SUMMARY'  && <CheckSquare className="w-5 h-5 text-emerald-600" />}
                <h2 className="text-lg font-bold text-slate-900">{sec.title}</h2>
              </div>
              <FormattedMarkdown content={sec.contentMarkdown} />
            </div>
          ))}
        </div>

        {/* ── 2. Visualizer ── */}
        {vizSteps.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" /> Visual Step-by-Step Breakdown
            </h2>
            <StepVisualizer vizType={topic.visualization?.vizType || 'BOX'} steps={vizSteps} />
          </div>
        )}

        {/* ── 3. Code Examples ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Syntax &amp; Worked Examples</h2>
              <p className="text-xs text-slate-500">Explore how this topic looks across C, Java, and Python</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
              {['python', 'java', 'c'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    activeLang === lang ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang === 'python' ? 'Python 3' : lang === 'java' ? 'Java 17' : 'C (GCC)'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {topic.codeExamples
              ?.filter((ex) => ex.language.toLowerCase() === activeLang.toLowerCase())
              .map((ex) => (
                <div key={ex.id} className="space-y-3">
                  <h3 className="font-bold text-sm text-slate-800">{ex.title}</h3>
                  <div className="bg-slate-900 rounded-2xl p-4 text-xs font-mono text-slate-100 overflow-x-auto shadow-inner">
                    <pre>{ex.code}</pre>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-2">
                    <div>
                      <strong className="text-slate-900">Line-by-line explanation:</strong>
                      <p className="whitespace-pre-wrap mt-1">{ex.explanation}</p>
                    </div>
                    <div>
                      <strong className="text-slate-900">Expected Output:</strong>
                      <pre className="bg-white p-2 rounded-xl border border-slate-200 mt-1 font-mono text-[11px] text-slate-800">
                        {ex.expectedOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ── 4. Free Practice Playground ── */}
        <div id="coding-area" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Code2 className="w-6 h-6 text-brand-600" /> Try It Yourself (Free Practice)
              </h2>
              <p className="text-xs text-slate-500">
                Write any program using what you learned. First successful execution awards <strong>10 XP</strong>!
              </p>
            </div>
            <button
              onClick={handleRunCode}
              disabled={running}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              {running ? 'Running...' : 'Run Code'}
            </button>
          </div>

          {/* Monaco Editor */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase flex items-center justify-between">
              <span>Code Editor ({activeLang.toUpperCase()})</span>
              <span className="text-[11px] font-normal text-slate-400">Write any code to experiment</span>
            </div>
            <div className="h-64 sm:h-72">
              <Editor
                height="100%"
                language={activeLang}
                value={userCode}
                theme="vs-light"
                onChange={(val) => setUserCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>

          {/* Optional Stdin */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Standard Input (Optional stdin)
            </label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Provide any inputs here if your program uses scanf / input() / Scanner"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Run Celebration Popup */}
          {showRunCelebration && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PipOwl size={48} mood="celebrating" />
                <div>
                  <h4 className="font-extrabold text-sm text-emerald-900">🎉 Fantastic job! First run completed!</h4>
                  <p className="text-xs text-emerald-700">You earned <strong>+10 XP</strong> for practicing this topic!</p>
                </div>
              </div>
              <div className="text-lg font-extrabold text-amber-500 bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-sm">
                +10 XP
              </div>
            </div>
          )}

          {/* Output Panel */}
          {runResult && (
            <div className="rounded-2xl bg-slate-900 p-4 text-xs font-mono text-slate-200 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Output Terminal
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  runResult.isSuccessful ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                }`}>
                  {runResult.status}
                </span>
              </div>
              {runResult.stdout && (
                <div>
                  <div className="text-slate-400 text-[11px] mb-1">Standard Output:</div>
                  <pre className="text-emerald-300 whitespace-pre-wrap">{runResult.stdout}</pre>
                </div>
              )}
              {runResult.stderr && (
                <div>
                  <div className="text-rose-400 text-[11px] mb-1">Error Details:</div>
                  <pre className="text-rose-300 whitespace-pre-wrap">{runResult.stderr}</pre>
                </div>
              )}
              {runResult.friendlyErrorHint && (
                <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-700/50 text-amber-300 text-xs">
                  💡 {runResult.friendlyErrorHint}
                </div>
              )}
              {runResult.isSuccessful && !runResult.isFirstSuccess && (
                <div className="text-slate-400 text-[11px] italic pt-1">
                  ✓ Program executed cleanly. You already earned XP for this topic.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── 5. Next Topic Button ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft">
          {/* XP popup shown briefly before navigating */}
          {nextXpPopup && (
            <div className={`mb-5 p-4 rounded-2xl flex items-center justify-between ${
              nextXpPopup.xpAwarded > 0
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
                : 'bg-slate-50 border border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                {nextXpPopup.xpAwarded > 0 ? (
                  <>
                    <PipOwl size={44} mood="celebrating" />
                    <div>
                      <p className="font-extrabold text-sm text-indigo-900">🎓 Topic Completed!</p>
                      <p className="text-xs text-indigo-700">You earned <strong>+10 XP</strong> for finishing this topic.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    <div>
                      <p className="font-bold text-sm text-slate-800">Already completed ✓</p>
                      <p className="text-xs text-slate-500">Moving to the next topic…</p>
                    </div>
                  </>
                )}
              </div>
              {nextXpPopup.xpAwarded > 0 && (
                <div className="text-xl font-extrabold text-indigo-600 bg-white px-4 py-2 rounded-xl border border-indigo-200 shadow-sm">
                  +10 XP
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                {topic.alreadyCompleted
                  ? '✓ You have already completed this topic'
                  : 'Done reading? Earn 10 XP and move on!'}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {topic.nextTopicId
                  ? 'Next topic is ready for you'
                  : 'This is the last topic in the roadmap — great work!'}
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={nextLoading}
              className={`flex items-center gap-2 px-6 py-3 font-bold rounded-2xl text-sm transition-all shadow-sm disabled:opacity-50 ${
                topic.alreadyCompleted
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white shadow-brand-200'
              }`}
            >
              {nextLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  {topic.alreadyCompleted ? 'Next Topic' : 'Complete & Next →'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
