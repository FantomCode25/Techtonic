import React from 'react';
import { Link } from 'react-router-dom';
import { CarTaxiFront, ShieldCheck, Hourglass, HeartHandshake } from 'lucide-react'; 

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
  className="inline-block bg-primary-600 dark:bg-primary-500 px-8 py-4 rounded-lg font-semibold border border-blue/90 hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
>
  Get Started
</Link>

        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="relative group">
            {/* Glowing border element */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 
                        bg-[radial-gradient(300px_circle_at_center,_rgba(59,130,246,0.4),_transparent)] 
                        group-hover:bg-[radial-gradient(300px_circle_at_center,_rgba(59,130,246,0.6),_transparent)]
                        blur-xl animate-glowing-shadow"></div>

            {/* Content card */}
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-transparent 
                        group-hover:border-blue-500/20 dark:group-hover:border-blue-400/30
                        hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-in-out z-10">
          <CarTaxiFront className="h-12 w-12 text-blue-500 mb-4 dark:text-primary-400" />
          <h3 className="text-xl font-semibold mb-2 dark:text-white">Multiple Providers</h3>
          <p className="text-gray-600 dark:text-gray-300">
              Compare prices across all major cab services in one place
          </p>
          </div>
          </div>
          {/* Card 1 - Real-Time Prices */}
<div className="relative group">
  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 
              bg-[radial-gradient(300px_circle_at_center,_rgba(59,130,246,0.4),_transparent)] 
              group-hover:bg-[radial-gradient(300px_circle_at_center,_rgba(59,130,246,0.6),_transparent)]
              blur-xl animate-glowing-shadow"></div>
  <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-transparent 
               group-hover:border-blue-500/20 dark:group-hover:border-blue-400/30
               hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-in-out z-10">
    <Hourglass className="h-12 w-12 text-blue-500 dark:text-primary-400 mb-4" />
    <h3 className="text-xl font-semibold mb-2 dark:text-white">Real-Time Prices</h3>
    <p className="text-gray-600 dark:text-gray-300">Get live fare estimates and ETA for your journey</p>
  </div>
</div>

{/* Card 2 - Best Deals */}
<div className="relative group">
  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 
              bg-[radial-gradient(300px_circle_at_center,_rgba(59,130,246,0.4),_transparent)] 
              group-hover:bg-[radial-gradient(300px_circle_at_center,_rgba(59,130,246,0.6),_transparent)]
              blur-xl animate-glowing-shadow"></div>
  <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-transparent 
               group-hover:border-blue-500/20 dark:group-hover:border-blue-400/30
               hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-in-out z-10">
    <HeartHandshake className="h-12 w-12 text-blue-500 dark:text-primary-400 mb-4" />
    <h3 className="text-xl font-semibold mb-2 dark:text-white">Best Deals</h3>
    <p className="text-gray-600 dark:text-gray-300">Find the most economical option for your ride</p>
  </div>
</div>

{/* Card 3 - Safe & Secure */}
<div className="relative group h-full">
  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 
              bg-[radial-gradient(300px_circle_at_center,_rgba(59,130,246,0.4),_transparent)] 
              group-hover:bg-[radial-gradient(300px_circle_at_center,_rgba(59,130,246,0.6),_transparent)]
              blur-xl animate-glowing-shadow"></div>
              
  <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-transparent 
               group-hover:border-blue-500/20 dark:group-hover:border-blue-400/30
               hover:scale-105 hover:shadow-2xl transition-all duration-500 ease-in-out z-10 h-full">
    <ShieldCheck className="h-12 w-12 text-blue-500 dark:text-primary-400 mb-4" />
    <h3 className="text-xl font-semibold mb-2 dark:text-white">Safe & Secure</h3>
    <p className="text-gray-600 dark:text-gray-300">Verified drivers and secure payment options</p>
  </div>
</div>
        </div>
      </div>
    </div>
  );
} 