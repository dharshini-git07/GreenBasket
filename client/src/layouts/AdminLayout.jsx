import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Tag,
  UserCheck,
  LogOut,
  ShieldCheck,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
  const { mongoUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminLogout = async () => {
    try {
      await logout();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error('Admin logout failed:', err);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Orders', path: '/admin/orders', icon: Package },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Sellers', path: '/admin/sellers', icon: Tag },
    { label: 'Buyers', path: '/admin/buyers', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col md:flex-row">

      {/* Admin Sidebar / Mobile Navigation Header */}
      <aside className="w-full md:w-64 bg-[#1B4332] text-white p-4 sm:p-5 flex flex-col justify-between shrink-0 shadow-lg border-r border-[#2E7D32]/30">
        
        <div>
          {/* Top Brand Header with Mobile Hamburger Menu Toggle Button */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 md:border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white leading-tight">
                  GreenBasket Admin
                </h1>
                <span className="text-xs font-bold text-[#8BC34A] uppercase tracking-wider block">
                  Management Portal
                </span>
              </div>
            </div>

            {/* Hamburger Button for Mobile View */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none"
              aria-label="Toggle Admin Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex flex-col gap-1 mt-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${isActive
                      ? 'bg-[#2E7D32] text-white shadow-sm'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 space-y-4 border-t border-white/10 mt-3 animate-in fade-in slide-in-from-top-2">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/admin'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                          ? 'bg-[#2E7D32] text-white shadow-sm'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Logged In Info & Actions in Mobile Menu */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="px-3.5 py-2.5 bg-white/5 rounded-xl text-xs space-y-0.5">
                  <span className="text-xs text-gray-400 block">Logged in as</span>
                  <span className="font-bold text-white truncate block" title={mongoUser?.email}>
                    {mongoUser?.name || mongoUser?.email}
                  </span>
                  <span className="text-xs font-extrabold text-[#8BC34A] uppercase">
                    {mongoUser?.role}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-emerald-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors border border-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" /> Store Front
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleAdminLogout();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Desktop Admin Footer & Logout */}
        <div className="hidden md:block pt-6 border-t border-white/10 space-y-3 mt-6">
          <div className="px-3.5 py-2.5 bg-white/5 rounded-xl text-xs sm:text-sm space-y-0.5">
            <span className="text-xs text-gray-400 block">Logged in as</span>
            <span className="font-bold text-white truncate block" title={mongoUser?.email}>
              {mongoUser?.name || mongoUser?.email}
            </span>
            <span className="text-xs font-extrabold text-[#8BC34A] uppercase">
              {mongoUser?.role}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2.5 text-xs sm:text-sm text-emerald-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Store
            </Link>

            <button
              onClick={handleAdminLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs"
            >
              <LogOut className="w-4 h-4" /> Logout Admin
            </button>
          </div>
        </div>

      </aside>

      {/* Main Admin View Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
