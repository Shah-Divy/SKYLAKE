import api from './api';

const mapDownload = (d) => {
  if (!d) return d;
  return {
    ...d,
    _id: d.id,
    zipFile: d.zip_file,
    videoLink: d.video_link,
    status: (d.status === true || d.status === 1 || d.status === '1' || d.status === 'active') ? 'active' : 'inactive',
  };
};

export const downloadService = {
  getAll: async (params = {}) => {
    const response = await api.get('/downloads', { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapDownload);
    }
    return response.data;
  },

  getAllAdmin: async (params = {}) => {
    const response = await api.get('/admin/downloads', { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapDownload);
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/downloads/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapDownload(response.data.data);
    }
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/admin/downloads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapDownload(response.data.data);
    }
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/admin/downloads/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapDownload(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/downloads/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/admin/downloads/${id}/toggle-status`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapDownload(response.data.data);
    }
    return response.data;
  },
};

