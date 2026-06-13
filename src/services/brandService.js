import api from './api';

const mapBrand = (b) => {
  if (!b) return b;
  return {
    ...b,
    _id: b.id,
    brandName: b.brand_name,
    status: (b.status === true || b.status === 1 || b.status === '1' || b.status === 'active') ? 'active' : 'inactive',
  };
};

export const brandService = {
  getAll: async (params = {}) => {
    const endpoint = params.isAdmin ? '/admin/brands' : '/brands';
    const { isAdmin, ...cleanParams } = params;
    const response = await api.get(endpoint, { params: cleanParams });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapBrand);
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/brands/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBrand(response.data.data);
    }
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/admin/brands', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBrand(response.data.data);
    }
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/admin/brands/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapBrand(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/brands/${id}`);
    return response.data;
  },

  toggleStatus: async (brand) => {
    const newStatus = brand.status === 'active' ? false : true;
    const payload = {
      brand_name: brand.brandName || brand.brand_name,
      description: brand.description,
      status: newStatus,
    };
    return brandService.update(brand._id || brand.id, payload);
  },
};

