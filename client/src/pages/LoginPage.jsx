import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import ErrorMessage from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setIsSubmitting(true);
      await googleSignIn();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Google sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#F8FAF8]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto shadow-xs">
            <Leaf className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#1F2937] tracking-tight">
            Welcome back to GreenBasket 🌱
          </h2>
          <p className="text-xs text-[#6B7280]">
            Enter your email and password to access your eco-account
          </p>
        </div>

        {/* Error Alert */}
        <ErrorMessage message={error} onClose={() => setError('')} />

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full py-3 px-4 border border-gray-200 rounded-full text-xs font-semibold text-[#1F2937] bg-white hover:bg-gray-50 transition-colors flex items-center justify-center gap-3 shadow-xs disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-gray-400 absolute uppercase">
            or email
          </span>
        </div>

        {/* Email Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-xl text-xs text-[#1F2937] focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#2E7D32] hover:bg-[#1B4332] text-white text-xs font-semibold rounded-full shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#6B7280]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#2E7D32] hover:underline">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
