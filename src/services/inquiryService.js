import api from './api';

const mapInquiry = (inq) => {
  if (!inq) return inq;
  return {
    ...inq,
    _id: inq.id,
    createdAt: inq.created_at,
  };
};

export const inquiryService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/inquiries', { params });
    if (response.data && response.data.success) {
      if (Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map(mapInquiry);
      }
      if (response.data.pagination) {
        response.data.pagination.pages = response.data.pagination.total_pages || response.data.pagination.pages;
      }
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/inquiries/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapInquiry(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/inquiries/${id}`);
    return response.data;
  },

  submitContactInquiry: async (payload) => {
    const response = await api.post('/contact', payload);
    return response.data;
  },
};

