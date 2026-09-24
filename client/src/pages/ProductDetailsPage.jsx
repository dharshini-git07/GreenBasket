import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Sparkles,
  Plus,
  Minus
} from 'lucide-react';
import { getProductByIdApi } from '../services/api';
import useCart from '../hooks/useCart';
import { LoadingPage } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductByIdApi(id);
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setAdding(true);
    const result = await addToCart(product._id, quantity);
    setAdding(false);

    if (result?.requireAuth) {
      navigate('/login', { state: { from: { pathname: `/product/${id}` } } });
      return;
    }

    if (result?.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  if (loading) return <LoadingPage message="Loading eco product details..." />;
  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <ErrorMessage message={error || 'Product not found.'} />
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E7D32] text-white text-xs font-semibold rounded-full"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back Link */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#2E7D32] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sustainable Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Product Image Gallery */}
        <div className="space-y-4">
          <div className="w-full h-96 sm:h-[450px] bg-[#F8FAF8] rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group">
            <img
              src={product.images?.[0] || '/products/product-01.jpg'}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/products/product-01.jpg';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-white/95 backdrop-blur-xs text-[#2E7D32] text-xs font-bold px-3 py-1.5 rounded-full shadow-xs border border-[#2E7D32]/20">
                🌱 Eco Score {product.ecoScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="space-y-6">
          
          {/* Category & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-[#1F2937]">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Title & Price */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#1B4332]">
                ₹{product.price?.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">Taxes included • Free eco shipping over ₹999</span>
            </div>
          </div>

          {/* Eco Score & Attribute Box */}
          <div className="p-6 rounded-2xl bg-[#E8F5E9]/50 border border-[#2E7D32]/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-[#2E7D32]" />
                <span className="text-xs font-bold text-[#1B4332]">🌱 Verified Eco Score</span>
              </div>
              <span className="text-lg font-black text-[#2E7D32]">
                {product.ecoScore} / 100
              </span>
            </div>

            {/* Eco Attribute Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {product.ecoAttributes?.reusable && (
                <span className="bg-white text-[#2E7D32] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#2E7D32]/20">
                  ♻️ Reusable
                </span>
              )}
              {product.ecoAttributes?.sustainableMaterial && (
                <span className="bg-white text-[#2E7D32] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#2E7D32]/20">
                  🌿 Sustainable Material
                </span>
              )}
              {product.ecoAttributes?.plasticFree && (
                <span className="bg-white text-[#2E7D32] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#2E7D32]/20">
                  🚫 Plastic-Free
                </span>
              )}
              {product.ecoAttributes?.energyEfficient && (
                <span className="bg-white text-[#2E7D32] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#2E7D32]/20">
                  ⚡ Energy Efficient
                </span>
              )}
              {product.ecoAttributes?.organic && (
                <span className="bg-white text-[#2E7D32] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#2E7D32]/20">
                  🌾 Organic
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Status & Quantity Selector */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700">Availability:</span>
              <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock} available)`}
              </span>
            </div>

            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-full bg-[#F8FAF8] p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-gray-600 disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-[#1F2937]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-gray-600 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={adding || isOutOfStock}
              className={`w-full py-4 text-xs font-semibold rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
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
                  <Check className="w-4 h-4" /> Added to Basket! 🌱
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Basket
                </>
              )}
            </button>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#2E7D32]" />
              <span>Carbon Neutral Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#2E7D32]" />
              <span>30-Day Eco Guarantee</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;
