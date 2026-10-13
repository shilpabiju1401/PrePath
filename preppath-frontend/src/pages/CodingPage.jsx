import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import api from '../services/api';
import { Code2, ChevronRight, Lock, CheckCircle2, Sparkles } from 'lucide-react';

export default function CodingRoadmapPage() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await api.get('/coding/levels');
        setLevels(res.data);
      } catch (err) {
        console.error('Failed to load coding levels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  const levelBadges = {
    1: { bg: 'bg-emerald-50/70', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'Beginner' },
    2: { bg: 'bg-blue-50/70',    border: 'border-blue-200',    text: 'text-blue-700',    badge: 'Core DSA' },
    3: { bg: 'bg-purple-50/70',  border: 'border-purple-200',  text: 'text-purple-700',  badge: 'Intermediate' },
    4: { bg: 'bg-amber-50/70',   border: 'border-amber-200',   text: 'text-amber-700',   badge: 'Advanced' },
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/10 via-brand-500/10 to-purple-500/10 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Code2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Coding & DSA Learning Roadmap
            </h1>
          </div>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
            Master programming step by step. Complete all topics in a level to unlock the next level, earning +10 XP for each topic along the way!
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-44 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {levels.map((lvl) => {
              const theme = levelBadges[lvl.levelNumber] || levelBadges[1];
              const isUnlocked = lvl.isUnlocked;
              const isCompleted = lvl.isCompleted;

              return (
                <div
                  key={lvl.levelNumber}
                  className={`rounded-3xl border p-6 sm:p-8 space-y-5 shadow-soft transition-all relative ${
                    isUnlocked ? `${theme.bg} ${theme.border}` : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                          isUnlocked 
                            ? `bg-white border-current ${theme.text}` 
                            : 'bg-slate-200 border-slate-300 text-slate-600'
                        }`}>
                          {theme.badge}
                        </span>
                        
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
                          </span>
                        )}

                        {!isUnlocked && (
                          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">
                            <Lock className="w-3.5 h-3.5" /> Locked
                          </span>
                        )}

                        <h2 className="text-xl font-extrabold text-slate-900">{lvl.title}</h2>
                      </div>
                      <p className="text-xs text-slate-600">{lvl.description}</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-bold text-slate-700 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                        {lvl.completedCount} / {lvl.topicCount} Topics Done
                      </span>
                    </div>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-brand-500'}`}
                      style={{ width: `${lvl.topicCount > 0 ? (lvl.completedCount / lvl.topicCount) * 100 : 0}%` }}
                    />
                  </div>

                  {/* Locked Banner if not unlocked */}
                  {!isUnlocked ? (
                    <div className="p-6 rounded-2xl bg-white/80 border border-slate-200/90 text-center space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-800">
                        Level {lvl.levelNumber} is Locked
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Complete all topics in <strong>Level {lvl.levelNumber - 1}</strong> first to unlock this section!
                      </p>
                    </div>
                  ) : (
                    /* Topics Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {lvl.topics?.map((topic) => (
                        <button
                          key={topic.id}
                          onClick={() => navigate(`/coding/topic/${topic.id}`)}
                          className="bg-white rounded-2xl p-4 text-left border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all flex items-center justify-between group"
                        >
                          <div className="space-y-1 pr-2">
                            <div className="font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors flex items-center gap-2">
                              <span>{topic.name}</span>
                              {topic.completed && (
                                <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                  ✓ Done
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{topic.summary}</p>
                          </div>
                          <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-brand-50 flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors flex-shrink-0">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
