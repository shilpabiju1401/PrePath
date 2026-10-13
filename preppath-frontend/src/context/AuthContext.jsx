import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Create a context to share auth state across the whole app
const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app and makes the user's
 * login state available to any component via useAuth().
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Logged-in user object (or null)
  const [loading, setLoading] = useState(true); // True while checking if already logged in

  // On app start, check if we have a saved token and fetch the user's profile
  useEffect(() => {
    const token = localStorage.getItem('preppath_token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch the logged-in user's profile from the backend
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
    } catch (err) {
      // Token is invalid, expired, or user no longer exists — clear and log out cleanly
      localStorage.removeItem('preppath_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Called after a successful login — save token and load user
  const login = useCallback(async (token) => {
    localStorage.setItem('preppath_token', token);
    await fetchCurrentUser();
  }, []);

  // Called when the user logs out — clear everything
  const logout = useCallback(() => {
    localStorage.removeItem('preppath_token');
    setUser(null);
  }, []);

  // Refresh user data from backend (e.g., after earning XP)
  const refreshUser = useCallback(async () => {
    await fetchCurrentUser();
  }, []);

  const value = { user, loading, login, logout, refreshUser, isAdmin: user?.role === 'ADMIN' };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook — any component can call useAuth() to get the user and auth functions
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
