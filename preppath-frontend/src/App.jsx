import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import QLRPage from './pages/QLRPage';
import TopicLearningPage from './pages/TopicLearningPage';
import CodingPage from './pages/CodingPage';
import CodingTopicLearnPage from './pages/CodingTopicLearnPage';
import CodingTopicProblemsPage from './pages/CodingTopicProblemsPage';
import CodingProblemViewPage from './pages/CodingProblemViewPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AIBuddyPage from './pages/AIBuddyPage';
import PlacementPage from './pages/PlacementPage';

// Quiz feature
import QuizScreen from './features/quiz/QuizScreen';

// Icons for QLR categories
import { Brain, Lightbulb, BookOpen } from 'lucide-react';

/**
 * App.jsx — the top-level component.
 *
 * Structure:
 * 1. AuthProvider wraps everything (provides login state to all pages).
 * 2. BrowserRouter handles URL routing.
 * 3. Routes maps URLs to page components.
 * 4. ProtectedRoute ensures authenticated pages redirect unauthenticated users.
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public Routes (no login required) ── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Protected Routes (login required) ── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />

          {/* QLR Categories — each uses the same QLRPage component with different props */}
          <Route path="/qlr" element={
            <ProtectedRoute>
              <QLRPage
                categoryId={1}
                title="Quantitative Aptitude"
                description="Percentages, Ratios, Profit & Loss, Time & Work, and more."
                icon={Brain}
                accentColor="aptitude"
                iconBg="bg-aptitude-light"
                progressColor="bg-aptitude"
              />
            </ProtectedRoute>
          } />
          <Route path="/reasoning" element={
            <ProtectedRoute>
              <QLRPage
                categoryId={2}
                title="Logical Reasoning"
                description="Number Series, Puzzles, Blood Relations, Seating Arrangements…"
                icon={Lightbulb}
                accentColor="reasoning"
                iconBg="bg-reasoning-light"
                progressColor="bg-reasoning"
              />
            </ProtectedRoute>
          } />
          <Route path="/verbal" element={
            <ProtectedRoute>
              <QLRPage
                categoryId={3}
                title="Verbal Ability"
                description="Grammar, Vocabulary, Reading Comprehension, Para Jumbles…"
                icon={BookOpen}
                accentColor="verbal"
                iconBg="bg-verbal-light"
                progressColor="bg-verbal"
              />
            </ProtectedRoute>
          } />

          {/* Topic learning page — /topic/:topicId */}
          <Route path="/topic/:topicId" element={
            <ProtectedRoute><TopicLearningPage /></ProtectedRoute>
          } />

          {/* Quiz page — /quiz/:topicId/:levelType (e.g. /quiz/1/easy) */}
          <Route path="/quiz/:topicId/:levelType" element={
            <ProtectedRoute><QuizScreen /></ProtectedRoute>
          } />

          {/* Coding */}
          <Route path="/coding" element={
            <ProtectedRoute><CodingPage /></ProtectedRoute>
          } />
          <Route path="/coding/topic/:topicId" element={
            <ProtectedRoute><CodingTopicLearnPage /></ProtectedRoute>
          } />
          <Route path="/coding/topic/:topicId/problems" element={
            <ProtectedRoute><CodingTopicProblemsPage /></ProtectedRoute>
          } />
          <Route path="/coding/problem/:problemId" element={
            <ProtectedRoute><CodingProblemViewPage /></ProtectedRoute>
          } />

          {/* Placement Practice */}
          <Route path="/placement" element={
            <ProtectedRoute><PlacementPage /></ProtectedRoute>
          } />

          {/* Leaderboard */}
          <Route path="/leaderboard" element={
            <ProtectedRoute><LeaderboardPage /></ProtectedRoute>
          } />

          {/* AI Buddy */}
          <Route path="/ai-buddy" element={
            <ProtectedRoute><AIBuddyPage /></ProtectedRoute>
          } />

          {/* Profile */}
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          {/* Catch-all — redirect unknown URLs to home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
