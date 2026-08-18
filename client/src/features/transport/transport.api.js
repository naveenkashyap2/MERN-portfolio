import { api } from '../../lib/axios.js';

export const transportApi = {
  trains: (params) => api.get('/transport/trains/search', { params }).then((r) => r.data.data),
  buses: (params) => api.get('/transport/buses/search', { params }).then((r) => r.data.data),
  compare: (body) => api.post('/routes/compare', body).then((r) => r.data.data),
  walking: (body) => api.post('/walking/route', body).then((r) => r.data.data),
};
