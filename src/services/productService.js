import api from './api';

const mapProduct = (p) => {
  if (!p) return p;
  
  let resolvedImages = [];
  if (p.images) {
    if (typeof p.images === 'string') {
      try {
        resolvedImages = JSON.parse(p.images);
      } catch (e) {
        resolvedImages = [p.images];
      }
    } else if (Array.isArray(p.images)) {
      resolvedImages = p.images;
    }
  }

  let resolvedBrand = p.brand_id;
  if (p.brand) {
    resolvedBrand = {
      ...p.brand,
      _id: p.brand.id,
      brandName: p.brand.brand_name,
    };
  }

  let resolvedCategory = p.category_id;
  if (p.category) {
    resolvedCategory = {
      ...p.category,
      _id: p.category.id,
      categoryName: p.category.category_name,
    };
  }

  return {
    ...p,
    _id: p.id,
    productName: p.product_name,
    modelNumber: p.model_number,
    hsnCode: p.hsn_code,
    videoLink: p.video_link,
    pdfFile: p.pdf_file,
    price: p.price,
    discountedPrice: p.discounted_price,
    images: resolvedImages,
    brandId: resolvedBrand,
    categoryId: resolvedCategory,
    status: (p.status === true || p.status === 1 || p.status === '1' || p.status === 'active') ? 1 : 0,
  };
};

export const productService = {
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    if (response.data && response.data.success) {
      if (Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map(mapProduct);
      }
      if (response.data.pagination) {
        response.data.pagination.pages = response.data.pagination.total_pages || response.data.pagination.pages;
      }
    }
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapProduct(response.data.data);
    }
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapProduct(response.data.data);
    }
    return response.data;
  },

  update: async (id, payload) => {
    let response;
    if (payload instanceof FormData) {
      response = await api.post(`/admin/products/${id}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await api.put(`/admin/products/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapProduct(response.data.data);
    }
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  toggleStatus: async (product) => {
    const response = await api.patch(`/admin/products/${product._id || product.id}/toggle-status`);
    if (response.data && response.data.success && response.data.data) {
      response.data.data = mapProduct(response.data.data);
    }
    return response.data;
  },
};

