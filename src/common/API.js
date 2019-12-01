import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8048/'
});

axiosRetry(api, { retries: 3 });

export default api;