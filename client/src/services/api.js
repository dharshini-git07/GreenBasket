import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Firebase Auth Token
api.interceptors.request.use(
  async (config) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['x-user-uid'] = currentUser.uid;
        config.headers['x-user-email'] = currentUser.email;
      } catch (err) {
        console.warn('Could not retrieve Firebase ID token:', err.message);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** User APIs */
export const syncUserApi = async (userData) => {
  const response = await api.post('/users/sync', userData);
  return response.data;
};

export const getCurrentUserApi = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

/** Product APIs */
export const getProductsApi = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getFeaturedProductsApi = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

export const getProductByIdApi = async (idOrSlug) => {
  const response = await api.get(`/products/${idOrSlug}`);
  return response.data;
};

/** Cart APIs */
export const getCartApi = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCartApi = async (productId, quantity = 1) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

export const updateCartQuantityApi = async (productId, quantity) => {
  const response = await api.put(`/cart/${productId}`, { quantity });
  return response.data;
};

export const removeFromCartApi = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

export const clearCartApi = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

/** Health Check API */
export const checkHealthApi = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
