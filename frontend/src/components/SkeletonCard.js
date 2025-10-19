import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-56 bg-gray-300"></div>
      
      <div className="p-5">
        {/* Title Placeholder */}
        <div className="h-5 bg-gray-300 rounded-md w-3/4"></div>
        
        <div className="flex justify-between items-center mt-4">
          {/* Price Placeholder */}
          <div className="h-6 bg-gray-300 rounded-md w-1/4"></div>
        </div>
        
        {/* Button Placeholder */}
        <div className="mt-4 w-full h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}
