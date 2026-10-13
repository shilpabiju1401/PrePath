import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import TopicCard from '../components/TopicCard';
import ProgressBar from '../components/ProgressBar';
import api from '../services/api';
import { Brain, ChevronRight, Loader2 } from 'lucide-react';

// Loading skeleton for topic cards
const TopicSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-100 rounded-full w-2/3" />
        <div className="h-3 bg-slate-100 rounded-full w-full" />
      </div>
    </div>
  </div>
);

/**
 * QLRCategoryPage — shows one specific QLR category (e.g. Quantitative Aptitude).
 * Receives categoryId via route param or uses the 'qlr' path to show all three.
 *
 * This page is shared by /qlr, /reasoning, /verbal — each renders topics for
 * their respective category.
 */
export default function QLRPage({ categoryId, title, description, icon: Icon = Brain, accentColor = 'aptitude', iconBg = 'bg-aptitude-light', progressColor = 'bg-aptitude' }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        // GET /api/topics?categoryId=1 — backend returns topics with lock status for this user
        const res = await api.get(`/topics?categoryId=${categoryId}`);
        setTopics(res.data);

        // Calculate progress: % of topics completed
        const completed = res.data.filter(t => t.status === 'COMPLETED').length;
        setProgress(res.data.length > 0 ? Math.round((completed / res.data.length) * 100) : 0);
      } catch (err) {
        console.error('Failed to load topics:', err);
        setTopics([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [categoryId]);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4"
        >
          <div className={`w-14 h-14 ${iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-7 h-7 text-${accentColor}`} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
            <p className="text-slate-500 text-sm mt-1">{description}</p>
            <div className="mt-3">
              <ProgressBar value={progress} color={progressColor} label={`${progress}% complete`} showValue={false} height="h-2" />
            </div>
          </div>
        </motion.div>

        {/* Topics list */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-700 mb-2">Topics</h2>

          {loading
            ? Array.from({ length: 5 }).map((_, i) => <TopicSkeleton key={i} />)
            : topics.length === 0
              ? (
                <div className="text-center py-16 text-slate-400">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No topics found for this category yet.</p>
                </div>
              )
              : topics.map((topic, idx) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                >
                  <TopicCard
                    topic={topic}
                    accentColor={accentColor}
                    onClick={() => window.location.assign(`/topic/${topic.id}`)}
                  />
                </motion.div>
              ))
          }
        </div>
      </div>
    </AppLayout>
  );
}
