import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';
import ProgressBar from '../components/ProgressBar';
import {
  Brain, Lightbulb, BookOpen, Code2, Flame, Star, Trophy,
  ArrowRight, TrendingUp, ChevronRight, Loader2
} from 'lucide-react';
import api from '../services/api';

// --- Skeleton loader for a single stat card ---
const StatSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft animate-pulse">
    <div className="h-4 bg-slate-100 rounded-full w-2/3 mb-3" />
    <div className="h-8 bg-slate-100 rounded-full w-1/3 mb-2" />
    <div className="h-3 bg-slate-100 rounded-full w-full" />
  </div>
);

// --- A single quick-stat card ---
const StatCard = ({ icon: Icon, label, value, sub, color, bgColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
    </div>
  </motion.div>
);

// --- Category progress card ---
const CategoryCard = ({ to, icon: Icon, title, progress, color, accentBg, description }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl ${accentBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
      </div>
      <ProgressBar value={progress} color={color.replace('text-', 'bg-')} showValue={true} />
    </motion.div>
  </Link>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Fetch the user's progress summary from the backend
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress/me');
        setProgress(res.data);
      } catch (err) {
        console.error('Could not load progress:', err);
        // Use empty defaults so the UI still renders
        setProgress({ qlrProgress: 0, codingProgress: 0, aptitudeProgress: 0, reasoningProgress: 0, verbalProgress: 0 });
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchProgress();
  }, []);

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ── Welcome Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {greeting}, {user?.name?.split(' ')[0] ?? 'Student'}! 👋
            </h1>
            <p className="text-slate-500 mt-1">Keep going — your placement dream is one step closer today.</p>
          </div>
          {/* Continue CTA */}
          <Link
            to="/qlr"
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-colors text-sm whitespace-nowrap"
          >
            Continue Journey <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loadingProgress
            ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            : (
              <>
                <StatCard icon={Star}       label="Total XP"      value={user?.xp ?? 0}                      sub="experience points"     color="text-brand-600"    bgColor="bg-brand-50"   />
                <StatCard icon={Flame}      label="Streak"        value={`${user?.streakCount ?? 0}d`}       sub="days in a row"        color="text-orange-600"   bgColor="bg-orange-50"  />
                <StatCard icon={TrendingUp} label="QLR Progress" value={`${progress?.qlrProgress ?? 0}%`}         sub="across all topics"    color="text-aptitude"     bgColor="bg-aptitude-light" />
                <StatCard icon={Trophy}     label="Coding & DSA"  value={`${progress?.codingProgress ?? 0}%`} sub={`${progress?.completedCodingTopics ?? 0} topics completed`} color="text-coding-dark" bgColor="bg-coding-light" />
              </>
            )
          }
        </div>

        {/* ── Category Progress Cards ── */}
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" /> Your Learning Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryCard
              to="/qlr"
              icon={Brain}
              title="Quantitative Aptitude"
              description="Percentages, Ratios, Profit & Loss…"
              progress={progress?.aptitudeProgress ?? 0}
              color="text-aptitude"
              accentBg="bg-aptitude-light"
            />
            <CategoryCard
              to="/reasoning"
              icon={Lightbulb}
              title="Logical Reasoning"
              description="Series, Puzzles, Blood Relations…"
              progress={progress?.reasoningProgress ?? 0}
              color="text-reasoning"
              accentBg="bg-reasoning-light"
            />
            <CategoryCard
              to="/verbal"
              icon={BookOpen}
              title="Verbal Ability"
              description="Grammar, Comprehension, Vocab…"
              progress={progress?.verbalProgress ?? 0}
              color="text-verbal"
              accentBg="bg-verbal-light"
            />
            <CategoryCard
              to="/coding"
              icon={Code2}
              title="Coding & DSA"
              description="Arrays, Sorting, Trees, DP…"
              progress={progress?.codingProgress ?? 0}
              color="text-coding-dark"
              accentBg="bg-coding-light"
            />
          </div>
        </div>

        {/* ── Coming Up Next / Tips ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-brand-50 to-purple-50 rounded-2xl border border-brand-100 p-6"
        >
          <h3 className="font-bold text-brand-900 text-base mb-2">💡 Pro Tip</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            The best way to improve is daily practice. Even 20 minutes a day adds up to a 70%+ score
            in just a few weeks! Start with <strong>Quantitative Aptitude → Percentages</strong> if you're new.
          </p>
        </motion.div>

      </div>
    </AppLayout>
  );
}
