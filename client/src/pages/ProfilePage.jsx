import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  LogOut, 
  CheckCircle, 
  Package, 
  Heart, 
  Leaf, 
  Calendar,
  Sparkles
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const ProfilePage = () => {
  const { user, mongoUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getAuthProvider = () => {
    if (!user) return 'Unknown';
    const providerId = user.providerData?.[0]?.providerId;
    if (providerId === 'google.com') return 'Google Account';
    if (providerId === 'password') return 'Email / Password';
    return 'Firebase Auth';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-[#1B4332] to-[#2E7D32] rounded-3xl p-8 text-white mb-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          
          {/* Avatar */}
          <div className="relative">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full border-4 border-white/30 object-cover shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg">
                {(mongoUser?.name || user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-0 right-0 bg-[#8BC34A] text-[#1B4332] p-1 rounded-full text-xs font-bold shadow-xs">
              <Leaf className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {mongoUser?.name || user?.displayName || 'Eco Shopper'}
              </h1>
              <span className="bg-white/20 backdrop-blur-xs text-[#8BC34A] text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {mongoUser?.role || 'user'}
              </span>
            </div>
            <p className="text-xs text-emerald-100 flex items-center justify-center md:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-300" />
              {user?.email}
            </p>
            <p className="text-[11px] text-emerald-200 pt-1">
              Member since: {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '2026'}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-full transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'account'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          Account Details
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-[#2E7D32] text-[#2E7D32]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Order History
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <Shield className="w-5 h-5" />
              <h3 className="font-bold text-sm text-[#1F2937]">Authentication & Identity</h3>
            </div>
            
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[#6B7280]">Full Name</span>
                <span className="font-semibold text-[#1F2937]">{mongoUser?.name || user?.displayName || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[#6B7280]">Email Address</span>
                <span className="font-semibold text-[#1F2937]">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[#6B7280]">Auth Method</span>
                <span className="font-semibold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full text-[11px]">
                  {getAuthProvider()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[#6B7280]">Firebase UID</span>
                <span className="font-mono text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                  {user?.uid}
                </span>
              </div>
            </div>
          </div>

          {/* Database Sync Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#2E7D32]">
              <CheckCircle className="w-5 h-5" />
              <h3 className="font-bold text-sm text-[#1F2937]">MongoDB Atlas Status</h3>
            </div>

            <div className="p-4 bg-[#E8F5E9]/60 rounded-2xl border border-[#2E7D32]/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                <span className="text-xs font-bold text-[#1B4332]">Profile Synchronized</span>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Your user profile is active and synchronized in the MongoDB Atlas application database.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[#6B7280]">Role</span>
                <span className="font-semibold text-[#1F2937] uppercase">{mongoUser?.role || 'user'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-[#6B7280]">Database Sync</span>
                <span className="font-semibold text-[#16A34A] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1F2937]">Order History Foundation Ready</h3>
          <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
            Your sustainable purchases will be tracked here. Full checkout and order creation logic will be activated in **Module 3**.
          </p>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
