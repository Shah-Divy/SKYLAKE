import api from './api';

const mapBlog = (b) => {
  if (!b) return b;
  return {
    ...b,
    _id: b.id,
    publishDate: b.publish_date,
    status: (b.status === true || b.status === 1 || b.status === '1' || b.status === 'active') ? 'active' : 'inactive',
  };
};

export const blogService = {
  getAll: async (params = {}) => {
    const response = await api.get('/blogs', { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapBlog);
    }
    return response.data;
  },

  getAllAdmin: async (params = {}) => {
    const response = await api.get('/admin/blogs', { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapBlog);
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBlog(response.data.data);
    }
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/admin/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBlog(response.data.data);
    }
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/admin/blogs/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBlog(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/blogs/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/admin/blogs/${id}/toggle-status`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBlog(response.data.data);
    }
    return response.data;
  },
};

