import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import api from '../services/api';
import { Trophy, Medal, Crown, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Rank medals
const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [range, setRange] = useState('weekly'); // 'weekly' or 'all'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/leaderboard?range=${range}`);
        setData(res.data);
      } catch (err) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [range]);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-500" /> Leaderboard
            </h1>
            <p className="text-slate-500 text-sm mt-1">Top students ranked by XP</p>
          </div>

          {/* Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1">
            {['weekly', 'all'].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize
                  ${range === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {r === 'all' ? 'All Time' : 'This Week'}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 podium */}
        {!loading && data.length >= 3 && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
            <div className="flex items-end justify-center gap-4">
              {/* 2nd place */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                  {data[1]?.name?.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-700 text-center max-w-[70px] truncate">{data[1]?.name}</span>
                <span className="text-xs text-slate-500">{data[1]?.xp} XP</span>
                <div className="bg-slate-400 text-white rounded-t-xl w-14 h-14 flex items-center justify-center text-2xl">🥈</div>
              </div>
              {/* 1st place */}
              <div className="flex flex-col items-center gap-1 -mt-4">
                <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-white text-lg">
                  {data[0]?.name?.charAt(0)}
                </div>
                <span className="text-sm font-bold text-slate-800 text-center max-w-[80px] truncate">{data[0]?.name}</span>
                <span className="text-xs text-amber-700 font-semibold">{data[0]?.xp} XP</span>
                <div className="bg-yellow-500 text-white rounded-t-xl w-16 h-20 flex items-center justify-center text-3xl">🥇</div>
              </div>
              {/* 3rd place */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-700">
                  {data[2]?.name?.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-700 text-center max-w-[70px] truncate">{data[2]?.name}</span>
                <span className="text-xs text-slate-500">{data[2]?.xp} XP</span>
                <div className="bg-orange-400 text-white rounded-t-xl w-14 h-10 flex items-center justify-center text-2xl">🥉</div>
              </div>
            </div>
          </div>
        )}

        {/* Full ranked list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No data yet. Start practicing to appear here!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft overflow-hidden">
            {data.map((entry, idx) => {
              const isCurrentUser = entry.email === user?.email;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 transition-colors
                    ${isCurrentUser ? 'bg-brand-50' : 'hover:bg-slate-50'}`}
                >
                  {/* Rank */}
                  <div className={`w-8 text-center font-extrabold text-sm flex-shrink-0
                    ${idx === 0 ? 'text-yellow-600' : idx === 1 ? 'text-slate-500' : idx === 2 ? 'text-orange-600' : 'text-slate-400'}`}>
                    {idx < 3 ? MEDALS[idx] : `#${idx + 1}`}
                  </div>

                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                    ${isCurrentUser ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {entry.name?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <span className={`font-bold text-sm truncate block ${isCurrentUser ? 'text-brand-700' : 'text-slate-800'}`}>
                      {entry.name} {isCurrentUser && '(You)'}
                    </span>
                    <span className="text-xs text-slate-400">{entry.streakCount ?? 0} day streak 🔥</span>
                  </div>

                  {/* XP */}
                  <div className="font-extrabold text-sm text-slate-800 flex-shrink-0">{entry.xp} XP</div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
