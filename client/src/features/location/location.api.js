import { api } from '../../lib/axios.js';

const consent = { 'X-Consent-Location': 'granted' };

export const locationApi = {
  start: (body) => api.post('/location/start', { ...body, consent: true }, { headers: consent }).then((r) => r.data.data),
  update: (body) => api.post('/location/update', { ...body, consent: true }, { headers: consent }).then((r) => r.data.data),
  stop: (sessionId) => api.post('/location/stop', { sessionId }).then((r) => r.data.data),
  current: (sessionId) => api.get('/location/current', { params: { sessionId } }).then((r) => r.data.data),
  history: (sessionId) => api.get('/location/history', { params: { sessionId } }).then((r) => r.data.data),
  distance: (sessionId) => api.get('/location/distance', { params: { sessionId } }).then((r) => r.data.data),
  arrival: (sessionId) => api.get('/location/arrival-status', { params: { sessionId } }).then((r) => r.data.data),
};
