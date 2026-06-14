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
    const response = await api.get('/admin/me');
    if (response.data && response.data.success && response.data.data) {
      response.data.data = {
        ...response.data.data,
        createdAt: response.data.data.created_at,
      };
    }
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/admin/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },
};
