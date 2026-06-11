import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.skylakeautomation.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Crucial for cookie-based auth where applicable
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach the token to the request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we receive a 401 (Unauthorized), handle logout and redirection
    if (error.response && error.response.status === 401) {
      // Clear storage
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      
      // If we are in the admin dashboard panel, redirect to login
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const base = API_BASE_URL.replace(/\/api$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default api;
