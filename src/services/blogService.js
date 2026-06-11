import api from './api';

export const blogService = {
  getAll: async (params = {}) => {
    const response = await api.get('/blogs', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.put(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/blogs/${id}/toggle-status`);
    return response.data;
  },
};
