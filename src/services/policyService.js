import api from './api';

export const policyService = {
  getByType: async (type) => {
    const response = await api.get(`/policies/${type}`);
    return response.data;
  },

  updateByType: async (type, title, content) => {
    const response = await api.put(`/policies/${type}`, { title, content });
    return response.data;
  },
};
