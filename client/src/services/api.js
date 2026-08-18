import { api } from '../lib/axios';

const unwrap = (r) => r.data.data;

export const authApi = {
  me: () => api.get('/auth/me').then(unwrap),
  login: (email, password) => api.post('/auth/login', { email, password }).then(unwrap),
  register: (payload) => api.post('/auth/register', payload).then(unwrap),
  google: (credential) => api.post('/auth/google', { credential }).then(unwrap),
  logout: () => api.post('/auth/logout'),
  logoutAll: () => api.post('/auth/logout-all'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(unwrap),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }).then(unwrap),
  changePassword: (currentPassword, newPassword) => api.post('/auth/change-password', { currentPassword, newPassword }).then(unwrap),
};

export const userApi = {
  getMe: () => api.get('/users/me').then(unwrap),
  updateMe: (payload) => api.patch('/users/me', payload).then(unwrap),
  deleteMe: () => api.delete('/users/me').then(unwrap),
  getPreferences: () => api.get('/users/me/preferences').then(unwrap),
  updatePreferences: (preferences) => api.patch('/users/me/preferences', preferences).then(unwrap),
  updateAvatar: (avatar) => api.patch('/users/me/avatar', { avatar }).then(unwrap),
};

export const tripsApi = {
  list: (status) => api.get('/trips', { params: { status } }).then(unwrap),
  get: (id) => api.get(`/trips/${id}`).then(unwrap),
  create: (payload) => api.post('/trips', payload).then(unwrap),
  update: (id, payload) => api.patch(`/trips/${id}`, payload).then(unwrap),
  remove: (id) => api.delete(`/trips/${id}`).then(unwrap),
  duplicate: (id) => api.post(`/trips/${id}/duplicate`).then(unwrap),
  share: (id) => api.post(`/trips/${id}/share`).then(unwrap),
};

export const itineraryApi = {
  get: (tripId) => api.get(`/trips/${tripId}/itinerary`).then(unwrap),
  add: (tripId, payload) => api.post(`/trips/${tripId}/itinerary`, payload).then(unwrap),
  update: (tripId, itemId, payload) => api.patch(`/trips/${tripId}/itinerary/${itemId}`, payload).then(unwrap),
  remove: (tripId, itemId) => api.delete(`/trips/${tripId}/itinerary/${itemId}`).then(unwrap),
  reorder: (tripId, payload) => api.post(`/trips/${tripId}/itinerary/reorder`, payload).then(unwrap),
};

export const aiApi = {
  generate: (payload) => api.post('/ai/trip/generate', payload).then(unwrap),
  naturalLanguage: (text) => api.post('/ai/trip/natural-language', { text }).then(unwrap),
  optimize: (tripId) => api.post('/ai/trip/optimize', { tripId }).then(unwrap),
  replan: (tripId, reason) => api.post('/ai/trip/replan', { tripId, reason }).then(unwrap),
  budgetOptimize: (tripId, targetBudget) => api.post('/ai/trip/budget-optimize', { tripId, targetBudget }).then(unwrap),
  routeOptimize: (tripId) => api.post('/ai/trip/route-optimize', { tripId }).then(unwrap),
  suggest: (payload) => api.post('/ai/trip/suggest', payload).then(unwrap),
};

export const assistantApi = {
  chat: (payload) => api.post('/assistant/chat', payload).then(unwrap),
  conversations: () => api.get('/assistant/conversations').then(unwrap),
  getConversation: (id) => api.get(`/assistant/conversations/${id}`).then(unwrap),
  createConversation: (payload) => api.post('/assistant/conversations', payload).then(unwrap),
  deleteConversation: (id) => api.delete(`/assistant/conversations/${id}`).then(unwrap),
};

export const locationApi = {
  start: (payload) => api.post('/location/start', payload).then(unwrap),
  update: (payload) => api.post('/location/update', payload).then(unwrap),
  stop: (sessionId) => api.post('/location/stop', { sessionId }).then(unwrap),
  current: () => api.get('/location/current').then(unwrap),
  distance: (sessionId) => api.get('/location/distance', { params: { sessionId } }).then(unwrap),
  arrivalStatus: () => api.get('/location/arrival-status').then(unwrap),
  deleteHistory: () => api.delete('/location/history').then(unwrap),
};

export const transportApi = {
  searchTrains: (params) => api.get('/transport/trains/search', { params }).then(unwrap),
  searchBuses: (params) => api.get('/transport/buses/search', { params }).then(unwrap),
  compare: (params) => api.get('/transport/compare', { params }).then(unwrap),
  local: () => api.get('/transport/local').then(unwrap),
};

export const hotelsApi = {
  search: (params) => api.get('/hotels/search', { params }).then(unwrap),
  get: (id) => api.get(`/hotels/${id}`).then(unwrap),
  recommended: (params) => api.get('/hotels/recommended', { params }).then(unwrap),
  category: (cat) => api.get(`/hotels/${cat}`).then(unwrap),
};

export const placesApi = {
  search: (params) => api.get('/places/search', { params }).then(unwrap),
  get: (id) => api.get(`/places/${id}`).then(unwrap),
  nearby: (params) => api.get('/places/nearby', { params }).then(unwrap),
  category: (cat, params) => api.get(`/places/${cat}`, { params }).then(unwrap),
};

export const expensesApi = {
  list: (tripId) => api.get(`/trips/${tripId}/expenses`).then(unwrap),
  create: (tripId, payload) => api.post(`/trips/${tripId}/expenses`, payload).then(unwrap),
  update: (tripId, expenseId, payload) => api.patch(`/trips/${tripId}/expenses/${expenseId}`, payload).then(unwrap),
  remove: (tripId, expenseId) => api.delete(`/trips/${tripId}/expenses/${expenseId}`).then(unwrap),
  summary: (tripId) => api.get(`/trips/${tripId}/expenses/summary`).then(unwrap),
};

export const favoritesApi = {
  list: (type) => api.get('/favorites', { params: { type } }).then(unwrap),
  add: (payload) => api.post('/favorites', payload).then(unwrap),
  remove: (id) => api.delete(`/favorites/${id}`).then(unwrap),
  check: (placeId) => api.get(`/favorites/check/${placeId}`).then(unwrap),
};

export const notificationsApi = {
  list: () => api.get('/notifications').then(unwrap),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then(unwrap),
  markAllRead: () => api.patch('/notifications/read-all').then(unwrap),
  remove: (id) => api.delete(`/notifications/${id}`).then(unwrap),
};
