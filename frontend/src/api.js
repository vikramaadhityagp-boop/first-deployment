import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';  // Vercel routes /api/* to backend

const api = axios.create({ baseURL });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
