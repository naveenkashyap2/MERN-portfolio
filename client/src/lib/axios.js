import axios from 'axios';
import { tokenStore } from './tokenStore';

export const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    const status = response?.status;

    if (status !== 401 || config?._retry || !config) return Promise.reject(error);

    const url = config.url || '';
    if (url.includes('/auth/')) return Promise.reject(error);

    config._retry = true;
    try {
      refreshing = refreshing || axios.post('/api/v1/auth/refresh', {}, { withCredentials: true });
      const res = await refreshing;
      refreshing = null;
      const accessToken = res.data?.data?.accessToken;
      if (accessToken) {
        tokenStore.set(accessToken);
        config.headers.Authorization = `Bearer ${accessToken}`;
        return api(config);
      }
    } catch {
      /* fallthrough */
    }
    refreshing = null;
    tokenStore.clear();
    window.dispatchEvent(new Event('auth:expired'));
    return Promise.reject(error);
  },
);

export function getErrorMessage(err, fallback = 'Something went wrong.') {
  return err?.response?.data?.message || err?.message || fallback;
}
