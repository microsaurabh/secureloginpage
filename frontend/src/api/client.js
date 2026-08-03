import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
  withCredentials: true,
  timeout: 10000
});

let csrfToken;
apiClient.interceptors.request.use(async (config) => {
  const method = (config.method ?? 'get').toLowerCase();
  if (!['post', 'put', 'patch', 'delete'].includes(method) || config.url === '/csrf-token') {
    return config;
  }
  if (!csrfToken) {
    const { data } = await apiClient.get('/csrf-token');
    csrfToken = data.data.csrfToken;
  }
  config.headers['x-csrf-token'] = csrfToken;
  return config;
});
