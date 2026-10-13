import axios from 'axios';

// Base API configuration pointing to Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
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
