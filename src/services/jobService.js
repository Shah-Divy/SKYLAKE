import api from './api';

const mapJob = (j) => {
  if (!j) return j;
  return {
    ...j,
    _id: j.id,
  };
};

export const jobService = {
  getAll: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapJob);
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapJob(response.data.data);
    }
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/admin/jobs', data);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapJob(response.data.data);
    }
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/admin/jobs/${id}`, data);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapJob(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/jobs/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/admin/jobs/${id}/toggle-status`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapJob(response.data.data);
    }
    return response.data;
  },
};

