// hooks/useApi.js
import { useMemo } from 'react';
import axios from 'axios';

const useApi = () => {
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "https://ideaplus.vercel.app",
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: token } : {};
  };

  const isAuthenticated = () => {
    return Boolean(localStorage.getItem("token"));
  };

  const apiMethods = {
    get: (url, config = {}) => api.get(url, config),
    
    post: (url, data = {}, config = {}) => api.post(url, data, config),
    
    put: (url, data = {}, config = {}) => api.put(url, data, config),
    
    delete: (url, config = {}) => api.delete(url, config),
    
    patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  };

  return {
    api,
    ...apiMethods,
    getAuthHeaders,
    isAuthenticated,
  };
};

export default useApi;