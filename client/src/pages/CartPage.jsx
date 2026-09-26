import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Leaf, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import EmptyState from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading, cartMessage } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkoutMessage, setCheckoutMessage] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
          <Leaf className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#1F2937]">Please sign in to view your basket</h2>
        <p className="text-xs text-[#6B7280]">
          Sign in to access your persistent eco-shopping basket across devices.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#2E7D32] rounded-full shadow-sm"
        >
          Sign In to Continue
        </Link>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const totalItems = cart?.totalItems || 0;

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <EmptyState
          title="Your basket is feeling a little empty 🌱"
          subtitle="Add something sustainable to get started."
          actionText="Explore Products"
          actionLink="/shop"
          icon={ShoppingBag}
        />
      </div>
    );
  }

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Shopping Basket</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-1">
            Your Eco Basket ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 self-start sm:self-center"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Basket
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const product = item.product || {};
            const itemPrice = item.price || product.price || 0;
            const itemTotal = itemPrice * item.quantity;

            return (
              <div
                key={item._id || product._id}
                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.images?.[0] || '/products/product-01.jpg'}
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/products/product-01.jpg';
                    }}
                    className="w-20 h-20 rounded-2xl object-cover bg-[#F8FAF8] border border-gray-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E7D32]">
                      {product.category || 'Eco Product'}
                    </span>
                    <Link to={`/product/${product.slug || product._id}`}>
                      <h3 className="text-xs font-bold text-[#1F2937] hover:text-[#2E7D32] line-clamp-1">
                        {product.name || 'Sustainable Product'}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#6B7280]">
                      Unit Price: <span className="font-semibold text-[#1F2937]">₹{itemPrice.toLocaleString()}</span>
                    </p>
                    {product.ecoScore && (
                      <span className="inline-block text-[10px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2 py-0.5 rounded-full">
                        🌱 Eco Score {product.ecoScore}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                  
                  {/* Quantity selector */}
                  <div className="flex items-center border border-gray-200 rounded-full bg-[#F8FAF8] p-1">
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || loading}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-gray-600 disabled:opacity-30"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#1F2937]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      disabled={item.quantity >= (product.stock || 99) || loading}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-gray-600 disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal & Trash Button */}
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1B4332] block">
                      ₹{itemTotal.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="text-[11px] text-red-500 hover:text-red-700 font-medium inline-flex items-center gap-1 mt-1"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Right Column: Authoritative Order Summary */}
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#1F2937]">Order Summary</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-gray-50 text-[#6B7280]">
                <span>Items Subtotal ({totalItems})</span>
                <span className="font-semibold text-[#1F2937]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50 text-[#6B7280]">
                <span>Carbon Neutral Shipping</span>
                <span className="font-semibold text-[#16A34A]">FREE</span>
              </div>
              <div className="flex justify-between py-3 text-sm font-extrabold text-[#1B4332]">
                <span>Total Amount</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-4 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout 🌱
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/shop"
              className="w-full py-3 text-xs font-semibold text-center text-[#2E7D32] bg-[#E8F5E9]/50 hover:bg-[#E8F5E9] rounded-full block transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
