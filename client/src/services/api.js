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

export const getMyProductsApi = async () => {
  const response = await api.get('/products/my-products');
  return response.data;
};

export const createProductApi = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProductApi = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await api.delete(`/products/${id}`);
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

/** Wishlist APIs */
export const getWishlistApi = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const addToWishlistApi = async (productId) => {
  const response = await api.post(`/wishlist/${productId}`);
  return response.data;
};

export const removeFromWishlistApi = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

/** Order APIs */
export const createOrderApi = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getUserOrdersApi = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderByIdApi = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

/** Payment APIs (Razorpay Test Mode) */
export const createRazorpayOrderApi = async () => {
  const response = await api.post('/payment/create-order');
  return response.data;
};

export const verifyPaymentApi = async (paymentData) => {
  const response = await api.post('/payment/verify', paymentData);
  return response.data;
};

/** Admin APIs */
export const getAdminStatsApi = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getAdminProductsApi = async () => {
  const response = await api.get('/admin/products');
  return response.data;
};

export const createAdminProductApi = async (productData) => {
  const response = await api.post('/admin/products', productData);
  return response.data;
};

export const updateAdminProductApi = async (id, productData) => {
  const response = await api.put(`/admin/products/${id}`, productData);
  return response.data;
};

export const deleteAdminProductApi = async (id) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

export const getAdminOrdersApi = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const updateAdminOrderStatusApi = async (id, statusData) => {
  const response = await api.put(`/admin/orders/${id}/status`, statusData);
  return response.data;
};

export const getAdminUsersApi = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getAdminSellersApi = async () => {
  const response = await api.get('/admin/sellers');
  return response.data;
};

export const getAdminBuyersApi = async () => {
  const response = await api.get('/admin/buyers');
  return response.data;
};



/** GreenGuide AI API */
export const askGreenGuideApi = async (message) => {
  const response = await api.post('/ai/green-guide', { message });
  return response.data;
};

/** Health Check API */
export const checkHealthApi = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
