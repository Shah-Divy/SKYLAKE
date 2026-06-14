import api from './api';

const mapCategory = (c) => {
  if (!c) return c;
  return {
    ...c,
    _id: c.id,
    categoryName: c.category_name,
    status: (c.status === true || c.status === 1 || c.status === '1' || c.status === 'active') ? 'active' : 'inactive',
  };
};

export const categoryService = {
  getAll: async (params = {}) => {
    const endpoint = params.isAdmin ? '/admin/categories' : '/categories';
    const { isAdmin, ...cleanParams } = params;
    const response = await api.get(endpoint, { params: cleanParams });
    if (response.data && response.data.success && Array.isArray(response.data.data)) {
      response.data.data = response.data.data.map(mapCategory);
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapCategory(response.data.data);
    }
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/admin/categories', data);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapCategory(response.data.data);
    }
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapCategory(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  toggleStatus: async (category) => {
    const newStatus = category.status === 'active' ? '0' : '1';
    const payload = {
      category_name: category.categoryName || category.category_name,
      description: category.description,
      status: newStatus,
    };
    return categoryService.update(category._id || category.id, payload);
  },
};

