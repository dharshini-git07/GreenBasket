import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, ArrowRight, ShoppingBag, Clock } from 'lucide-react';
import { getUserOrdersApi } from '../services/api';
import { LoadingPage } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const getStatusBadge = (status) => {
  const styles = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserOrdersApi();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingPage message="Loading your eco orders..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Account</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-1">
          Your Order History
        </h1>
      </div>

      <ErrorMessage message={error} />

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xs text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#1F2937]">No orders placed yet</h3>
          <p className="text-xs text-[#6B7280]">
            When you purchase sustainable products, your orders will appear here.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#2E7D32] text-white text-xs font-semibold rounded-full shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const itemCount = order.items?.reduce((total, i) => total + i.quantity, 0) || 0;
            return (
              <div
                key={order._id}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#1F2937]">
                      Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                    {getStatusBadge(order.orderStatus)}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                    <span>•</span>
                    <span>Payment: <strong className="text-[#1F2937]">{order.paymentMethod} ({order.paymentStatus})</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Total Amount</span>
                    <span className="text-base font-extrabold text-[#1B4332]">
                      ₹{order.total?.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="px-5 py-2.5 bg-[#F8FAF8] hover:bg-[#E8F5E9] border border-gray-200 hover:border-[#2E7D32] text-xs font-semibold text-[#1F2937] rounded-full transition-all flex items-center gap-1.5"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default OrderHistoryPage;
