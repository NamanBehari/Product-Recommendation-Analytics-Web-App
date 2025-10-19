// src/components/Navbar.js
import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Link, useLocation } from 'react-router-dom';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const location = useLocation();
  const navigation = [
    { name: 'Recommendations', href: '/' },
    { name: 'Analytics', href: '/analytics' },
  ];

  return (
    // Add a slight border at the bottom
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {/* CHANGED: blue -> indigo */}
            <SparklesIcon className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">Reco</span>
          </div>
          <div className="flex space-x-8"> {/* Increased spacing */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={classNames(
                  // Added smooth transition
                  'font-medium text-lg transition-colors duration-200',
                  location.pathname === item.href
                    ? 'text-indigo-600' // CHANGED: blue -> indigo
                    : 'text-gray-500 hover:text-indigo-600' // CHANGED: blue -> indigo
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
