import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecommendationPage from './RecommendationPage';
import AnalyticsPage from './AnalyticsPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<RecommendationPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                    </Routes>
                </main>
                <footer className="bg-white border-t border-gray-200 mt-8">
                  <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Product Recommender
                  </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;
