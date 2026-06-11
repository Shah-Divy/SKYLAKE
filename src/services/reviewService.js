import api from './api';

export const reviewService = {
  getAll: async (params = {}) => {
    const response = await api.get('/reviews', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/reviews/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/reviews/${id}/toggle-status`);
    return response.data;
  },
};
