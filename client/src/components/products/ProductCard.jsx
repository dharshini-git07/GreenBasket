import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Check } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  const productId = product._id || product.id;
  const wishlisted = isWishlisted(productId);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setAdding(true);
    const result = await addToCart(productId, 1);
    setAdding(false);

    if (result?.requireAuth) {
      navigate('/login', { state: { from: { pathname: '/shop' } } });
      return;
    }

    if (result?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const result = await toggleWishlist(productId);
    if (result?.requireAuth) {
      navigate('/login', { state: { from: { pathname: '/shop' } } });
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative">
      
      {/* Top Image Box */}
      <div className="relative w-full h-48 bg-[#F8FAF8] rounded-xl overflow-hidden mb-4">
        <Link to={`/product/${product.slug || product._id}`}>
          <img
            src={product.images?.[0] || '/products/product-01.jpg'}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/products/product-01.jpg';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Eco Score Badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-[#2E7D32] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-[#2E7D32]/20">
            🌱 Eco Score {product.ecoScore}/100
          </span>
        </div>

        {/* Wishlist Heart Icon Button */}
        <button
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs ${
            wishlisted
              ? 'bg-red-50 text-red-600 font-bold scale-105'
              : 'bg-white/80 hover:bg-white text-gray-400 hover:text-red-500'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          onClick={handleWishlistToggle}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-600 text-red-600' : ''}`} />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-md inline-block mb-1">
            {product.category}
          </span>

          {/* Product Name */}
          <Link to={`/product/${product.slug || product._id}`}>
            <h3 className="text-sm font-bold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#6B7280] line-clamp-1 mt-1">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Rating and Stock */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-[#1F2937]">{product.rating || 4.5}</span>
            <span className="text-gray-400 text-[10px]">({product.reviewCount || 12})</span>
          </div>

          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
          }`}>
            {isOutOfStock ? 'Out of Stock' : `${product.stock} left`}
          </span>
        </div>

        {/* Footer Price & Add to Cart Button */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
          <div>
            <span className="text-xs text-gray-400 block -mb-0.5">Price</span>
            <span className="text-base font-extrabold text-[#1B4332]">
              ₹{product.price?.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={adding || isOutOfStock}
            className={`px-4 py-2 text-xs font-semibold rounded-full shadow-xs transition-all duration-200 flex items-center gap-1.5 ${
              added
                ? 'bg-[#16A34A] text-white'
                : isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#2E7D32] hover:bg-[#1B4332] text-white'
            }`}
          >
            {adding ? (
              <span className="animate-spin text-xs">⏳</span>
            ) : added ? (
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
};

export default ProductCard;
