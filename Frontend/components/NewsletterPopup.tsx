import React, { useState, useEffect } from 'react';
import { X, Mail, Gift, Sparkles, ArrowRight, Bot, Zap, Star } from 'lucide-react';

const NewsletterPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already subscribed
    const hasSubscribed = getNewsletterStatus() === 'subscribed';
    if (hasSubscribed) return;
    
    // Show popup after 5 seconds regardless of previous dismissals
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const getNewsletterStatus = () => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('newsletter_status');
    }
    return null;
  };

  const setNewsletterStatus = (status: string) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('newsletter_status', status);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      // Only set dismissed status, don't prevent future shows
      setNewsletterStatus('dismissed');
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call - replace with your actual newsletter signup logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically call your newsletter API
      console.log('Subscribing email:', email);
      
      setIsSuccess(true);
      // Only mark as subscribed when user actually subscribes
      setNewsletterStatus('subscribed');
      
      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 2500);
      
    } catch (error) {
      console.error('Newsletter signup failed:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with close button */}
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all z-10 group"
          >
            <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
          </button>
          
          {/* Background gradient */}
          <div 
            className="h-32 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7d42fb 0%, #a855f7 100%)' }}
          >
            <div className="absolute inset-0 bg-white/10">
              <div className="absolute top-4 left-4">
                <Bot className="w-8 h-8 text-white/80 animate-pulse" />
              </div>
              <div className="absolute bottom-4 right-8">
                <Zap className="w-6 h-6 text-white/60" />
              </div>
              <div className="absolute top-8 right-16">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <div className="absolute bottom-8 left-16">
                <div className="w-1 h-1 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
              <div className="absolute top-12 left-20">
                <Star className="w-4 h-4 text-white/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 -mt-8 relative">
          {/* Icon */}
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ backgroundColor: '#7d42fb' }}
          >
            <Bot className="w-8 h-8 text-white" />
          </div>

          {!isSuccess ? (
            <>
              {/* Heading */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Discover the Latest AI Tools! 🤖
              </h2>
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                Stay ahead of the AI revolution! Get weekly updates on the newest AI tools, 
                comprehensive reviews, and exclusive insights delivered to your inbox.
              </p>

              {/* Benefits */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7d42fb' }}></div>
                  <span>Latest AI tool discoveries & reviews</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7d42fb' }}></div>
                  <span>Early access to premium AI resources</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7d42fb' }}></div>
                  <span>AI productivity tips & tutorials</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7d42fb' }}></div>
                  <span>Exclusive deals on AI software</span>
                </div>
              </div>

              {/* Email Input and Button */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    style={{color: 'black'}}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7d42fb40] focus:border-transparent pr-12 transition-all"
                    disabled={isLoading}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e as any);
                      }
                    }}
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#7d42fb' }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Get AI Updates
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Join 10,000+ AI enthusiasts. Unsubscribe anytime.
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#10b981' }}
              >
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to the AI Community! 🎉
              </h3>
              <p className="text-gray-600 mb-4">
                You're now subscribed to our AI tools newsletter! Check your email for a welcome message with exclusive resources.
              </p>
              <div className="text-sm text-gray-500">
                This popup will close automatically...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;