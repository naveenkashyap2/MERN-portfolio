import { api } from '../../lib/axios.js';

export const profileApi = {
  me: () => api.get('/users/me').then((r) => r.data.data),
  update: (body) => api.patch('/users/me', body).then((r) => r.data.data),
  prefs: () => api.get('/users/me/preferences').then((r) => r.data.data.preferences),
  updatePrefs: (body) => api.patch('/users/me/preferences', body).then((r) => r.data.data.preferences),
  avatar: (file) => {
    const form = new FormData();
    form.append('avatar', file);
    return api.patch('/users/me/avatar', form).then((r) => r.data.data);
  },
  remove: () => api.delete('/users/me'),
  notifications: () => api.get('/notifications').then((r) => r.data.data),
  readAll: () => api.patch('/notifications/read-all'),
  favorites: (params) => api.get('/favorites', { params }).then((r) => r.data.data),
  addFavorite: (body) => api.post('/favorites', body).then((r) => r.data.data),
  removeFavorite: (id) => api.delete(`/favorites/${id}`),
  checkFavorite: (placeId) => api.get(`/favorites/check/${placeId}`).then((r) => r.data.data),
};
