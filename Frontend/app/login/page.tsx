'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Declare global google object for TypeScript
declare global {
  interface Window {
    google?: any;
    googleLoginCallback?: (response: any) => void;
  }
}

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleInitialized, setGoogleInitialized] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProfileImage(localStorage.getItem('userProfileImage'));
    }

    const initializeGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1063377806790-fkgujlsl6egaatcdsr5ve6i6jt8ra3in.apps.googleusercontent.com',
            callback: handleGoogleLogin,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false, // Disable FedCM to avoid the error you're seeing
          });
          
          // Render the Google button
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            {
              theme: 'outline',
              size: 'large',
              type: 'standard',
              shape: 'rectangular',
              width: '100%',
            }
          );
          
          setGoogleInitialized(true);
          console.log('Google Sign-In initialized successfully');
        } catch (error) {
          console.error('Error initializing Google Sign-In:', error);
        }
      }
    };

    // Load Google Sign-In script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google script loaded');
        // Add small delay to ensure script is fully loaded
        setTimeout(initializeGoogleSignIn, 100);
      };
      script.onerror = (error) => {
        console.error('Error loading Google script:', error);
      };
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }

    // Set global callback for programmatic login
    window.googleLoginCallback = handleGoogleLogin;

    return () => {
      // Cleanup
      if (window.googleLoginCallback) {
        delete window.googleLoginCallback;
      }
    };
  }, []);

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/user/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        method: 'POST',
        credentials: 'include'
      });
      console.log(res)
      
      if (res.status === 200) {
        console.log("response 200");
        const data = await res.json()
        console.log("token", data.token);
        localStorage.setItem('token', data.token);
        window.location.href = '/submit';
      } else {
        console.log("ERROR LOGGING IN", res.status);
      }
    } 
    catch (error) {
      console.log("catch error");
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async (response: any) => {
    console.log("Google login callback triggered:", response);
    setIsGoogleLoading(true);
    
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      // Extract user info from the JWT token
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      console.log("Decoded user info:", payload);
      
      // Extract profile image and other user data
      const userInfo = {
        name: payload.name,
        email: payload.email,
        profileImage: payload.picture, // Google profile image URL
        sub: payload.sub, // User's Google ID
      };
      
      // Save profile image to localStorage
      localStorage.setItem('userProfileImage', userInfo.profileImage);
      localStorage.setItem('userName', userInfo.name);
      
      console.log("Sending credential to backend...");
      
      // Send the Google credential to your backend
      const res = await fetch('/api/google-login/', {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
        method: 'POST',
      });

      if (res.status === 200) {
        console.log("Google login successful");
        const data = await res.json();
        console.log("token", data.token);
        localStorage.setItem('token', data.token);
        window.location.href = '/submit';
      } else {
        console.log("ERROR WITH GOOGLE LOGIN", res.status);
        const errorData = await res.json().catch(() => ({}));
        console.log("Error details:", errorData);
        alert('Google login failed. Please try again.');
      }
    } catch (error) {
      console.log("Google login error:", error);
      alert('Google login failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleButtonClick = () => {
    console.log("Manual Google button clicked");
    if (window.google && window.google.accounts) {
      try {
        setIsGoogleLoading(true);
        // Use prompt() method to show One Tap dialog
        window.google.accounts.id.prompt((notification: any) => {
          console.log('Prompt notification:', notification);
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Prompt was not displayed or skipped');
            setIsGoogleLoading(false);
          }
        });
      } catch (error) {
        console.error('Error showing Google prompt:', error);
        setIsGoogleLoading(false);
      }
    } else {
      console.error("Google Sign-In not loaded");
      alert('Google Sign-In is not ready. Please refresh the page and try again.');
    }
  };

  const navigateToSignup = () => {
    window.location.href = '/signup';
  };

  const handleForgotPassword = () => {
    window.location.href = '/forget-password';
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

      {/* Main login container */}
      <div className="w-full max-w-md">
        {/* Logo and header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-[#7d42fb] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to access your AI tools dashboard
          </p>
        </div>

        {/* Login form */}
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
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#7d42fb] font-semibold hover:underline transition-all duration-200 hover:text-[#6a35d9]"
              >
                Forgot password?
              </button>
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
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="flex justify-center">
            {/* Google Sign-In Button Container */}
            <div className="flex justify-center">
            {/* <div className="flex flex-col space-y-2 items-center"> */}
              {/* Native Google Button (rendered by Google) */}
              <div id="google-signin-button" className="w-full"></div>

              {/* Fallback Manual Button */}
              {!googleInitialized && (
                <button
                  type="button"
                  onClick={handleGoogleButtonClick}
                  disabled={isGoogleLoading}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <svg className="animate-spin w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  Sign in with Google
                </button>
              )}
            {/* </div> */}
          </div>

          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              New here?{' '}
              <button
                onClick={navigateToSignup}
                className="text-[#7d42fb] font-semibold hover:underline transition-all duration-200 hover:text-[#6a35d9]"
              >
                Sign up first
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

export default LoginPage;