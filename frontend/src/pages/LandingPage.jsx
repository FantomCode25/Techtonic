import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, Coins } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Compare Cab Prices in Real Time
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Find the best rides at the best prices. Compare fares across multiple cab services instantly.
          </p>
          <Link
            to="/signin"
            className="inline-block bg-primary-600 dark:bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
            <Car className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Multiple Providers</h3>
            <p className="text-gray-600 dark:text-gray-300">Compare prices across all major cab services in one place</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
            <Clock className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Real-Time Prices</h3>
            <p className="text-gray-600 dark:text-gray-300">Get live fare estimates and ETA for your journey</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
            <Coins className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Best Deals</h3>
            <p className="text-gray-600 dark:text-gray-300">Find the most economical option for your ride</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
            <Shield className="h-12 w-12 text-primary-600 dark:text-primary-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2 dark:text-white">Safe & Secure</h3>
            <p className="text-gray-600 dark:text-gray-300">Verified drivers and secure payment options</p>
          </div>
        </div>
      </div>
    </div>
  );
} 