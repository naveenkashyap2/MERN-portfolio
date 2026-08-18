import { api } from '../lib/axios.js';

export const authService = {
  me: () => api.get('/auth/me').then((r) => r.data.data.user),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data.user),
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data.data.user),
  google: (credential) => api.post('/auth/google', { credential }).then((r) => r.data.data.user),
  logout: (all = false) => api.post('/auth/logout', { all }),
  forgot: (email) => api.post('/auth/forgot-password', { email }).then((r) => r.data.data),
  reset: (payload) => api.post('/auth/reset-password', payload),
};
