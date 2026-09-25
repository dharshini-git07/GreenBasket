import React, { createContext, useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import {
  getWishlistApi,
  addToWishlistApi,
  removeFromWishlistApi,
} from '../services/api';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState(null);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getWishlistApi();
      if (data.success && data.wishlist) {
        setWishlist(data.wishlist);
      }
    } catch (err) {
      console.error('[WishlistContext Fetch Error]:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, user]);

  const showNotification = (msg, type = 'success') => {
    setWishlistMessage({ text: msg, type });
    setTimeout(() => setWishlistMessage(null), 4000);
  };

  const isWishlisted = (productId) => {
    if (!productId || !wishlist) return false;
    return wishlist.some((item) => {
      const id = item.product?._id || item.product;
      return id === productId;
    });
  };

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to add products to your wishlist.', 'info');
      return { success: false, requireAuth: true };
    }

    setLoading(true);
    try {
      const data = await addToWishlistApi(productId);
      if (data.success) {
        await fetchWishlist();
        showNotification('Added to your wishlist ♥', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not add to wishlist.';
      showNotification(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, requireAuth: true };

    setLoading(true);
    try {
      const data = await removeFromWishlistApi(productId);
      if (data.success) {
        setWishlist((prev) =>
          prev.filter((item) => (item.product?._id || item.product) !== productId)
        );
        showNotification('Removed from wishlist ♡', 'info');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not remove from wishlist.';
      showNotification(msg, 'error');
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      showNotification('Please sign in to manage your wishlist.', 'info');
      return { success: false, requireAuth: true };
    }

    if (isWishlisted(productId)) {
      return await handleRemoveFromWishlist(productId);
    } else {
      return await handleAddToWishlist(productId);
    }
  };

  const wishlistCount = wishlist.length;

  const value = {
    wishlist,
    wishlistCount,
    loading,
    wishlistMessage,
    dismissWishlistMessage: () => setWishlistMessage(null),
    isWishlisted,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    toggleWishlist: handleToggleWishlist,
    refreshWishlist: fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
