import api from '../api/axios.js';

export const certificationService = {
  getAll: () => api.get('/certifications').then((r) => r.data),
  create: (data) => api.post('/certifications', data).then((r) => r.data),
  update: (id, data) => api.put(`/certifications/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/certifications/${id}`).then((r) => r.data),
};
