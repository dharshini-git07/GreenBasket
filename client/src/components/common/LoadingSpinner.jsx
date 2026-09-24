import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-[#2E7D32] animate-spin`} />
    </div>
  );
};

export const LoadingPage = ({ message = 'Loading GreenBasket...' }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-[#F8FAF8]">
      <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32] mb-4 shadow-xs animate-bounce">
        🌱
      </div>
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm font-medium text-[#6B7280]">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
