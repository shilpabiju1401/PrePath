import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { GraduationCap, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to redirect after login (defaults to dashboard)
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Detect if user was redirected here because their session expired
  const sessionExpired = location.state?.sessionExpired;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // POST to /api/auth/login
      const res = await api.post('/auth/login', form);
      const { token } = res.data;

      // Store the JWT and fetch the user profile
      await login(token);

      // Redirect to where they were going
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.response?.data?.message 
        || (err.response?.status ? `Error ${err.response.status}: ${err.response.statusText}` : null)
        || err.message 
        || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-soft border border-slate-200/80 p-8 md:p-10">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-slate-900 text-xl">PrepPath</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back! 👋</h1>
          <p className="text-slate-500 text-sm mb-8">Log in to continue your placement journey.</p>

          {/* Session expired / DB reset notice */}
          {sessionExpired && (
            <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 font-medium">
                Your session has expired. Please log in again.
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-800 font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Logging in…</>
              ) : (
                <>Log in <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          {/* Switch to register */}
          <p className="mt-6 text-center text-sm text-slate-500">
            New to PrepPath?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">
              Create a free account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
