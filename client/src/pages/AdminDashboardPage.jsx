import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  IndianRupee, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Tag,
  UserCheck
} from 'lucide-react';
import { getAdminStatsApi } from '../services/api';
import useAuth from '../hooks/useAuth';
import { LoadingPage } from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const AdminDashboardPage = () => {
  const { mongoUser } = useAuth();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminStatsApi();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingPage message="Loading admin stats..." />;

  const isUserAdmin = mongoUser?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2E7D32]">Management Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] mt-1">
            GreenBasket Admin Dashboard
          </h1>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" /> Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1F2937] bg-white border border-gray-200 hover:border-[#2E7D32] rounded-full flex items-center gap-1.5 transition-colors"
          >
            <Package className="w-4 h-4" /> Orders
          </Link>
          <Link
            to="/admin/users"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1F2937] bg-white border border-gray-200 hover:border-[#2E7D32] rounded-full flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-4 h-4" /> Users
          </Link>
          <Link
            to="/admin/sellers"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1F2937] bg-white border border-gray-200 hover:border-[#2E7D32] rounded-full flex items-center gap-1.5 transition-colors"
          >
            <Tag className="w-4 h-4 text-[#2E7D32]" /> Sellers
          </Link>
          <Link
            to="/admin/buyers"
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1F2937] bg-white border border-gray-200 hover:border-[#2E7D32] rounded-full flex items-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-4 h-4 text-emerald-600" /> Buyers
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* Statistics Cards - 2 Columns on Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        
        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-600 block">Total Products</span>
          <p className="text-xl sm:text-2xl font-black text-[#1F2937]">{stats.totalProducts}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-600 block">Total Orders</span>
          <p className="text-xl sm:text-2xl font-black text-[#1F2937]">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-600 block">Registered Users</span>
          <p className="text-xl sm:text-2xl font-black text-[#1F2937]">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs space-y-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-600 block">Total Revenue</span>
          <p className="text-xl sm:text-2xl font-black text-[#1B4332]">₹{stats.totalRevenue?.toLocaleString()}</p>
        </div>

      </div>

      {/* Admin Modules Navigation - 2 Columns on Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 pt-2 sm:pt-4">
        
        <Link
          to="/admin/products"
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all space-y-2.5 sm:space-y-3 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-[#1F2937] group-hover:text-[#2E7D32]">Products</h3>
          <p className="text-xs text-gray-600 leading-relaxed">Catalog, prices, stock, edit and delete products.</p>
          <span className="text-xs font-semibold text-[#2E7D32] flex items-center gap-1 pt-1">
            Open Catalog <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all space-y-2.5 sm:space-y-3 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-[#1F2937] group-hover:text-blue-600">Orders</h3>
          <p className="text-xs text-gray-600 leading-relaxed">Track customer orders & update shipping statuses.</p>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 pt-1">
            Open Orders <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all space-y-2.5 sm:space-y-3 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-[#1F2937] group-hover:text-purple-600">Users</h3>
          <p className="text-xs text-gray-600 leading-relaxed">View all registered MongoDB accounts and roles.</p>
          <span className="text-xs font-semibold text-purple-600 flex items-center gap-1 pt-1">
            Open Users <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/sellers"
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all space-y-2.5 sm:space-y-3 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Tag className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-[#1F2937] group-hover:text-amber-600">Sellers</h3>
          <p className="text-xs text-gray-600 leading-relaxed">View users who have listed products for sale.</p>
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 pt-1">
            Open Sellers <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link
          to="/admin/buyers"
          className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all space-y-2.5 sm:space-y-3 group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-[#1F2937] group-hover:text-emerald-600">Buyers</h3>
          <p className="text-xs text-gray-600 leading-relaxed">View users who have placed orders on GreenBasket.</p>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 pt-1">
            Open Buyers <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
