import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, ArrowRight, Brain, Code2, Trophy,
  CheckCircle2, Star, Zap, Shield
} from 'lucide-react';
import PipOwl from '../components/mascots/PipOwl';
import BloopBlob from '../components/mascots/BloopBlob';

// Simple animated fade-in wrapper for sections
const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

// Feature card shown in the "Why PrepPath" section
const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <div className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-soft hover:shadow-md transition-shadow`}>
    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40">

      {/* ── Top Navigation ── */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 text-xl tracking-tight">PrepPath</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors px-4 py-2 rounded-xl hover:bg-brand-50">
            Log in
          </Link>
          <Link to="/register" className="text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors px-5 py-2 rounded-xl shadow-sm">
            Get Started →
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-20 text-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-sm font-semibold mb-6">
            <Zap className="w-4 h-4" />
            Your AI-Powered Placement Coach
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Crack your campus{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-500">
              placements
            </span>
            {' '}like a game!
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
            PrepPath turns boring exam prep into an exciting learning adventure. Master Aptitude,
            Reasoning, Verbal, and Coding — level by level, badge by badge.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
            >
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl border border-slate-200 shadow-soft hover:shadow-md transition-all duration-200 text-base"
            >
              I already have an account
            </Link>
          </div>
        </FadeIn>

        {/* Mascots */}
        <FadeIn delay={0.5}>
          <div className="flex items-end justify-center gap-8 mt-16">
            <PipOwl size={110} mood="celebrating" />
            <div className="text-center mb-4">
              <div className="bg-white rounded-2xl px-6 py-3 shadow-soft border border-slate-100 text-slate-700 font-semibold text-sm">
                "You've got this! Let's study together! 🎓"
              </div>
            </div>
            <BloopBlob size={100} mood="encouraging" />
          </div>
        </FadeIn>
      </section>

      {/* ── Stats Banner ── */}
      <FadeIn delay={0.1}>
        <section className="bg-white border-y border-slate-100 py-10">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: '3', label: 'QLR Categories' },
              { number: '30+', label: 'Practice Topics' },
              { number: '1000+', label: 'MCQ Questions' },
              { number: '4', label: 'DSA Levels' },
            ].map(({ number, label }) => (
              <div key={label}>
                <div className="text-3xl font-extrabold text-brand-600 mb-1">{number}</div>
                <div className="text-sm text-slate-600 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* ── Features Grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <FadeIn>
          <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-4">Why students love PrepPath</h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Everything you need to crack placements, wrapped in a fun learning experience.</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FadeIn delay={0.1}><FeatureCard icon={Brain}        color="bg-aptitude"  title="Aptitude & Reasoning" desc="Master Quantitative Aptitude, Logical Reasoning, and Verbal Ability with topic-by-topic guides and graded MCQs." /></FadeIn>
          <FadeIn delay={0.2}><FeatureCard icon={Code2}        color="bg-coding"    title="Coding Practice"      desc="Solve DSA problems in C, Java, or Python with our in-browser editor. Real code execution via Judge0." /></FadeIn>
          <FadeIn delay={0.3}><FeatureCard icon={Trophy}       color="bg-reasoning" title="Gamified Progress"    desc="Earn XP, unlock badges, maintain daily streaks, and climb the leaderboard as you learn." /></FadeIn>
          <FadeIn delay={0.1}><FeatureCard icon={CheckCircle2} color="bg-verbal"    title="Enforced Unlocking"   desc="Backend-verified level system: Easy → Medium → Hard → Challenge. No shortcuts, solid foundations." /></FadeIn>
          <FadeIn delay={0.2}><FeatureCard icon={Shield}       color="bg-brand-600" title="AI Buddy"            desc="Stuck? Ask Pip or Bloop! Your AI Buddy explains concepts, hints at solutions, and cheers you on." /></FadeIn>
          <FadeIn delay={0.3}><FeatureCard icon={Star}         color="bg-orange-500" title="Placement Tests"    desc="Full timed mock tests with mixed QLR + Coding, auto-submit, and a detailed performance report." /></FadeIn>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-white border-y border-slate-100 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12">Your learning loop</h2>
          </FadeIn>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {['📖 Learn', '🌱 Easy', '🔥 Medium', '⚡ Hard', '🏆 Challenge', '🔓 Next Topic'].map((step, i) => (
              <FadeIn key={step} delay={i * 0.1} className="flex items-center gap-4">
                <div className="bg-brand-50 border border-brand-200 rounded-2xl px-5 py-3 font-bold text-brand-700 text-sm text-center whitespace-nowrap">
                  {step}
                </div>
                {i < 5 && <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0 hidden md:block" />}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <FadeIn>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Ready to prep smarter?</h2>
          <p className="text-slate-600 mb-8 text-lg">Join students who are already on their PrepPath journey.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
          >
            Create your free account <ArrowRight className="w-5 h-5" />
          </Link>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-slate-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-slate-700">PrepPath</span>
        </div>
        <p>Your Roadmap to Placement Success · Built with ❤️ for students</p>
      </footer>

    </div>
  );
}
