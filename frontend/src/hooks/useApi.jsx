// hooks/useApi.js
import { useMemo } from 'react';
import axios from 'axios';

const useApi = () => {
  // Create axios instance with interceptors
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:9000",
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to automatically add auth token
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

    // Response interceptor for global error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors globally
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  // Helper functions
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: token } : {};
  };

  const isAuthenticated = () => {
    return Boolean(localStorage.getItem("token"));
  };

  // API methods
  const apiMethods = {
    // GET request
    get: (url, config = {}) => api.get(url, config),
    
    // POST request
    post: (url, data = {}, config = {}) => api.post(url, data, config),
    
    // PUT request
    put: (url, data = {}, config = {}) => api.put(url, data, config),
    
    // DELETE request
    delete: (url, config = {}) => api.delete(url, config),
    
    // PATCH request
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