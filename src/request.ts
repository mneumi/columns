import axios from 'axios';
import store from '@/store';

// axios.defaults.baseURL = 'http://apis.imooc.com/api/';
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers['Content-Type'] = 'application/json';

const icode = '2DFF2F014F547C96';

axios.interceptors.request.use(
  (config) => {
    if (!config.url?.includes('upload')) {
      store.commit('addLoading');
    }
    store.commit('setMessage', { content: '', type: 'default' });
    return config;
  },
  (err) => {
    const errContent = err?.response?.data?.error || '网络发生错误';

    store.commit('minusLoading');
    store.commit('setMessage', { content: errContent, type: 'error' });
    return Promise.reject(err.response.data);
  }
);

axios.interceptors.request.use((config) => {
  config.timeout = 10000;
  config.params = { ...config.params, icode };

  const token = store.state.token || '';
  config.headers['Authorization'] = `Bearer ${token}`;

  if (config.data instanceof FormData) {
    config.data.append('icode', icode);
  } else {
    config.data = { ...config.data, icode };
  }

  return config;
});

axios.interceptors.response.use(
  (response) => {
    if (!response.config.url?.includes('/upload')) {
      store.commit('minusLoading');
    }
    return response;
  },
  (err) => {
    store.commit('minusLoading');
    return Promise.reject(err.response.data);
  }
);

export default axios;
