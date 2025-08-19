'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiCode, FiClock, FiArrowLeft, FiMail, FiBell } from 'react-icons/fi';
import { FaRobot, FaCogs, FaRocket } from 'react-icons/fa';

export default function TopPicksPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [dots, setDots] = useState('');

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      // Here you would typically send the email to your backend
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-200 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/4 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-indigo-200 rounded-full opacity-40 animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-10 right-1/4 w-14 h-14 bg-pink-200 rounded-full opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/3 left-1/3 text-purple-300 opacity-30 animate-float">
          <FaCogs size={24} />
        </div>
        <div className="absolute top-1/2 right-1/3 text-blue-300 opacity-30 animate-float" style={{animationDelay: '1.5s'}}>
          <FaRocket size={20} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main Content Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-white/50">
          {/* Robot Icon with Animation */}
          <div className="mb-8 relative">
            <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <FaRobot className="text-white text-4xl sm:text-5xl animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
          </div>

          {/* Main Heading */}
          <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-gray-800 mb-4 leading-tight">
            AI Agents Page
          </h1>
          
          {/* Animated Subheading */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-purple-600 font-semibold mb-2">
              Under Development{dots}
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full animate-pulse"></div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 sm:mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm sm:text-base font-medium text-gray-700">Development Progress</span>
              <span className="text-sm sm:text-base font-bold text-purple-600">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>

          

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <FiArrowLeft size={16} />
              Back to Home
            </Link>
            
            <Link
              href="/ai-tools"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              <FiClock className="inline mr-2" />
              Explore AI Tools
            </Link>
          </div>

          {/* Estimated Time */}
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-gray-500 text-sm sm:text-base">
              Expected launch: <span className="font-semibold text-purple-600">July, 2025</span>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .animate-bounce {
            animation-duration: 2s;
          }
        }
      `}</style>
    </main>
  );
}