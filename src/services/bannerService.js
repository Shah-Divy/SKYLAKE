import api from './api';

export const bannerService = {
  getAll: async () => {
    const response = await api.get('/banners');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/banners/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/banners/${id}/toggle-status`);
    return response.data;
  },
};
