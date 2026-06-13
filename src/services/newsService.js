import api from './api';

const mapNews = (n) => {
  if (!n) return n;
  return {
    ...n,
    _id: n.id,
    publishDate: n.publish_date,
    status: (n.status === true || n.status === 1 || n.status === '1' || n.status === 'active') ? 'active' : 'inactive',
  };
};

export const newsService = {
  getAll: async (params = {}) => {
    const response = await api.get('/news', { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapNews);
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/news/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapNews(response.data.data);
    }
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/admin/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapNews(response.data.data);
    }
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/admin/news/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapNews(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/news/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/admin/news/${id}/toggle-status`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapNews(response.data.data);
    }
    return response.data;
  },
};

