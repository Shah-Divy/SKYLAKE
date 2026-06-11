import api from './api';

export const galleryService = {
  getAll: async (params = {}) => {
    const response = await api.get('/galleries', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/galleries/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/galleries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/galleries/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/galleries/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/galleries/${id}/toggle-status`);
    return response.data;
  },
};
