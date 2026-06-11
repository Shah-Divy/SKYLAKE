import api from './api';

export const newsService = {
  getAll: async (params = {}) => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/news/${id}/toggle-status`);
    return response.data;
  },
};
