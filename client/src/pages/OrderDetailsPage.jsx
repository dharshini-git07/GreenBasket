import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Package, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { getOrderByIdApi } from '../services/api';
import { LoadingPage } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrderByIdApi(id);
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <LoadingPage message="Loading order details..." />;
  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <ErrorMessage message={error || 'Order not found'} />
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E7D32] text-white text-xs font-semibold rounded-full"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Order History
        </Link>
      </div>
    );
  }

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.orderStatus);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Link */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#2E7D32] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Order History
      </Link>

      {/* Header Box */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Order Details</span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] font-mono mt-0.5">
            #{order._id.toUpperCase()}
          </h1>
          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-semibold">Status:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]/20">
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Order Status Timeline Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2937]">Order Status Timeline</h3>
        <div className="grid grid-cols-4 gap-2 text-center relative">
          {steps.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            return (
              <div key={step} className="space-y-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#2E7D32] text-white'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <span className={`text-[11px] font-semibold block ${isCompleted ? 'text-[#1B4332]' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#1F2937]">Purchased Items</h3>

            <div className="divide-y divide-gray-50">
              {order.items?.map((item) => (
                <div key={item._id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || '/products/product-01.jpg'}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-[#F8FAF8] border border-gray-100 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#1F2937]">{item.name}</h4>
                      <p className="text-[11px] text-gray-500">
                        ₹{item.price?.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-[#1B4332]">
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Address & Pricing Summary */}
        <div className="space-y-6">
          
          {/* Shipping Address Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <MapPin className="w-4 h-4" />
              <h4 className="font-bold text-xs text-[#1F2937]">Shipping Address</h4>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-bold text-[#1F2937]">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              <p className="pt-1 text-[#6B7280]">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <CreditCard className="w-4 h-4" />
              <h4 className="font-bold text-xs text-[#1F2937]">Payment Summary</h4>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Method</span>
              <span className="font-semibold text-[#1F2937]">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Payment Status</span>
              <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
            </div>
            <div className="flex justify-between py-1 text-gray-500">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#1F2937]">₹{order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 text-gray-500">
              <span>Shipping</span>
              <span className="font-semibold text-[#16A34A]">
                {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
              </span>
            </div>
            <div className="flex justify-between py-2 text-sm font-extrabold text-[#1B4332] border-t border-gray-100">
              <span>Total Paid</span>
              <span>₹{order.total?.toLocaleString()}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;
