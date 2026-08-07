import api from '../api/axios.js';

export const journeyService = {
  getAll: () => api.get('/journey').then((r) => r.data),
  create: (data) => api.post('/journey', data).then((r) => r.data),
  update: (id, data) => api.put(`/journey/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/journey/${id}`).then((r) => r.data),
};
