import api from './api';

export const downloadService = {
  getAll: async (params = {}) => {
    const response = await api.get('/downloads', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/downloads/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/downloads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/downloads/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/downloads/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/downloads/${id}/toggle-status`);
    return response.data;
  },
};
