import api from '../api/axios.js';

export const contentService = {
  getSkills: () => api.get('/skills').then((r) => r.data),
  getJourney: () => api.get('/journey').then((r) => r.data),
  adminLogin: (key) => api.post('/admin/login', { key }).then((r) => r.data),
};
