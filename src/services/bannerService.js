import api from './api';

const mapBanner = (b) => {
  if (!b) return b;
  return {
    _id: b.id,
    title: b.title,
    mediaType: b.media_type,
    mediaUrl: b.media_url,
    ctaText: b.cta_text,
    ctaUrl: b.cta_url,
    status: (b.status === true || b.status === 1 || b.status === 'active') ? 'active' : 'inactive',
    order: b.order,
    created_at: b.created_at,
    updated_at: b.updated_at
  };
};

export const bannerService = {
  getAll: async () => {
    const response = await api.get('/banners');
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapBanner);
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/banners/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBanner(response.data.data);
    }
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/admin/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBanner(response.data.data);
    }
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/admin/banners/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBanner(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/banners/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/admin/banners/${id}/toggle-status`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBanner(response.data.data);
    }
    return response.data;
  },
};

