import axios from 'axios';


const apiBaseUrl = import.meta.env.REACT_APP_API_BASE_URL  || 'http://localhost:8765/api/v1';


export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
