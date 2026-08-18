import { api } from '../../lib/axios.js';

export const expensesApi = {
  list: (tripId, params) => api.get(`/trips/${tripId}/expenses`, { params }).then((r) => r.data.data),
  add: (tripId, body) => api.post(`/trips/${tripId}/expenses`, body).then((r) => r.data.data.expense),
  update: (tripId, id, body) => api.patch(`/trips/${tripId}/expenses/${id}`, body).then((r) => r.data.data.expense),
  remove: (tripId, id) => api.delete(`/trips/${tripId}/expenses/${id}`),
  summary: (tripId) => api.get(`/trips/${tripId}/expenses/summary`).then((r) => r.data.data),
};
