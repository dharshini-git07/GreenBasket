import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle2,
  ShieldCheck,
  Zap,
  XCircle,
  AlertCircle
} from 'lucide-react';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import { createOrderApi, createRazorpayOrderApi, verifyPaymentApi } from '../services/api';
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

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'RAZORPAY'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Demo Modal state for fallback/test environment
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoOrderData, setDemoOrderData] = useState(null);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shippingFee;

  // Load Razorpay Script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setError('Please complete all required shipping fields.');
      return;
    }

    setLoading(true);
    setError(null);

    if (paymentMethod === 'COD') {
      // Cash on Delivery Flow
      try {
        const data = await createOrderApi({
          shippingAddress: formData,
          paymentMethod: 'COD',
        });

        if (data.success && data.order) {
          await refreshCart();
          navigate(`/order-success/${data.order._id}`);
        } else {
          setError(data.message || 'Failed to place COD order.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // Online Payment Flow via Razorpay TEST MODE
      try {
        const orderRes = await createRazorpayOrderApi();

        if (!orderRes.success || !orderRes.orderId) {
          throw new Error(orderRes.message || 'Failed to create Razorpay test order');
        }

        const razorpayOrderInfo = {
          orderId: orderRes.orderId,
          amount: orderRes.amount,
          currency: orderRes.currency,
          keyId: orderRes.keyId,
        };

        if (window.Razorpay) {
          const options = {
            key: orderRes.keyId,
            amount: orderRes.amount,
            currency: orderRes.currency,
            name: 'GreenBasket Eco Store',
            description: 'Complete your secure demo payment',
            image: 'https://cdn-icons-png.flaticon.com/512/891/891462.png',
            order_id: orderRes.orderId,
            handler: async function (response) {
              await processServerVerification(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );
            },
            prefill: {
              name: formData.fullName || 'Eco Customer',
              contact: formData.phone || '9876543210',
              email: user?.email || 'customer@greenbasket.com',
            },
            notes: {
              address: `${formData.address}, ${formData.city}`,
            },
            config: {
              display: {
                blocks: {
                  banks: {
                    name: 'All Payment Options (UPI, Card, Netbanking)',
                    instruments: [
                      { method: 'upi' },
                      { method: 'card' },
                      { method: 'netbanking' },
                      { method: 'wallet' }
                    ]
                  }
                },
                sequence: ['block.banks'],
                preferences: {
                  show_default_blocks: true
                }
              }
            },
            theme: {
              color: '#2E7D32',
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                setError('Payment was not completed.\nYour cart is still safe. You can try again.');
              },
            },
          };

          try {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function () {
              setLoading(false);
              setError('Payment was not completed.\nYour cart is still safe. You can try again.');
            });
            rzp.open();
          } catch (sdkErr) {
            console.warn('[Razorpay SDK Notice] Opening demo test modal fallback:', sdkErr.message);
            setDemoOrderData(razorpayOrderInfo);
            setShowDemoModal(true);
            setLoading(false);
          }
        } else {
          // Open interactive test modal if Razorpay script is not present
          setDemoOrderData(razorpayOrderInfo);
          setShowDemoModal(true);
          setLoading(false);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Payment initialization failed. Please try again.');
        setLoading(false);
      }
    }
  };

  // Execute server verification for online payments
  const processServerVerification = async (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
    setLoading(true);
    setError(null);
    try {
      const data = await verifyPaymentApi({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        shippingAddress: formData,
      });

      if (data.success && data.order) {
        await refreshCart();
        navigate(`/order-success/${data.order._id}`);
      } else {
        setError(data.message || 'Payment verification failed.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Payment verification failed. Your cart is safe. You can try again.'
      );
    } finally {
      setLoading(false);
      setShowDemoModal(false);
    }
  };

  // Handle Demo Modal Success simulation
  const handleSimulatePaymentSuccess = () => {
    if (!demoOrderData) return;
    const paymentId = `pay_test_${Date.now()}`;
    const demoSignature = `demo_signature_${demoOrderData.orderId}`;
    processServerVerification(demoOrderData.orderId, paymentId, demoSignature);
  };

  // Handle Demo Modal Failure simulation
  const handleSimulatePaymentFailure = () => {
    setShowDemoModal(false);
    setLoading(false);
    setError('Payment was not completed.\nYour cart is still safe. You can try again.');
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

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Shipping & Payment Options */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address Section */}
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

          {/* Payment Method Selection Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2E7D32]">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-bold text-sm text-[#1F2937]">Payment Method</h3>
              </div>
              <span className="text-[10px] font-semibold bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-1 rounded-full border border-[#2E7D32]/20">
                Razorpay TEST MODE
              </span>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery Option */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-[#E8F5E9]/60 border-[#2E7D32] shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 accent-[#2E7D32]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#1F2937]">Cash on Delivery</h4>
                    {paymentMethod === 'COD' && (
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Pay when your order arrives.
                  </p>
                </div>
              </label>

              {/* Online Payment Option */}
              <label
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'RAZORPAY'
                    ? 'bg-[#E8F5E9]/60 border-[#2E7D32] shadow-xs'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                  className="mt-1 accent-[#2E7D32]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#1F2937]">Online Payment</h4>
                      <span className="text-[9px] font-bold bg-[#3395FF]/10 text-[#0066CC] px-2 py-0.5 rounded-full border border-[#0066CC]/20">
                        Razorpay
                      </span>
                    </div>
                    {paymentMethod === 'RAZORPAY' && (
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Secure demo payment powered by Razorpay.
                  </p>
                </div>
              </label>
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
                <span>Shipping</span>
                <span className="font-semibold text-[#16A34A]">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#1B4332] pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 group cursor-pointer"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  {paymentMethod === 'COD' ? (
                    <>
                      Place Order 🌱
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      Pay ₹{total.toLocaleString()} 🔒
                      <Zap className="w-4 h-4 group-hover:scale-110 transition-transform text-amber-300" />
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Interactive Razorpay TEST MODE Fallback Modal */}
      {showDemoModal && demoOrderData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 border border-emerald-100 shadow-2xl relative">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#3395FF]/10 text-[#0066CC] flex items-center justify-center mx-auto">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1F2937]">
                Razorpay TEST Checkout
              </h3>
              <p className="text-xs text-gray-500">
                Complete your secure demo payment
              </p>
            </div>

            <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-gray-200 text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Order Reference:</span>
                <span className="font-mono font-bold text-[#1F2937]">{demoOrderData.orderId}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Amount:</span>
                <span className="font-bold text-[#1B4332]">₹{(demoOrderData.amount / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Environment:</span>
                <span className="font-bold text-amber-600">TEST MODE ONLY</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleSimulatePaymentSuccess}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#2E7D32] hover:bg-[#1B4332] text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : '✓ Complete Demo Payment (success@razorpay)'}
              </button>

              <button
                type="button"
                onClick={handleSimulatePaymentFailure}
                disabled={loading}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                ✕ Cancel / Fail Payment (failure@razorpay)
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center">
              🔒 GreenBasket Razorpay Test Sandbox • No real money is processed.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default CheckoutPage;
