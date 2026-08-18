import { api } from '../../lib/axios.js';

export const tripsApi = {
  list: (params) => api.get('/trips', { params }).then((r) => r.data.data),
  get: (id) => api.get(`/trips/${id}`).then((r) => r.data.data.trip),
  create: (body) => api.post('/trips', body).then((r) => r.data.data.trip),
  update: (id, body) => api.patch(`/trips/${id}`, body).then((r) => r.data.data.trip),
  remove: (id) => api.delete(`/trips/${id}`),
  duplicate: (id) => api.post(`/trips/${id}/duplicate`).then((r) => r.data.data.trip),
  share: (id, mode) => api.post(`/trips/${id}/share`, { mode }).then((r) => r.data.data.share),
  itinerary: (id) => api.get(`/trips/${id}/itinerary`).then((r) => r.data.data),
  reorder: (id, order) => api.post(`/trips/${id}/itinerary/reorder`, { order }).then((r) => r.data.data),
  addItem: (id, body) => api.post(`/trips/${id}/itinerary`, body).then((r) => r.data.data),
  updateItem: (id, itemId, body) => api.patch(`/trips/${id}/itinerary/${itemId}`, body).then((r) => r.data.data),
  deleteItem: (id, itemId) => api.delete(`/trips/${id}/itinerary/${itemId}`),
};
