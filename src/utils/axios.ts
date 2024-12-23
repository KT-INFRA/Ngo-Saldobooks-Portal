// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

import axios, { AxiosRequestConfig } from 'axios';
import storage from './storage';
const axiosServices = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3010/'
});
export const axiosAuthServices = axios.create({
  baseURL: import.meta.env.VITE_APP_USER_AUTH_URL || 'http://localhost:3010/'
});

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};

export const clearSession = () => {
  storage.removeItem('serviceToken');
  storage.removeItem('user');
};

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = storage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Token ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      clearSession();
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

axiosAuthServices.interceptors.request.use(
  async (config) => {
    const accessToken = storage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Token ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAuthServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      clearSession();
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);
export default axiosServices;
