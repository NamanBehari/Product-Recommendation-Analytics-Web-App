import React, { useState } from 'react';
import axios from 'axios';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'; // <-- Import icon

// IMPORT your new components
import ProductCard from './components/ProductCard';
import SkeletonCard from './components/SkeletonCard';

const API_URL = 'http://127.0.0.1:8000';

const RecommendationPage = () => {
    // --- Your existing logic (unchanged) ---
    const [productTitle, setProductTitle] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = async (e) => {
        e.preventDefault();
        if (!productTitle) return;

        setLoading(true);
        setError('');
        setRecommendations([]);

        try {
            const response = await axios.post(`${API_URL}/recommendations`, {
                title: productTitle,
                num_recommendations: 5,
            });
            setRecommendations(response.data);
        } catch (err) {
            setError('Product not found or an error occurred. Try another title.');
        } finally {
            setLoading(false);
        }
    };
    // --- End of your logic ---


    // --- This ENTIRE 'return' block is replaced with the new UI ---
    return (
        <div>
            {/* 1. The main search card, styled with Tailwind */}
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Product Recommender
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Enter a product title to get similar items.
                </p>

                {/* 2. Your form, now styled */}
                <form onSubmit={fetchRecommendations} className="flex space-x-3">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={productTitle}
                            onChange={(e) => setProductTitle(e.target.value)}
                            disabled={loading}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            placeholder="e.g., goymfk 1pc free standing shoe rack"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            'Get Recommendations'
                        )}
                    </button>
                </form>
            </div>

            {/* 3. The Results Section */}
            <div className="mt-12">
                {/* 4. Display a styled error message */}
                {error && (
                    <div className="text-center mb-6 text-red-600 font-medium p-4 bg-red-50 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                {/* 5. The advanced Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        // Use your new SkeletonCard
                        Array.from({ length: 5 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))
                    ) : (
                        // Use your new ProductCard
                        recommendations.map((product) => (
                            <ProductCard key={product.uniq_id} product={product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationPage;
