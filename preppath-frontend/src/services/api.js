import axios from 'axios';

// Robust API URL normalization:
// Handles missing '/api', trailing slashes, and http->https redirects
let rawBase = (import.meta.env.VITE_API_BASE_URL || '/api').trim();

// Strip trailing slash
if (rawBase.endsWith('/')) {
  rawBase = rawBase.slice(0, -1);
}

// Upgrade http:// to https:// for production to prevent 301 redirects changing POST to GET (405 error)
if (rawBase.startsWith('http://') && !rawBase.includes('localhost') && !rawBase.includes('127.0.0.1')) {
  rawBase = rawBase.replace('http://', 'https://');
}

// If user provided backend domain without /api (e.g. https://xyz.onrender.com), auto-append /api
if (rawBase !== '/api' && !rawBase.endsWith('/api')) {
  rawBase = `${rawBase}/api`;
}

if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && rawBase === '/api') {
  console.warn('⚠️ VITE_API_BASE_URL is not set in Vercel! Requests are hitting Vercel static server instead of your Render backend.');
}

const API_BASE_URL = rawBase;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // 60s — Render free tier can take up to 50s to cold-start
});

// ── Request interceptor: attach JWT token to every request ──
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('preppath_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle auth expiry globally ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // JWT expired — clear token and redirect to login
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('preppath_token');
        // Redirect to login page (hard redirect clears React state too)
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
