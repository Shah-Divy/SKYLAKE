import api from './api';

export const adminService = {
  login: async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/admin/change-password', { currentPassword, newPassword });
    return response.data;
  },
};
