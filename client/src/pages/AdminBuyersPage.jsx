import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Search, UserCheck } from 'lucide-react';
import { getAdminBuyersApi } from '../services/api';
import { LoadingPage } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const AdminBuyersPage = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBuyers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminBuyersApi();
        if (data.success) {
          setBuyers(data.buyers || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load buyers.');
      } finally {
        setLoading(false);
      }
    };

    fetchBuyers();
  }, []);

  const filteredBuyers = buyers.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingPage message="Loading buyers table..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <Link to="/admin" className="text-xs font-semibold text-gray-400 hover:text-[#2E7D32] flex items-center gap-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#2E7D32]" />
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Admin Buyers View</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Users who have placed sustainable orders on GreenBasket.
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search buyers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAF8] border border-gray-200 rounded-full text-xs focus:outline-none focus:border-[#2E7D32]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          Total Buyers: {buyers.length}
        </span>
      </div>

      {/* Buyers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-[#1F2937]">
            <thead className="bg-[#F8FAF8] text-[#6B7280] uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Buyer Name</th>
                <th className="px-6 py-3.5">Email Address</th>
                <th className="px-6 py-3.5">Orders Count</th>
                <th className="px-6 py-3.5">Total Spent</th>
                <th className="px-6 py-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBuyers.map((b) => (
                <tr key={b._id} className="hover:bg-[#F8FAF8]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1F2937] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#2E7D32]" />
                    {b.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{b.email}</td>
                  <td className="px-6 py-4 font-bold text-[#1B4332]">
                    <span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full">
                      {b.ordersCount} orders
                    </span>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-[#1B4332]">
                    ₹{b.totalSpent?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminBuyersPage;
