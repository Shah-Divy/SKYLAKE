import api from './api';

export const inquiryService = {
  getAll: async (params = {}) => {
    const response = await api.get('/inquiries', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/inquiries/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/inquiries/${id}`);
    return response.data;
  },

  submitContactInquiry: async (formData) => {
    const response = await api.post('/contact', formData);
    return response.data;
  },
};
