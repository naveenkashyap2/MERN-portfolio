import { api } from '../../lib/axios.js';

export const hotelsApi = {
  search: (params) => api.get('/hotels/search', { params }).then((r) => r.data.data),
  get: (id) => api.get(`/hotels/${id}`).then((r) => r.data.data.hotel),
  recommended: (params) => api.get('/hotels/recommended', { params }).then((r) => r.data.data),
  budget: (params) => api.get('/hotels/budget', { params }).then((r) => r.data.data),
  medium: (params) => api.get('/hotels/medium', { params }).then((r) => r.data.data),
  premium: (params) => api.get('/hotels/premium', { params }).then((r) => r.data.data),
};
