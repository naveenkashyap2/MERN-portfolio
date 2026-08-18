import { api } from '../../lib/axios.js';

export const aiApi = {
  generate: (body) => api.post('/ai/trip/generate', body).then((r) => r.data.data),
  regenerate: (tripId) => api.post('/ai/trip/regenerate', { tripId }).then((r) => r.data.data),
  optimize: (tripId) => api.post('/ai/trip/optimize', { tripId }).then((r) => r.data.data),
  replan: (tripId, reason) => api.post('/ai/trip/replan', { tripId, reason }).then((r) => r.data.data),
  budget: (tripId, budget) => api.post('/ai/trip/budget-optimize', { tripId, budget }).then((r) => r.data.data),
  route: (tripId) => api.post('/ai/trip/route-optimize', { tripId }).then((r) => r.data.data),
  suggest: (body) => api.post('/ai/trip/suggest', body).then((r) => r.data.data),
  chat: (body) => api.post('/assistant/chat', body).then((r) => r.data.data),
  conversations: () => api.get('/assistant/conversations').then((r) => r.data.data),
  conversation: (id) => api.get(`/assistant/conversations/${id}`).then((r) => r.data.data),
  createConversation: (body) => api.post('/assistant/conversations', body).then((r) => r.data.data),
  deleteConversation: (id) => api.delete(`/assistant/conversations/${id}`),
};
