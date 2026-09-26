import React from 'react';

export const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl border border-gray-100 p-2.5 sm:p-4 space-y-3 animate-pulse">
          <div className="w-full h-32 sm:h-48 bg-gray-100 rounded-xl" />
          <div className="space-y-2">
            <div className="w-16 h-3.5 bg-gray-100 rounded-md" />
            <div className="w-3/4 h-4 bg-gray-100 rounded-md" />
            <div className="w-full h-3 bg-gray-100 rounded-md" />
          </div>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="w-12 h-5 bg-gray-100 rounded-md" />
            <div className="w-16 h-6 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
