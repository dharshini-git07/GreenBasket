import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowLeft, Search, UserCheck } from 'lucide-react';
import { getAdminSellersApi } from '../services/api';
import { LoadingPage } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const AdminSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminSellersApi();
        if (data.success) {
          setSellers(data.sellers || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load sellers.');
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const filteredSellers = sellers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingPage message="Loading sellers table..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <Link to="/admin" className="text-xs font-semibold text-gray-400 hover:text-[#2E7D32] flex items-center gap-1 mb-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Tag className="w-6 h-6 text-[#2E7D32]" />
          <h1 className="text-2xl font-extrabold text-[#1F2937]">Admin Sellers View</h1>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Users who have created and listed at least one sustainable product for sale.
        </p>
      </div>

      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search sellers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAF8] border border-gray-200 rounded-full text-xs focus:outline-none focus:border-[#2E7D32]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
        <span className="text-xs text-gray-500 font-medium">
          Total Sellers: {sellers.length}
        </span>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-[#1F2937]">
            <thead className="bg-[#F8FAF8] text-[#6B7280] uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">Seller Name</th>
                <th className="px-6 py-3.5">Email Address</th>
                <th className="px-6 py-3.5">Products Listed</th>
                <th className="px-6 py-3.5">Account Role</th>
                <th className="px-6 py-3.5">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredSellers.map((s) => (
                <tr key={s._id} className="hover:bg-[#F8FAF8]/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1F2937] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#2E7D32]" />
                    {s.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{s.email}</td>
                  <td className="px-6 py-4 font-bold text-[#1B4332]">
                    <span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full">
                      {s.productsListed} products
                    </span>
                  </td>
                  <td className="px-6 py-4 uppercase font-semibold text-xs text-[#2E7D32]">
                    {s.role}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(s.createdAt).toLocaleDateString()}
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

export default AdminSellersPage;
