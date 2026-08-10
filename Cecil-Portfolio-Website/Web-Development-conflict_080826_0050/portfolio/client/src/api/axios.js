import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the admin key (if logged in) to every request
api.interceptors.request.use((config) => {
  const key = localStorage.getItem('portfolio_admin_key');
  if (key) config.headers['x-admin-key'] = key;
  return config;
});

export default api;
