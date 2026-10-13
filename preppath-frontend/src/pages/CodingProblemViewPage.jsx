import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import AppLayout from '../components/AppLayout';
import api from '../services/api';
import confetti from 'canvas-confetti';
import { Play, Send, ChevronLeft, CheckCircle2, XCircle, AlertTriangle, Code2, Clock, Sparkles } from 'lucide-react';

export default function CodingProblemViewPage() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await api.get(`/coding/problems/${problemId}`);
        setProblem(res.data);
        setCode(''); // blank editor — user writes their own solution
        setCustomInput(res.data.sampleInput || '');
      } catch (err) {
        console.error('Failed to load problem:', err);
      }
    };
    fetchProblem();
  }, [problemId]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(''); // blank on language switch
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput(null);
    setSubmissionResult(null);
    try {
      const res = await api.post('/coding/run', {
        problemId: Number(problemId),
        language,
        code,
        customInput
      });
      setOutput(res.data);
    } catch (err) {
      setOutput({ stderr: err.response?.data?.message || err.message });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmissionResult(null);
    setOutput(null);
    try {
      const res = await api.post('/coding/submit', {
        problemId: Number(problemId),
        language,
        code
      });
      setSubmissionResult(res.data);
      if (res.data.status === 'ACCEPTED') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      setSubmissionResult({ status: 'ERROR', error: err.response?.data?.message || err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
          Loading problem statement...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)] max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/coding')}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                {problem.title}
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold
                  ${problem.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                  {problem.difficulty}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="python">Python 3</option>
              <option value="java">Java 17</option>
              <option value="c">C (GCC)</option>
            </select>

            {/* Run Code */}
            <button
              onClick={handleRun}
              disabled={running || submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all disabled:opacity-50"
            >
              <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              {running ? 'Running...' : 'Run Code'}
            </button>

            {/* Submit Code */}
            <button
              onClick={handleSubmit}
              disabled={running || submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50 shadow-sm"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>

        {/* Split Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 mt-4 overflow-hidden">
          {/* Left Panel: Problem Details & Tabs */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 overflow-y-auto flex flex-col space-y-4">
            <div className="flex gap-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setActiveTab('description')}
                className={`text-sm font-bold pb-1 px-2 border-b-2 transition-all ${activeTab === 'description' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400'}`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('hints')}
                className={`text-sm font-bold pb-1 px-2 border-b-2 transition-all ${activeTab === 'hints' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400'}`}
              >
                Hints
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <div className="whitespace-pre-wrap">{problem.statement}</div>

                {problem.constraints && (
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wide">Constraints</h3>
                    <pre className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono">
                      {problem.constraints}
                    </pre>
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wide">Sample Input</h3>
                  <pre className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs font-mono">
                    {problem.sampleInput}
                  </pre>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wide">Sample Output</h3>
                  <pre className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs font-mono">
                    {problem.sampleOutput}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'hints' && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-sm text-amber-900">
                <p className="font-bold mb-1">💡 Hint:</p>
                <p>{problem.hints || 'Break the problem down into smaller steps.'}</p>
              </div>
            )}
          </div>

          {/* Right Panel: Editor & Output */}
          <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden">
            {/* Monaco Editor Container */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft flex flex-col">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-4 h-4 text-brand-600" />
                Code Editor ({language})
              </div>
              <div className="flex-1 min-h-[300px]">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  theme="vs-light"
                  onChange={(val) => setCode(val || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </div>
            </div>

            {/* Bottom Console / Output Tab */}
            <div className="h-44 bg-slate-900 rounded-2xl p-4 text-slate-200 text-xs font-mono overflow-y-auto flex flex-col">
              <div className="font-bold text-slate-400 mb-2 border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>Output Console</span>
                {(running || submitting) ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                    <div className="w-2.5 h-2.5 border-2 border-slate-400/40 border-t-slate-300 rounded-full animate-spin" />
                    {submitting ? 'Submitting…' : 'Running…'}
                  </span>
                ) : submissionResult ? (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${submissionResult.status === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                    {submissionResult.status}
                  </span>
                ) : output ? (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${output.status === 'ACCEPTED' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                    {output.status}
                  </span>
                ) : null}
              </div>

              {/* Execution / Submission Details */}
              {submissionResult ? (
                <div className="space-y-1">
                  <div className={`font-bold ${submissionResult.status === 'ACCEPTED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Status: {submissionResult.status}
                  </div>
                  <div>Test Cases Passed: {submissionResult.passedCount} / {submissionResult.totalCount}</div>
                  {submissionResult.xpEarned > 0 && (
                    <div className="text-amber-300 font-bold">🎉 +{submissionResult.xpEarned} XP Awarded!</div>
                  )}
                  {submissionResult.error && (
                    <div className="text-rose-300 mt-2 whitespace-pre-wrap">{submissionResult.error}</div>
                  )}
                </div>
              ) : output ? (
                <div className="space-y-1">
                  {output.stdout ? (
                    <div className="text-emerald-300 whitespace-pre-wrap">{output.stdout}</div>
                  ) : output.status === 'ACCEPTED' ? (
                    <div className="text-slate-500 italic">✓ Program ran successfully (no output printed).</div>
                  ) : null}
                  {output.stderr && (
                    <div className="text-rose-400 whitespace-pre-wrap">{output.stderr}</div>
                  )}
                  {output.compileOutput && (
                    <div className="text-rose-400 whitespace-pre-wrap">{output.compileOutput}</div>
                  )}
                  {output.time && (
                    <div className="text-slate-500 text-[10px]">Execution time: {output.time}s</div>
                  )}
                </div>
              ) : (
                <div className="text-slate-600 italic">Click "Run Code" or "Submit" to see execution results.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
