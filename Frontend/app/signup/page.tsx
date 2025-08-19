'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("trying to hit api");
      const res = await fetch('http://localhost:4000/api/user/signup', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.status === 201 || res.status === 200) {
        console.log("response 200");
        window.location.href = '/login';
      } else {
        console.log("ERROR LOGGING IN", res.status);
      }
    } 
    catch (error) {
      console.log("catch error");
    }
    setIsLoading(false);
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecf2ff] via-white to-[#f8faff] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 opacity-10">
        <Image src="/hero1.png" alt="decoration" width={100} height={90} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <Image src="/hero5.png" alt="decoration" width={120} height={80} />
      </div>
      <div className="absolute top-1/2 left-5 opacity-5">
        <Image src="/hero3.png" alt="decoration" width={80} height={40} />
      </div>

      {/* Main signup container */}
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-[#7d42fb] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join AI Tools Cover
          </h1>
          <p className="text-gray-600">
            Create your account to discover amazing AI tools
          </p>
        </div>

        {/* Signup form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform hover:shadow-3xl transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username field */}
            <div className="group">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-[#7d42fb] focus:outline-none transition-all duration-300 group-hover:border-gray-300"
                  placeholder="Enter your username"
                  required
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-[#7d42fb] focus:outline-none transition-all duration-300 group-hover:border-gray-300"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-black border-2 border-gray-200 rounded-xl focus:border-[#7d42fb] focus:outline-none transition-all duration-300 group-hover:border-gray-300"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7d42fb] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#6a35d9] focus:outline-none focus:ring-4 focus:ring-[#7d42fb]/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Navigation to login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={navigateToLogin}
                className="text-[#7d42fb] font-semibold hover:underline transition-all duration-200 hover:text-[#6a35d9]"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default SignupPage;