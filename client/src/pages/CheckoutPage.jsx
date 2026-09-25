import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Truck, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  Leaf, 
  ShoppingBag, 
  CheckCircle 
} from 'lucide-react';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { createOrderApi } from '../services/api';
import ErrorMessage from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const CheckoutPage = () => {
  const { cart, refreshCart } = useCart();
  const { mongoUser, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: mongoUser?.name || user?.displayName || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [paymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-[#1F2937]">Your basket is empty</h2>
        <p className="text-xs text-[#6B7280]">Add products to your basket before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E7D32] text-white text-xs font-semibold rounded-full"
        >
          Browse Eco Shop
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address || 
        !formData.city || !formData.state || !formData.pincode) {
      setError('Please complete all required shipping fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await createOrderApi({
        shippingAddress: formData,
        paymentMethod,
      });

      if (data.success && data.order) {
        await refreshCart();
        navigate(`/order-success/${data.order._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Checkout</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-1">
          One step closer to a greener choice. 🌱
        </h1>
      </div>

      <ErrorMessage message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Shipping & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-sm text-[#1F2937]">Shipping Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Aarav Sharma"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#1F2937] mb-1">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat No, House Name, Street"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#1F2937] mb-1">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="560001"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Box */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <CreditCard className="w-5 h-5" />
              <h3 className="font-bold text-sm text-[#1F2937]">Payment Option</h3>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F5E9]/60 border border-[#2E7D32]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#2E7D32]" />
                <div>
                  <h4 className="text-xs font-bold text-[#1B4332]">Cash on Delivery (COD)</h4>
                  <p className="text-[11px] text-[#6B7280]">Pay when your eco-package arrives at your door.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-white text-[#2E7D32] px-2.5 py-1 rounded-full border border-[#2E7D32]/20">
                Selected
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-[#1F2937]">Order Summary</h3>

            {/* Items Snapshot */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => {
                const product = item.product || {};
                return (
                  <div key={item._id || product._id} className="flex items-center gap-3 text-xs">
                    <img
                      src={product.images?.[0] || '/products/product-01.jpg'}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-[#F8FAF8] border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1F2937] truncate">{product.name}</p>
                      <p className="text-gray-400 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-[#1B4332]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pricing Totals */}
            <div className="space-y-2 pt-4 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1F2937]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Carbon Neutral Shipping</span>
                <span className="font-semibold text-[#16A34A]">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#1B4332] pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  Place Order 🌱
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;
