import axios from 'axios';

axios.defaults.baseURL = 'https://apis.imooc.com/api/';

const icode = '2DFF2F014F547C96';

axios.interceptors.request.use((config) => {
  config.params = { ...config.params, icode };

  if (config.data instanceof FormData) {
    config.data.append('icode', '******');
  } else {
    config.data = { ...config.data, icode };
  }

  return config;
});

export default axios;
