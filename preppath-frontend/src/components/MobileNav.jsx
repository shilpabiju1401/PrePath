import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Brain, Lightbulb, BookOpen, Code2,
  ClipboardList, Trophy, Bot, User, LogOut, GraduationCap,
  Menu, X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/qlr',         icon: Brain,           label: 'Aptitude'  },
  { to: '/reasoning',   icon: Lightbulb,       label: 'Reasoning' },
  { to: '/verbal',      icon: BookOpen,        label: 'Verbal'    },
  { to: '/coding',      icon: Code2,           label: 'Coding'    },
  { to: '/placement',   icon: ClipboardList,   label: 'Placement' },
  { to: '/leaderboard', icon: Trophy,          label: 'Leaders'   },
  { to: '/ai-buddy',    icon: Bot,             label: 'AI Buddy'  },
  { to: '/profile',     icon: User,            label: 'Profile'   },
];

/**
 * MobileNav: shows a top bar with hamburger menu on small screens.
 * On desktop, this is hidden — the sidebar takes over.
 */
export default function MobileNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <>
      {/* Top bar for mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 text-base">PrepPath</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl flex flex-col"
            >
              <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
                <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-extrabold text-slate-900 text-lg">PrepPath</span>
                <button onClick={() => setIsOpen(false)} className="ml-auto text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
                      ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </NavLink>
                ))}
              </nav>

              {user && (
                <div className="border-t border-slate-100 p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                      {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.xp ?? 0} XP</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom nav tabs (always visible on mobile as quick access) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-2 py-1 flex justify-around">
        {NAV_ITEMS.slice(0, 5).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
              ${isActive ? 'text-brand-600' : 'text-slate-500'}`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
