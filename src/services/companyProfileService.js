import api from './api';

export const companyProfileService = {
  get: async () => {
    const response = await api.get('/company-profile');
    return response.data;
  },

  update: async (data) => {
    const response = await api.put('/company-profile', data);
    return response.data;
  },
};
