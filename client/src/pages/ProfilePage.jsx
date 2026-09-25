import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  LogOut, 
  ShoppingBag, 
  Heart, 
  Package, 
  ArrowRight, 
  Leaf, 
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import { getUserOrdersApi, getMyProductsApi } from '../services/api';

const getStatusBadge = (status) => {
  const styles = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const ProfilePage = () => {
  const { user, mongoUser, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist, wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.allSettled([
          getUserOrdersApi(),
          getMyProductsApi(),
        ]);

        if (ordersRes.status === 'fulfilled' && ordersRes.value?.success) {
          setOrders(ordersRes.value.orders || []);
        }
        if (productsRes.status === 'fulfilled' && productsRes.value?.success) {
          setMyProducts(productsRes.value.products || []);
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isAdmin = mongoUser?.role === 'admin';

  // Calculate Average Eco Score from purchased items in user orders
  const calculateAverageEcoScore = () => {
    if (!orders || orders.length === 0) return null;

    let totalEcoScoreSum = 0;
    let totalItemCount = 0;

    orders.forEach((order) => {
      order.items?.forEach((item) => {
        const itemScore = item.ecoScore || 85;
        totalEcoScoreSum += itemScore * item.quantity;
        totalItemCount += item.quantity;
      });
    });

    if (totalItemCount === 0) return null;
    return Math.round(totalEcoScoreSum / totalItemCount);
  };

  const averageEcoScore = calculateAverageEcoScore();
  const recentOrders = orders.slice(0, 3);
  const recentWishlist = wishlist.slice(0, 3);
  const latestPhone = orders[0]?.shippingAddress?.phone || null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-[#1B4332] to-[#2E7D32] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* User Avatar */}
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full border-4 border-white/30 object-cover shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg">
                  {(mongoUser?.name || user?.displayName || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 bg-[#8BC34A] text-[#1B4332] p-1.5 rounded-full shadow-xs">
                <Leaf className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* User Meta */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight">
                  {mongoUser?.name || user?.displayName || 'Eco Member'}
                </h1>
                <span className="bg-[#8BC34A] text-[#1B4332] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  {isAdmin ? <ShieldCheck className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                  {mongoUser?.role || 'user'}
                </span>
              </div>
              <p className="text-xs text-emerald-100 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-300" />
                {user?.email}
              </p>
              <p className="text-[11px] text-emerald-200">
                Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '2026'}
              </p>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-full transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

        </div>
      </div>

      {/* Shopping & Selling Summary Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto mb-2">
            <Package className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-[#1F2937] block">{orders.length}</span>
          <span className="text-xs font-medium text-gray-500">My Orders</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-2">
            <Heart className="w-5 h-5 fill-red-600" />
          </div>
          <span className="text-2xl font-extrabold text-[#1F2937] block">{wishlistCount}</span>
          <span className="text-xs font-medium text-gray-500">Wishlist</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto mb-2">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-[#1F2937] block">{cartCount}</span>
          <span className="text-xs font-medium text-gray-500">Basket Items</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <Tag className="w-5 h-5" />
          </div>
          <span className="text-2xl font-extrabold text-[#1F2937] block">{myProducts.length}</span>
          <span className="text-xs font-medium text-gray-500">My Products</span>
        </div>
      </div>

      {/* 🌱 GreenBasket Eco Journey Summary */}
      <div className="bg-[#E8F5E9]/60 p-6 rounded-3xl border border-[#2E7D32]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1B4332] flex items-center justify-center sm:justify-start gap-1">
              🌱 Your Green Journey
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {averageEcoScore
                ? `Your average purchase Eco Score is ${averageEcoScore} / 100.`
                : 'Your green journey starts with your first sustainable purchase 🌱'}
            </p>
          </div>
        </div>

        <span className="px-4 py-2 bg-white text-[#2E7D32] font-black text-sm rounded-full shadow-xs border border-[#2E7D32]/20 shrink-0">
          {averageEcoScore ? `${averageEcoScore} / 100 🌱` : '0 / 100 🌱'}
        </span>
      </div>

      {/* Quick Navigation Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link
          to="/shop"
          className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2E7D32] hover:shadow-md transition-all text-center space-y-1 group"
        >
          <div className="text-xl">🛍</div>
          <span className="text-[11px] font-bold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors block">
            Shop Products
          </span>
        </Link>

        <Link
          to="/orders"
          className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2E7D32] hover:shadow-md transition-all text-center space-y-1 group"
        >
          <div className="text-xl">📦</div>
          <span className="text-[11px] font-bold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors block">
            My Orders
          </span>
        </Link>

        <Link
          to="/wishlist"
          className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2E7D32] hover:shadow-md transition-all text-center space-y-1 group"
        >
          <div className="text-xl">♡</div>
          <span className="text-[11px] font-bold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors block">
            Wishlist ({wishlistCount})
          </span>
        </Link>

        <Link
          to="/cart"
          className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2E7D32] hover:shadow-md transition-all text-center space-y-1 group"
        >
          <div className="text-xl">🛒</div>
          <span className="text-[11px] font-bold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors block">
            Cart ({cartCount})
          </span>
        </Link>

        <Link
          to="/sell"
          className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2E7D32] hover:shadow-md transition-all text-center space-y-1 group"
        >
          <div className="text-xl">🌱</div>
          <span className="text-[11px] font-bold text-[#2E7D32] block">
            Sell a Product
          </span>
        </Link>

        <Link
          to="/my-products"
          className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs hover:border-[#2E7D32] hover:shadow-md transition-all text-center space-y-1 group"
        >
          <div className="text-xl">📦</div>
          <span className="text-[11px] font-bold text-[#1F2937] group-hover:text-[#2E7D32] transition-colors block">
            My Products ({myProducts.length})
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Recent Orders & Saved Wishlist */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Orders Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#1F2937]">Recent Orders</h3>
                <p className="text-[11px] text-gray-500">View your latest purchases</p>
              </div>
              <Link
                to="/orders"
                className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1"
              >
                View Orders <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingOrders ? (
              <div className="py-8 text-center text-xs text-gray-400">Loading orders...</div>
            ) : recentOrders.length === 0 ? (
              <div className="p-6 bg-[#F8FAF8] rounded-2xl text-center text-xs text-gray-500 space-y-2">
                <p>No orders placed yet.</p>
                <Link to="/shop" className="inline-block text-xs font-bold text-[#2E7D32]">
                  Explore Shop →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((ord) => (
                  <div
                    key={ord._id}
                    className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#1F2937]">
                          #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                        </span>
                        {getStatusBadge(ord.orderStatus)}
                      </div>
                      <p className="text-[11px] text-gray-500">
                        {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 0} items
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="font-extrabold text-[#1B4332] block">₹{ord.total?.toLocaleString()}</span>
                      <Link
                        to={`/orders/${ord._id}`}
                        className="text-[11px] font-semibold text-[#2E7D32] hover:underline"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Wishlist Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#1F2937]">Saved Wishlist</h3>
                <p className="text-[11px] text-gray-500">Items saved for later ({wishlistCount})</p>
              </div>
              <Link
                to="/wishlist"
                className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1"
              >
                View Wishlist <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentWishlist.length === 0 ? (
              <div className="p-6 bg-[#F8FAF8] rounded-2xl text-center text-xs text-gray-500 space-y-2">
                <p>Your wishlist is empty.</p>
                <Link to="/shop" className="inline-block text-xs font-bold text-[#2E7D32]">
                  Save Products →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recentWishlist.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  return (
                    <Link
                      key={item._id || product._id}
                      to={`/product/${product.slug || product._id}`}
                      className="p-3 bg-[#F8FAF8] rounded-2xl border border-gray-100 hover:border-[#2E7D32] transition-colors flex flex-col justify-between group"
                    >
                      <img
                        src={product.images?.[0] || '/products/product-01.jpg'}
                        alt={product.name}
                        className="w-full h-24 object-cover rounded-xl mb-2"
                      />
                      <p className="text-xs font-bold text-[#1F2937] group-hover:text-[#2E7D32] line-clamp-1">
                        {product.name}
                      </p>
                      <span className="text-xs font-extrabold text-[#1B4332] mt-1">
                        ₹{product.price?.toLocaleString()}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Clean Account Information */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-[#1F2937] border-b border-gray-100 pb-3">
              Account Information
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-[#2E7D32]" /> Name
                </span>
                <span className="font-bold text-[#1F2937]">
                  {mongoUser?.name || user?.displayName || 'Eco Member'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2E7D32]" /> Email
                </span>
                <span className="font-semibold text-[#1F2937] truncate max-w-[140px]" title={user?.email}>
                  {user?.email}
                </span>
              </div>

              {latestPhone && (
                <div className="flex items-center justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#2E7D32]" /> Phone
                  </span>
                  <span className="font-semibold text-[#1F2937]">{latestPhone}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2E7D32]" /> Member Since
                </span>
                <span className="font-semibold text-[#1F2937]">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : '2026'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#2E7D32]" /> Products Listed
                </span>
                <span className="font-semibold text-[#1F2937]">{myProducts.length} items</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-gray-500">Account Role</span>
                <span className="font-bold text-[#2E7D32] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                  {mongoUser?.role || 'user'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
