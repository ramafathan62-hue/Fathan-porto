// Centralized API URL — set VITE_API_URL in .env or Vercel environment variables
// Development fallback: http://localhost:3001
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
