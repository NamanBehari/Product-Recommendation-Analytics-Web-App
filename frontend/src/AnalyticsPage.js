import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArchiveBoxIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline';

const API_URL = 'http://127.0.0.1:8000';

const AnalyticsPage = () => {
    const [stats, setStats] = useState({ totalProducts: 0, averagePrice: 0, topBrands: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${API_URL}/products?limit=2000`);
                const products = response.data;
                const totalProducts = products.length;
                const averagePrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
                
                const brandCounts = products.reduce((acc, p) => {
                    if (p.brand) {
                      acc[p.brand] = (acc[p.brand] || 0) + 1;
                    }
                    return acc;
                }, {});

                const topBrands = Object.entries(brandCounts)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5);
                
                setStats({ totalProducts, averagePrice, topBrands });
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
      return (
        <div className="text-center py-20 text-gray-500">
          Loading analytics...
        </div>
      );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Product Analytics
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Stat Card 1: Total Products */}
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-lg p-3">
                        <ArchiveBoxIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                </div>

                {/* Stat Card 2: Average Price */}
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-start">
                    <div className="flex-shrink-0 bg-green-100 text-green-600 rounded-lg p-3">
                        <CurrencyDollarIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                        <h2 className="text-sm font-medium text-gray-500">Average Price</h2>
                        <p className="text-3xl font-bold text-gray-900">${stats.averagePrice.toFixed(2)}</p>
                    </div>
                </div>

                {/* Stat Card 3: Top 5 Brands */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-lg p-3">
                          <TagIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                          <h2 className="text-sm font-medium text-gray-500">Top 5 Brands</h2>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                        {/* THIS IS THE LINE I FIXED. The extra ')' is gone. */}
                        {stats.topBrands.map(([brand, count]) => (
                            <li key={brand} className="flex justify-between text-gray-700">
                                <span>{brand}</span>
                                <span className="font-medium">{count} products</span>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsPage;
