import { api } from '../../lib/axios.js';

export const authApi = {
  login: (body) => api.post('/auth/login', body).then((r) => r.data),
  register: (body) => api.post('/auth/register', body).then((r) => r.data),
  google: (credential) => api.post('/auth/google', { credential }).then((r) => r.data),
  logout: (all) => api.post('/auth/logout', { all }),
  me: () => api.get('/auth/me').then((r) => r.data),
  forgot: (email) => api.post('/auth/forgot-password', { email }).then((r) => r.data),
  reset: (body) => api.post('/auth/reset-password', body).then((r) => r.data),
};
