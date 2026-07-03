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
    // If an image file is provided, send multipart/form-data to the same endpoint
    let response;
    if (data.imageFile) {
      const form = new FormData();
      form.append('company_profile', data.companyProfile);
      form.append('mission', data.mission);
      form.append('vision', data.vision);
      form.append('achievements', data.achievements);
      form.append('image', data.imageFile);
      form.append('_method', 'PUT');
      response = await api.post('/admin/company-profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      const payload = {
        company_profile: data.companyProfile,
        mission: data.mission,
        vision: data.vision,
        achievements: data.achievements,
        _method: 'PUT',
      };
      response = await api.post('/admin/company-profile', payload);
    }
    if (response.data && response.data.success && response.data.data) {
      response.data.data.companyProfile = response.data.data.company_profile;
    }
    return response.data;
  },
};

