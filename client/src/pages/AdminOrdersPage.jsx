import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, CheckCircle, Info, X } from 'lucide-react';
import { getAdminOrdersApi, updateAdminOrderStatusApi } from '../services/api';
import { LoadingPage } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminOrdersApi();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customer orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError(null);
    setMessage(null);
    try {
      const data = await updateAdminOrderStatusApi(orderId, { orderStatus: newStatus });
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
        setMessage('Order status updated successfully.');
        setTimeout(() => setMessage(null), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingPage message="Loading customer orders..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <Link to="/admin" className="text-xs font-semibold text-gray-400 hover:text-[#2E7D32] flex items-center gap-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-[#1F2937]">Admin Order Management</h1>
      </div>

      {message && (
        <div className="bg-[#2E7D32] text-white text-xs font-semibold py-3 px-4 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1F2937]">
            <thead className="bg-[#F8FAF8] text-[#6B7280] uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o) => {
                const itemCount = o.items?.reduce((t, i) => t + i.quantity, 0) || 0;
                return (
                  <tr key={o._id} className="hover:bg-[#F8FAF8]/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#1F2937]">
                      #{o._id.substring(o._id.length - 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#1F2937]">{o.shippingAddress?.fullName || o.user?.name || 'Customer'}</p>
                      <p className="text-[10px] text-gray-400">{o.user?.email || o.shippingAddress?.phone}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold">{itemCount} items</td>
                    <td className="px-6 py-4 font-bold text-[#1B4332]">₹{o.total?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[#E8F5E9] text-[#2E7D32] px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                        {o.paymentMethod} ({o.paymentStatus})
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.orderStatus}
                        disabled={updatingId === o._id}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="px-3 py-1.5 bg-[#F8FAF8] border border-gray-200 rounded-full font-semibold text-xs text-[#1F2937] focus:outline-none focus:border-[#2E7D32] cursor-pointer"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminOrdersPage;
