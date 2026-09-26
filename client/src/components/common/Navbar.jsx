import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Search, 
  Heart, 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  LogOut,
  Sparkles,
  Info,
  Package,
  ShieldCheck
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const { user, mongoUser, logout, isAuthenticated } = useAuth();
  const { cartCount, cartMessage, dismissMessage } = useCart();
  const { wishlistCount, wishlistMessage, dismissWishlistMessage } = useWishlist();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/shop');
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserDropdownOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isAdmin = mongoUser?.role === 'admin';
  const activeMessage = cartMessage || wishlistMessage;
  const handleDismissMessage = cartMessage ? dismissMessage : dismissWishlistMessage;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      
      {/* Dynamic Toast / Notification Banner */}
      {activeMessage ? (
        <div className={`text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 animate-in fade-in ${
          activeMessage.type === 'error'
            ? 'bg-red-600 text-white'
            : activeMessage.type === 'info'
            ? 'bg-[#1B4332] text-[#8BC34A]'
            : 'bg-[#2E7D32] text-white'
        }`}>
          <Info className="w-3.5 h-3.5" />
          <span>{activeMessage.text}</span>
          <button onClick={handleDismissMessage} className="ml-2 hover:opacity-80">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Standard Top Banner Message */
        <div className="bg-[#1B4332] text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#8BC34A]" />
          <span>Every order contributes to eco-restoration. Free shipping on sustainable orders over ₹999.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white transition-all duration-300 shadow-xs">
              <Leaf className="w-6 h-6 transition-transform group-hover:rotate-12" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#1F2937] flex items-center gap-1">
                GreenBasket
                <span className="text-xs text-[#2E7D32] bg-[#E8F5E9] px-1.5 py-0.5 rounded-full font-medium">🌱</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide text-[#6B7280] -mt-0.5">
                Shop Better. Live Greener.
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search sustainable products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAF8] border border-gray-200 rounded-full text-sm text-[#1F2937] placeholder-gray-400 focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-[#1F2937]">
            <Link to="/" className="hover:text-[#2E7D32] transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-[#2E7D32] transition-colors">
              Shop
            </Link>
            <Link to="/green-guide" className="hover:text-[#2E7D32] transition-colors flex items-center gap-1 font-semibold text-[#2E7D32] bg-[#E8F5E9]/70 px-2.5 py-1 rounded-full text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" /> GreenGuide AI 🌱
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/sell" className="hover:text-[#2E7D32] transition-colors flex items-center gap-1 font-bold text-[#2E7D32]">
                  Sell 🌱
                </Link>
                <Link to="/orders" className="hover:text-[#2E7D32] transition-colors">
                  Orders
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-[#2E7D32] font-bold flex items-center gap-1 bg-[#E8F5E9] px-3 py-1 rounded-full text-xs">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Actions: Wishlist, Cart, User Account */}
          <div className="hidden md:flex items-center space-x-4 ml-6">
            <Link 
              to="/wishlist" 
              className="p-2 text-gray-600 hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-full transition-colors relative"
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              <span className={`absolute top-1 right-1 w-4 h-4 text-white text-[10px] font-bold rounded-full flex items-center justify-center ${
                wishlistCount > 0 ? 'bg-red-500' : 'bg-gray-400'
              }`}>
                {wishlistCount}
              </span>
            </Link>

            <Link 
              to="/cart" 
              className="p-2 text-gray-600 hover:text-[#2E7D32] hover:bg-[#E8F5E9] rounded-full transition-colors relative"
              title="Shopping Basket"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#2E7D32] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </Link>

            {/* Auth Dropdown / Account Link */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 border border-gray-200 rounded-full hover:border-[#2E7D32] transition-all bg-white"
                >
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="User avatar" 
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center text-xs font-bold">
                      {(mongoUser?.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[#1F2937] pr-2 max-w-[100px] truncate">
                    {mongoUser?.name || user?.displayName || 'Account'}
                  </span>
                </button>

                {/* Dropdown menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs font-bold text-[#1F2937] truncate">{mongoUser?.name || user?.displayName}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full uppercase">
                          Admin Privileges
                        </span>
                      )}
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#2E7D32] bg-[#E8F5E9]/50 hover:bg-[#E8F5E9] transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
                    >
                      <UserIcon className="w-4 h-4" />
                      Account & Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>

                    <Link
                      to="/my-products"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
                    >
                      <Leaf className="w-4 h-4" />
                      My Listed Products
                    </Link>

                    <Link
                      to="/sell"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#2E7D32] hover:bg-[#E8F5E9] transition-colors"
                    >
                      <span>🌱 Sell a Product</span>
                    </Link>

                    <Link
                      to="/cart"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-[#E8F5E9] hover:text-[#2E7D32] transition-colors"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      My Basket ({cartCount})
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-[#2E7D32] hover:bg-[#E8F5E9] rounded-full transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-[#2E7D32] hover:bg-[#E8F5E9]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-4 animate-in fade-in">
            {/* Search Bar Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative px-2">
              <input
                type="text"
                placeholder="Search sustainable products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F8FAF8] border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#2E7D32]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex flex-col space-y-2 px-2 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#E8F5E9] hover:text-[#2E7D32]"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-[#E8F5E9] hover:text-[#2E7D32]"
              >
                Shop
              </Link>
              <Link
                to="/green-guide"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-[#E8F5E9] text-[#2E7D32] font-bold flex items-center gap-1.5 text-xs"
              >
                <Sparkles className="w-4 h-4 text-[#2E7D32]" /> GreenGuide AI 🌱
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/sell"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg bg-[#E8F5E9] text-[#2E7D32] font-bold"
                  >
                    Sell on GreenBasket 🌱
                  </Link>
                  <Link
                    to="/my-products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-[#E8F5E9] hover:text-[#2E7D32]"
                  >
                    My Listed Products
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-[#E8F5E9] hover:text-[#2E7D32]"
                  >
                    My Orders
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-[#E8F5E9] text-[#2E7D32] font-bold"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-around px-2">
              <Link 
                to="/wishlist" 
                onClick={() => setMobileMenuOpen(false)} 
                className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-[#2E7D32]'}`} /> 
                Wishlist ♡ {wishlistCount}
              </Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32]">
                <ShoppingBag className="w-4 h-4 text-[#2E7D32]" /> Cart ({cartCount})
              </Link>
            </div>

            <div className="pt-2 px-2">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-[#2E7D32] rounded-xl"
                  >
                    <UserIcon className="w-4 h-4" /> Account & Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-xl"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-semibold text-[#2E7D32] border border-[#2E7D32] rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-semibold text-white bg-[#2E7D32] rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
