import React from 'react';
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
  Leaf
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
  const { mongoUser, logout } = useAuth();
  const navigate = useNavigate();

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

      {/* Admin Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#1B4332] text-white p-5 flex flex-col justify-between shrink-0 shadow-lg border-r border-[#2E7D32]/30">
        <div className="space-y-6">

          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                  GreenBasket Admin
                </h1>
                <span className="text-[10px] font-bold text-[#8BC34A] uppercase tracking-wider block">
                  Management Portal
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
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
        </div>

        {/* Admin Footer & Logout */}
        <div className="pt-6 border-t border-white/10 space-y-3 mt-6 md:mt-0">
          <div className="px-3 py-2 bg-white/5 rounded-xl text-xs space-y-0.5">
            <span className="text-[10px] text-gray-400 block">Logged in as</span>
            <span className="font-bold text-white truncate block" title={mongoUser?.email}>
              {mongoUser?.name || mongoUser?.email}
            </span>
            <span className="text-[9px] font-extrabold text-[#8BC34A] uppercase">
              {mongoUser?.role}
            </span>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-emerald-200 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>

          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Admin
          </button>
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
