import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Brain, Lightbulb, BookOpen, Code2,
  ClipboardList, Trophy, Bot, User, LogOut, ChevronLeft,
  ChevronRight, GraduationCap, Flame
} from 'lucide-react';

// Navigation items — each links to a page in the app
const NAV_ITEMS = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard',   color: 'text-brand-600' },
  { to: '/qlr',         icon: Brain,           label: 'Aptitude',    color: 'text-aptitude' },
  { to: '/reasoning',   icon: Lightbulb,       label: 'Reasoning',   color: 'text-reasoning' },
  { to: '/verbal',      icon: BookOpen,        label: 'Verbal',      color: 'text-verbal' },
  { to: '/coding',      icon: Code2,           label: 'Coding',      color: 'text-coding' },
  { to: '/placement',   icon: ClipboardList,   label: 'Placement',   color: 'text-orange-500' },
  { to: '/leaderboard', icon: Trophy,          label: 'Leaderboard', color: 'text-yellow-500' },
  { to: '/ai-buddy',    icon: Bot,             label: 'AI Buddy',    color: 'text-pink-500' },
  { to: '/profile',     icon: User,            label: 'Profile',     color: 'text-slate-500' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false); // Toggle between wide and icon-only sidebar

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden md:flex flex-col h-screen bg-white border-r border-slate-200/80 shadow-soft fixed left-0 top-0 z-30 overflow-hidden"
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100 min-h-[72px]">
        <div className="flex-shrink-0 w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-extrabold text-slate-900 text-lg tracking-tight whitespace-nowrap"
            >
              PrepPath
            </motion.span>
          )}
        </AnimatePresence>

        {/* Collapse toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group
              ${isActive
                ? 'bg-brand-50 text-brand-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-brand-600' : color} group-hover:scale-110 transition-transform`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info + Logout at the bottom */}
      {user && (
        <div className="border-t border-slate-100 p-3 space-y-2">
          {/* XP / Streak row */}
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-amber-50 border border-amber-100">
              <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
              <span className="text-xs font-bold text-orange-700">{user.streakCount ?? 0} day streak</span>
              <span className="ml-auto text-xs font-semibold text-amber-700">{user.xp ?? 0} XP</span>
            </div>
          )}

          {/* User avatar + name */}
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
              {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <div className="text-sm font-bold text-slate-800 truncate">{user.name}</div>
                  <div className="text-xs text-slate-500 truncate">{user.email}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              title="Logout"
              className={`p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors ${collapsed ? 'mx-auto' : 'ml-auto'}`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
