import api from '../api/axios.js';

export const contactService = {
  send: (data) => api.post('/contact', data).then((r) => r.data),
  getAll: () => api.get('/contact').then((r) => r.data),
  markRead: (id) => api.put(`/contact/${id}/read`).then((r) => r.data),
  remove: (id) => api.delete(`/contact/${id}`).then((r) => r.data),
};
