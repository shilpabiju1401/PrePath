import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import BadgeCard from '../components/BadgeCard';
import ProgressBar from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, Star, Flame, Award, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [badgesRes, progressRes] = await Promise.all([
          api.get('/badges/me'),
          api.get('/progress/me'),
        ]);
        setBadges(badgesRes.data.allBadges || []);
        setEarnedBadges(badgesRes.data.earnedBadges || []);
        setProgress(progressRes.data);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate user level from XP: every 500 XP = 1 level
  const xp = user?.xp ?? 0;
  const level = Math.floor(xp / 500) + 1;
  const xpInLevel = xp % 500;
  const xpPercent = (xpInLevel / 500) * 100;

  // Check if a badge was earned
  const isEarned = (badge) => earnedBadges.some(eb => eb.badgeId === badge.id);
  const getEarnedAt = (badge) => earnedBadges.find(eb => eb.badgeId === badge.id)?.earnedAt;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 flex items-start gap-5"
        >
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-3xl font-extrabold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-extrabold text-slate-900">{user?.name}</h1>
            <p className="text-slate-500 text-sm">{user?.email}</p>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-700">
                <Flame className="w-4 h-4 text-orange-500" /> {user?.streakCount ?? 0} day streak
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                <Star className="w-4 h-4 text-yellow-500" /> Level {level}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                <Award className="w-4 h-4 text-purple-500" /> {earnedBadges.length} badge{earnedBadges.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* XP level progress */}
            <div className="mt-4">
              <ProgressBar
                value={xpPercent}
                label={`Level ${level} · ${xp} XP total`}
                color="bg-brand-500"
                height="h-2.5"
                showValue={false}
              />
              <p className="text-xs text-slate-400 mt-1">{xpInLevel} / 500 XP to Level {level + 1}</p>
            </div>
          </div>
        </motion.div>

        {/* Progress summary */}
        {progress && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-6 space-y-4">
            <h2 className="font-bold text-slate-900 text-base">Learning Progress</h2>
            <ProgressBar value={progress.aptitudeProgress ?? 0}  label="Quantitative Aptitude" color="bg-aptitude"  />
            <ProgressBar value={progress.reasoningProgress ?? 0} label="Logical Reasoning"     color="bg-reasoning" />
            <ProgressBar value={progress.verbalProgress ?? 0}    label="Verbal Ability"        color="bg-verbal"    />
            <ProgressBar value={progress.codingProgress ?? 0}    label="Coding & DSA"          color="bg-coding"    />
          </div>
        )}

        {/* Badges */}
        <div>
          <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-600" /> Achievements
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earned={isEarned(badge)}
                  earnedAt={getEarnedAt(badge)}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
