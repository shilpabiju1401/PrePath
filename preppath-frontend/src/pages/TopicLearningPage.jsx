import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/AppLayout';
import LevelCard from '../components/LevelCard';
import api from '../services/api';
import { BookOpen, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';

// Skeleton for learning content
const ContentSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-slate-100 rounded-full w-1/2" />
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`h-4 bg-slate-100 rounded-full ${i === 5 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  </div>
);

/**
 * TopicLearningPage — shows learning content for a topic, then the 4 level cards.
 * Users must complete Easy → Medium → Hard → Challenge in order (enforced by backend).
 */
export default function TopicLearningPage() {
  const { topicId } = useParams(); // From the URL: /topic/:topicId
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFullContent, setShowFullContent] = useState(false);

  useEffect(() => {
    const fetchTopic = async () => {
      setLoading(true);
      try {
        // GET /api/topics/:id — returns topic + levels with lock/unlock status
        const res = await api.get(`/topics/${topicId}`);
        setTopic(res.data.topic);
        setLevels(res.data.levels || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load topic. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTopic();
  }, [topicId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-8 bg-slate-100 rounded-full w-1/3 animate-pulse" />
          <ContentSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
          <AlertCircle className="w-12 h-12 text-rose-400" />
          <p className="font-semibold text-rose-600">{error}</p>
          <button onClick={() => navigate(-1)} className="text-sm underline text-slate-500">Go back</button>
        </div>
      </AppLayout>
    );
  }

  // Truncate learning content for a "read more" UX
  const content = topic?.learningContent || '';
  const PREVIEW_LENGTH = 400;
  const isLong = content.length > PREVIEW_LENGTH;
  const displayedContent = showFullContent ? content : content.slice(0, PREVIEW_LENGTH);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Topics
        </button>

        {/* Topic header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">{topic?.name}</h1>
          <p className="text-slate-500 text-sm">{topic?.description}</p>
        </motion.div>

        {/* Learning content card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-brand-700 font-bold text-base border-b border-slate-100 pb-3">
            <BookOpen className="w-5 h-5" />
            Concept & Examples
          </div>

          {/* Render learning content — it may contain simple newlines */}
          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
            {displayedContent}{isLong && !showFullContent ? '…' : ''}
          </div>

          {isLong && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="text-brand-600 font-semibold text-sm hover:underline"
            >
              {showFullContent ? 'Show less ↑' : 'Read full content ↓'}
            </button>
          )}
        </motion.div>

        {/* Level cards — Easy / Medium / Hard / Challenge */}
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">Quiz Levels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {levels.map((level, idx) => (
              <motion.div
                key={level.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <LevelCard
                  level={level}
                  onStart={() => navigate(`/quiz/${topicId}/${level.type.toLowerCase()}`)}
                />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
