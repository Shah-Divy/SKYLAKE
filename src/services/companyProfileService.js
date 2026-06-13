import api from './api';

export const companyProfileService = {
  get: async () => {
    const response = await api.get('/company-profile');
    if (response.data && response.data.success && response.data.data) {
      response.data.data.companyProfile = response.data.data.company_profile;
    }
    return response.data;
  },

  getAdmin: async () => {
    const response = await api.get('/admin/company-profile');
    if (response.data && response.data.success && response.data.data) {
      response.data.data.companyProfile = response.data.data.company_profile;
    }
    return response.data;
  },

  update: async (data) => {
    const payload = {
      company_profile: data.companyProfile,
      mission: data.mission,
      vision: data.vision,
      achievements: data.achievements,
    };
    const response = await api.put('/admin/company-profile', payload);
    if (response.data && response.data.success && response.data.data) {
      response.data.data.companyProfile = response.data.data.company_profile;
    }
    return response.data;
  },
};

