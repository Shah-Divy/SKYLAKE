import api from './api';

const mapGallery = (g) => {
  if (!g) return g;
  return {
    ...g,
    _id: g.id,
  };
};

export const galleryService = {
  getAll: async (params = {}) => {
    const response = await api.get('/galleries', { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapGallery);
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/galleries/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapGallery(response.data.data);
    }
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/admin/galleries', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapGallery(response.data.data);
    }
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/admin/galleries/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapGallery(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/galleries/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/admin/galleries/${id}/toggle-status`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapGallery(response.data.data);
    }
    return response.data;
  },
};

