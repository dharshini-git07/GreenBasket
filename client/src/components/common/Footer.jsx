import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, ShieldCheck, RefreshCw, Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1B4332] text-white pt-16 pb-12 border-t border-[#2E7D32]/30">
      {/* Sustainability Value Proposition Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-[#2E7D32]/40 rounded-2xl border border-[#8BC34A]/20 backdrop-blur-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#8BC34A]/20 text-[#8BC34A] flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Eco-Verified</h4>
              <p className="text-xs text-gray-300">Transparent sustainability scores on all products.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#8BC34A]/20 text-[#8BC34A] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Carbon Neutral Shipping</h4>
              <p className="text-xs text-gray-300">Offsetting emissions for every delivery nationwide.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#8BC34A]/20 text-[#8BC34A] flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Zero Plastic Packaging</h4>
              <p className="text-xs text-gray-300">100% biodegradable and recycled package materials.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white">
                GreenBasket 🌱
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#8BC34A]">
              Shop Better. Live Greener.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              Curated marketplace for certified sustainable, ethical, and eco-friendly products for conscious living.
            </p>
          </div>

          {/* Useful Quick Links */}
          <div className="col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8BC34A] mb-3 sm:mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Customer & Policy Links */}
          <div className="col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8BC34A] mb-3 sm:mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">My Account</Link>
              </li>
            </ul>
          </div>

          {/* Sustainability Message */}
          <div className="space-y-3 col-span-2 md:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8BC34A] mb-2 sm:mb-4">
              Our Mission
            </h3>
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#2E7D32]/30 border border-[#2E7D32]">
              <p className="text-xs italic text-gray-200 font-medium">
                "Small choices. Meaningful impact."
              </p>
              <p className="text-[11px] text-gray-300 mt-1.5">
                Every conscious purchase protects ecosystems and supports ethical artisans globally.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-700/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} GreenBasket. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-emerald-400 inline" /> for a greener planet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
