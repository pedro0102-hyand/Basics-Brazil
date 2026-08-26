import axios from 'axios';

type RequestLoadingListener = (isStarting: boolean) => void;

const requestLoadingListeners = new Set<RequestLoadingListener>();

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  requestLoadingListeners.forEach((listener) => listener(true));
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    requestLoadingListeners.forEach((listener) => listener(false));
    return response;
  },
  (error) => {
    requestLoadingListeners.forEach((listener) => listener(false));
    return Promise.reject(error);
  },
);

export const onRequestLoadingChange = (listener: RequestLoadingListener) => {
  requestLoadingListeners.add(listener);
  return () => requestLoadingListeners.delete(listener);
};

export default api;