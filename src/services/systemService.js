import api from './api';

export const systemService = {
  getPartnerData: async () => {
    const response = await api.get('/admin/system/1');
    return response.data;
  },

  updatePartnerData: async (payload) => {
    const response = await api.put('/admin/system/1', payload);
    return response.data;
  },

  getSystemData: async () => {
    const response = await api.get('/system/1');
    return response.data;
  },
};
