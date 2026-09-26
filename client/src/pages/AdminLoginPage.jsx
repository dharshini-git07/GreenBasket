import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import ErrorMessage from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithEmail, mongoUser, logout, refreshMongoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.error || null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Firebase
      const res = await loginWithEmail(email.trim(), password);

      if (res.success) {
        // 2. Fetch fresh MongoDB profile to check database role
        const updatedUser = await refreshMongoUser();
        
        if (updatedUser?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          // Reject normal user login on Admin portal
          await logout();
          setError('Access denied. Administrator privileges required.');
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid admin email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4332] via-[#2E7D32] to-[#0D2818] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/20 space-y-6 relative overflow-hidden">
        
        {/* Top Decorative Leaf Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-9 h-9" />
        </div>

        {/* Portal Header */}
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
            Management Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1F2937] tracking-tight">
            GreenBasket Admin
          </h1>
          <p className="text-xs text-[#6B7280]">
            Secure Administration Portal
          </p>
        </div>

        <ErrorMessage message={error} onClose={() => setError(null)} />

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block font-bold text-[#1F2937] mb-1.5">Admin Email Address *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@greenbasket.com"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1F2937] mb-1.5">Password *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:border-[#2E7D32] focus:bg-white transition-all"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#2E7D32] hover:bg-[#1B4332] text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  Admin Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

        </form>

        {/* Footer Note */}
        <div className="pt-4 border-t border-gray-100 text-center">
          <Link to="/" className="text-xs font-semibold text-gray-400 hover:text-[#2E7D32] transition-colors">
            ← Return to GreenBasket Customer Store
          </Link>
        </div>

      </div>

    </div>
  );
};

export default AdminLoginPage;
