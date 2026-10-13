import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { GraduationCap, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.name.trim() || form.name.length < 2) return 'Name must be at least 2 characters.';
    if (!form.email.includes('@')) return 'Please enter a valid email.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null; // All good!
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    setError('');

    try {
      // Register → then auto-login with the returned token
      const res = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      await login(res.data.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error details:', err);
      const msg = err.response?.data?.message 
        || (err.response?.status ? `Error ${err.response.status}: ${err.response.statusText}` : null)
        || err.message 
        || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const pwStrength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-soft border border-slate-200/80 p-8 md:p-10">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-slate-900 text-xl">PrepPath</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Create your account 🚀</h1>
          <p className="text-slate-500 text-sm mb-8">Start your placement preparation journey today — it's free!</p>

          {/* Error */}
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
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
              />
            </div>

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
                  placeholder="At least 6 characters"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strengthColors[pwStrength]}`} style={{ width: `${(pwStrength / 3) * 100}%` }} />
                  </div>
                  <span className={`text-xs font-semibold ${pwStrength === 1 ? 'text-rose-600' : pwStrength === 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {strengthLabels[pwStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                />
                {form.confirmPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {form.password === form.confirmPassword
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      : <AlertCircle className="w-5 h-5 text-rose-400" />
                    }
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-base"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account…</>
              ) : (
                <>Create Account <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700 transition-colors">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
