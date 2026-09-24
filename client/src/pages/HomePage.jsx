import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Leaf, 
  Recycle, 
  Bot, 
  ChevronRight,
  Sun,
  Coffee,
  ShieldCheck,
  Zap,
  HeartHandshake
} from 'lucide-react';
import { getFeaturedProductsApi } from '../services/api';
import ProductCard from '../components/products/ProductCard';
import ProductSkeleton from '../components/products/ProductSkeleton';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedProductsApi();
        if (data.success) {
          setFeaturedProducts(data.products || []);
        }
      } catch (err) {
        console.error('[HomePage Featured Error]:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#E8F5E9]/60 via-[#F8FAF8] to-[#F8FAF8] pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Certified Sustainable E-Commerce</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1F2937] leading-tight">
                Shop Better. <br />
                <span className="text-[#2E7D32] relative">
                  Live Greener.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#8BC34A]/40" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="6" />
                  </svg>
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B7280] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Discover sustainable products designed for a better everyday lifestyle.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Shop Sustainable Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/shop?category=Organic"
                  className="w-full sm:w-auto px-7 py-4 text-sm font-semibold text-[#1F2937] bg-white border border-gray-200 hover:border-[#2E7D32] hover:bg-[#E8F5E9]/50 rounded-full transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Explore Categories
                </Link>
              </div>

              {/* Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-gray-200/60 max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <p className="text-lg font-bold text-[#1F2937]">100%</p>
                  <p className="text-xs text-[#6B7280]">Plastic Free</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-lg font-bold text-[#1F2937]">🌱 90+</p>
                  <p className="text-xs text-[#6B7280]">Eco Score Avg</p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-lg font-bold text-[#1F2937]">Carbon 0</p>
                  <p className="text-xs text-[#6B7280]">Shipping Offset</p>
                </div>
              </div>
            </div>

            {/* Visual Hero Feature Card */}
            <div className="relative">
              <div className="w-full h-80 sm:h-96 lg:h-[420px] rounded-3xl bg-gradient-to-tr from-[#1B4332] to-[#2E7D32] p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#8BC34A_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide">
                    🌱 Eco Score 96/100
                  </span>
                  <span className="text-xs text-[#8BC34A] font-semibold bg-black/20 px-3 py-1 rounded-full">
                    Zero Waste Approved
                  </span>
                </div>

                <div className="relative z-10 space-y-2">
                  <p className="text-xs font-semibold text-[#8BC34A] uppercase tracking-wider">Eco Spotlight</p>
                  <h3 className="text-2xl font-bold">Bamboo Cutlery & Straw Dining Kit</h3>
                  <p className="text-xs text-emerald-100 max-w-sm">
                    Handcrafted organic bamboo cutlery kit designed for zero-waste dining on the go.
                  </p>
                </div>

                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/20">
                  <div>
                    <span className="text-xs text-emerald-200 block">Price</span>
                    <span className="text-xl font-bold">₹899</span>
                  </div>
                  <Link
                    to="/shop?category=Reusable"
                    className="px-5 py-2.5 bg-white text-[#1B4332] hover:bg-[#E8F5E9] font-semibold rounded-full text-xs transition-all shadow-sm"
                  >
                    View Collection
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Curated Collections</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mt-1">Shop by Sustainable Category</h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-[#2E7D32] hover:underline flex items-center gap-1 mt-2 md:mt-0">
            All Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Organic', categoryParam: 'Organic', icon: Leaf, desc: '100% natural & certified', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            { title: 'Reusable', categoryParam: 'Reusable', icon: Coffee, desc: 'Zero single-use plastic', color: 'bg-amber-50 text-amber-700 border-amber-200' },
            { title: 'Energy Saving', categoryParam: 'Energy Saving', icon: Sun, desc: 'Solar & high-efficiency', color: 'bg-blue-50 text-blue-700 border-blue-200' },
            { title: 'Plastic-Free', categoryParam: 'Plastic-Free', icon: Recycle, desc: 'Compostable packaging', color: 'bg-teal-50 text-teal-700 border-teal-200' },
          ].map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/shop?category=${cat.categoryParam}`)}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between h-44 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#1F2937] group-hover:text-[#2E7D32] transition-colors">{cat.title}</h3>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DYNAMIC FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">Verified Eco Catalog</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mt-1">Featured Sustainable Products</h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold text-[#2E7D32] hover:underline flex items-center gap-1 mt-2 md:mt-0">
            View All Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductSkeleton count={4} />
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-2xl border border-gray-100">
            <p className="text-xs text-gray-500">Catalog connected. Explore all items in the shop.</p>
            <Link to="/shop" className="text-xs font-bold text-[#2E7D32] hover:underline mt-2 inline-block">
              Browse Full Shop →
            </Link>
          </div>
        )}
      </section>

      {/* GREENGUIDE AI PREVIEW BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#1B4332] via-[#2E7D32] to-[#1B4332] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-[#8BC34A]">
              <Bot className="w-4 h-4" />
              <span>Meet GreenGuide AI 🌱</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold leading-tight">
              Your personal sustainable shopping assistant.
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Ask natural queries like <span className="font-semibold italic text-white font-mono bg-black/20 px-2 py-0.5 rounded">"I need reusable kitchen products under ₹1500"</span> and get intelligent, grounded recommendations directly from our eco-catalog.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 rounded-full transition-all cursor-default">
                AI Engine Activating in Module 4
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
