'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Replace with your API endpoint
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/user/forget-password`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        method: 'POST',
        credentials: 'include'
      });

      if (res.status === 200) {
        const data = await res.json();
        alert('Password reset link sent to your email!');
        // Optionally redirect or clear form
        setEmail('');
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || 'Error sending reset link. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ecf2ff] via-white to-[#f8faff] flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 opacity-10">
        <Image src="/hero2.png" alt="decoration" width={60} height={55} />
      </div>
      <div className="absolute bottom-10 left-10 opacity-10">
        <Image src="/hero4.png" alt="decoration" width={80} height={25} />
      </div>
      <div className="absolute top-1/3 right-5 opacity-5">
        <Image src="/hero1.png" alt="decoration" width={90} height={80} />
      </div>

      {/* Main forgot password container */}
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-[#7d42fb] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        {/* Forgot password form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 transform hover:shadow-3xl transition-all duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
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
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <button
                onClick={navigateToLogin}
                className="text-[#7d42fb] font-semibold hover:underline transition-all duration-200 hover:text-[#6a35d9]"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © 2024 AI Tools Cover. All rights reserved.
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

export default ForgotPasswordPage;