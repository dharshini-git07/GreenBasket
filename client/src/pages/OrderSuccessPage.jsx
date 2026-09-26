import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowRight, Package, ShoppingBag } from 'lucide-react';
import { getOrderByIdApi } from '../services/api';
import { LoadingPage } from '../components/common/LoadingSpinner';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderByIdApi(id);
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <LoadingPage message="Processing your order details..." />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-md animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      {/* Locked Microcopy Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
        </div>
        <h1 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">
          Your order is on its greener journey! 🌱
        </h1>
        <p className="text-xs text-[#6B7280] max-w-md mx-auto">
          Thank you for making a sustainable choice today. We are preparing your eco-package.
        </p>
      </div>

      {/* Order Info Card */}
      {order && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs text-left max-w-md mx-auto space-y-3 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-[#6B7280]">Order ID</span>
            <span className="font-mono font-bold text-[#1F2937]">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-[#6B7280]">Total Amount</span>
            <span className="font-bold text-[#1B4332]">₹{order.total?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-[#6B7280]">Payment Method</span>
            <span className="font-semibold text-[#2E7D32]">
              {order.paymentMethod === 'RAZORPAY' ? 'Razorpay' : 'Cash on Delivery'}
            </span>
          </div>
          <div className="flex justify-between py-1 border-b border-gray-50">
            <span className="text-[#6B7280]">Payment Status</span>
            <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
              order.paymentStatus === 'Paid'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-600'
            }`}>
              {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-[#6B7280]">Order Status</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
              {order.orderStatus}
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to={`/orders/${id}`}
          className="w-full sm:w-auto px-6 py-3 bg-[#2E7D32] hover:bg-[#1B4332] text-white text-xs font-semibold rounded-full shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" /> View Order Details
        </Link>
        <Link
          to="/shop"
          className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 hover:border-[#2E7D32] text-[#1F2937] text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccessPage;
