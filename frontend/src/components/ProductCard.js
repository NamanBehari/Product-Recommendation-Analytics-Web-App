import React from 'react';

export default function ProductCard({ product }) {
  // Use placeholder if image is missing
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://via.placeholder.com/300x300.png?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
      <img
        src={imageUrl}
        alt={product.title}
        className="w-full h-56 object-cover"
      />
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.title}>
          {product.title}
        </h3>
        
        <div className="flex justify-between items-center mt-3">
          <p className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
        </div>
        
        <button className="mt-4 w-full bg-blue-100 text-blue-700 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors">
          View Item
        </button>
      </div>
    </div>
  );
}
