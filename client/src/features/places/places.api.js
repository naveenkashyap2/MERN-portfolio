import { api } from '../../lib/axios.js';

export const placesApi = {
  search: (params) => api.get('/places/search', { params }).then((r) => r.data.data),
  nearby: (params) => api.get('/places/nearby', { params }).then((r) => r.data.data),
  get: (id) => api.get(`/places/${id}`).then((r) => r.data.data.place),
  temples: (params) => api.get('/places/temples', { params }).then((r) => r.data.data),
  gurudwaras: (params) => api.get('/places/gurudwaras', { params }).then((r) => r.data.data),
  historical: (params) => api.get('/places/historical', { params }).then((r) => r.data.data),
  nature: (params) => api.get('/places/nature', { params }).then((r) => r.data.data),
  recommended: () => api.get('/places/recommended').then((r) => r.data.data),
};
