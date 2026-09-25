import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Trash2, 
  Check, 
  ArrowLeft, 
  Leaf,
  Sparkles
} from 'lucide-react';
import useWishlist from '../hooks/useWishlist';
import useCart from '../hooks/useCart';
import LoadingSpinner from '../components/common/LoadingSpinner';

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [addingIds, setAddingIds] = useState({});
  const [addedIds, setAddedIds] = useState({});

  const handleAddToCart = async (product) => {
    const productId = product._id || product.id;
    setAddingIds((prev) => ({ ...prev, [productId]: true }));

    const result = await addToCart(productId, 1);
    setAddingIds((prev) => ({ ...prev, [productId]: false }));

    if (result?.requireAuth) {
      navigate('/login', { state: { from: { pathname: '/wishlist' } } });
      return;
    }

    if (result?.success) {
      setAddedIds((prev) => ({ ...prev, [productId]: true }));
      setTimeout(() => {
        setAddedIds((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  if (loading && wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <LoadingSpinner message="Loading your eco wishlist..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32]">
              <Heart className="w-6 h-6 fill-[#2E7D32]" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              My Wishlist
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your saved sustainable essentials ready for your next eco purchase.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#2E7D32] hover:text-[#1B4332] bg-[#E8F5E9] px-4 py-2.5 rounded-full transition-colors self-start md:self-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center max-w-xl mx-auto space-y-6 shadow-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-[#1F2937]">
              Your wishlist is waiting for something special 🌱
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">
              Save sustainable products you love and come back to them anytime.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-md transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" /> Explore Sustainable Shop
          </Link>
        </div>
      ) : (
        /* Wishlist Items Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const product = item.product;
            if (!product) return null;
            const productId = product._id || product.id;
            const isAdding = addingIds[productId];
            const isAdded = addedIds[productId];
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={item._id || productId}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative"
              >
                {/* Image and Badges */}
                <div className="relative w-full h-48 bg-[#F8FAF8] rounded-xl overflow-hidden mb-4">
                  <Link to={`/product/${product.slug || productId}`}>
                    <img
                      src={product.images?.[0] || '/products/product-01.jpg'}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/products/product-01.jpg';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Eco Score Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-[#2E7D32] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-[#2E7D32]/20">
                      🌱 Eco Score {product.ecoScore}/100
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(productId)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center transition-colors shadow-xs"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-md inline-block mb-1">
                      {product.category}
                    </span>
                    <Link to={`/product/${product.slug || productId}`}>
                      <h3 className="text-sm font-bold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase">Price</span>
                      <span className="text-base font-extrabold text-[#1B4332]">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isAdding || isOutOfStock}
                      className={`px-4 py-2 text-xs font-semibold rounded-full shadow-xs transition-all duration-200 flex items-center gap-1.5 ${
                        isAdded
                          ? 'bg-[#16A34A] text-white'
                          : isOutOfStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#2E7D32] hover:bg-[#1B4332] text-white'
                      }`}
                    >
                      {isAdding ? (
                        <span className="animate-spin text-xs">⏳</span>
                      ) : isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
