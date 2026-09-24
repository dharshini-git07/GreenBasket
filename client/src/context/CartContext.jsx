import React, { createContext, useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import { 
  getCartApi, 
  addToCartApi, 
  updateCartQuantityApi, 
  removeFromCartApi, 
  clearCartApi 
} from '../services/api';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], subtotal: 0, totalItems: 0 });
      return;
    }

    setLoading(true);
    try {
      const data = await getCartApi();
      if (data.success && data.cart) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('[CartContext Fetch Error]:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  const showNotification = (msg, type = 'success') => {
    setCartMessage({ text: msg, type });
    setTimeout(() => setCartMessage(null), 4000);
  };

  const handleAddToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to add products to your basket.', 'info');
      return { success: false, requireAuth: true };
    }

    setLoading(true);
    try {
      const data = await addToCartApi(productId, quantity);
      if (data.success) {
        setCart(data.cart);
        showNotification('Item added to your basket 🌱', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not add item to cart.';
      showNotification(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (!isAuthenticated) return;
    if (newQuantity < 1) return;

    setLoading(true);
    try {
      const data = await updateCartQuantityApi(productId, newQuantity);
      if (data.success) {
        setCart(data.cart);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not update quantity.';
      showNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const data = await removeFromCartApi(productId);
      if (data.success) {
        setCart(data.cart);
        showNotification('Item removed from basket.', 'info');
      }
    } catch (err) {
      showNotification('Could not remove item.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const data = await clearCartApi();
      if (data.success) {
        setCart({ items: [], subtotal: 0, totalItems: 0 });
        showNotification('Basket cleared.', 'info');
      }
    } catch (err) {
      showNotification('Could not clear basket.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const value = {
    cart,
    cartCount,
    loading,
    cartMessage,
    dismissMessage: () => setCartMessage(null),
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
