import api from './api';

const mapReview = (r) => {
  if (!r) return r;
  return {
    _id: r.id,
    customerName: r.customer_name,
    companyName: r.company_name,
    review: r.review,
    profileImage: r.profile_image,
    rating: r.rating,
    status: (r.status === true || r.status === 1 || r.status === 'active') ? 'active' : 'inactive',
    created_at: r.created_at,
    updated_at: r.updated_at
  };
};

export const reviewService = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/reviews', { params });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapReview);
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/reviews/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapReview(response.data.data);
    }
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/admin/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapReview(response.data.data);
    }
    return response.data;
  },

  update: async (id, formData) => {
    const response = await api.post(`/admin/reviews/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapReview(response.data.data);
    }
    return response.data;
  },

  updateJson: async (id, payload) => {
    const response = await api.put(`/admin/reviews/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapReview(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/reviews/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.patch(`/admin/reviews/${id}/toggle-status`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapReview(response.data.data);
    }
    return response.data;
  },
};
