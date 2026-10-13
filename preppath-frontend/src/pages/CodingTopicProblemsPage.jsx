import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../services/api';
import { ChevronLeft, Code2, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CodingTopicProblemsPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get(`/coding/topics/${topicId}/problems`);
        setProblems(res.data);
      } catch (err) {
        console.error('Failed to load problems:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [topicId]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate('/coding')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Roadmap
        </button>

        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Code2 className="w-7 h-7 text-amber-500" /> Practice Problems
        </h1>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No problems found for this topic yet.
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map((problem) => (
              <div
                key={problem.id}
                onClick={() => navigate(`/coding/problem/${problem.id}`)}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-bold text-amber-700 text-sm">
                    {problem.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {problem.title}
                    </h3>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-1
                      ${problem.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 group-hover:text-brand-600">
                  <span className="text-sm font-semibold">Solve</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
