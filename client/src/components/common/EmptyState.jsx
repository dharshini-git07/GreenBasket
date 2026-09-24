import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = "Your basket is feeling a little empty 🌱",
  subtitle = "Add something sustainable to get started.",
  actionText = "Browse Products",
  actionLink = "/shop",
  icon: Icon = ShoppingBag
}) => {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-3xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mb-6 shadow-xs">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-[#1F2937] mb-2">{title}</h3>
      <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">{subtitle}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#2E7D32] hover:bg-[#1B4332] rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
        >
          {actionText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
