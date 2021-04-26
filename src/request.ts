import axios from 'axios';
import store from '@/store';

const request = axios.create();

request.defaults.baseURL = 'http://localhost:3000';
request.defaults.headers['Content-Type'] = 'application/json';

request.interceptors.request.use(
  (config) => {
    config.timeout = 10000;

    const token = store.state.token || '';
    config.headers['Authorization'] = `Bearer ${token}`;

    if (!config.url?.includes('upload')) {
      store.commit('addLoading');
    }

    return config;
  },
  (err) => {
    const errContent = err?.response?.data?.error || '网络发生错误';

    store.commit('minusLoading');

    return Promise.reject(err.response.data);
  }
);

request.interceptors.response.use(
  (response) => {
    if (!response.config.url?.includes('/upload')) {
      store.commit('minusLoading');
    }
    return response.data;
  },
  (err) => {
    store.commit('minusLoading');
    return Promise.reject(err.response.data);
  }
);

export { request };
