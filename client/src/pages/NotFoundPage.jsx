import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[#F8FAF8]">
      <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mb-6 shadow-xs">
        <Leaf className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#1F2937] mb-2">404</h1>
      <h2 className="text-xl font-bold text-[#1F2937] mb-3">Page Not Found</h2>
      <p className="text-xs text-[#6B7280] max-w-sm mb-8 leading-relaxed">
        The eco-path you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Home Page
      </Link>
    </div>
  );
};

export default NotFoundPage;
