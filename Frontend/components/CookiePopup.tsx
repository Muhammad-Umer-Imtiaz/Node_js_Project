import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, BarChart3 } from 'lucide-react';

type PreferenceKey = 'necessary' | 'analytics' | 'marketing' | 'functional';

const CookiePopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const getCookieConsent = () => {
    if (typeof document !== 'undefined') {
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('cookie_consent='))
        ?.split('=')[1];
    }
    return null;
  };

  const setCookieConsent = (consent: string) => {
    if (typeof document !== 'undefined') {
      // Set cookie for 1 year
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `cookie_consent=${consent}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }
  };

  const handleAcceptAll = () => {
    const fullConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      timestamp: Date.now()
    };
    setCookieConsent(JSON.stringify(fullConsent));
    setIsVisible(false);
    console.log('All cookies accepted:', fullConsent);
  };

  const handleAcceptSelected = () => {
    const consent = {
      ...preferences,
      timestamp: Date.now()
    };
    setCookieConsent(JSON.stringify(consent));
    setIsVisible(false);
    
    console.log('Selected cookies accepted:', consent);
  };

  const handleRejectAll = () => {
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      timestamp: Date.now()
    };
    setCookieConsent(JSON.stringify(minimalConsent));
    setIsVisible(false);
    
    console.log('Only necessary cookies accepted:', minimalConsent);
  };

  const togglePreference = (key: PreferenceKey) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      
      {/* Popup */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto md:max-w-md z-50">
        <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5" style={{ color: '#7d42fb' }} />
              <h3 className="font-semibold text-gray-900">Cookie Settings</h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
              Choose which cookies you'd like to accept.
            </p>

            {!showDetails ? (
              /* Simple View */
              <div className="space-y-3">
                <button
                  onClick={() => setShowDetails(true)}
                  className="text-sm underline hover:no-underline transition-all"
                  style={{ color: '#7d42fb' }}
                >
                  Customize Settings
                </button>
              </div>
            ) : (
              /* Detailed View */
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {/* Necessary Cookies */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-gray-900">Necessary</h4>
                      <div className="w-8 h-4 bg-green-500 rounded-full flex items-center justify-end px-0.5">
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Essential for website functionality and security. Always active.
                    </p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <BarChart3 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-gray-900">Analytics</h4>
                      <button
                        onClick={() => togglePreference('analytics')}
                        className={`w-8 h-4 rounded-full flex items-center transition-colors ${
                          preferences.analytics ? 'bg-purple-500 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                        style={preferences.analytics ? { backgroundColor: '#7d42fb' } : {}}
                      >
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm mx-0.5"></div>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Help us understand how visitors interact with our website.
                    </p>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 mt-0.5 bg-orange-500 rounded flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-gray-900">Marketing</h4>
                      <button
                        onClick={() => togglePreference('marketing')}
                        className={`w-8 h-4 rounded-full flex items-center transition-colors ${
                          preferences.marketing ? 'bg-purple-500 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                        style={preferences.marketing ? { backgroundColor: '#7d42fb' } : {}}
                      >
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm mx-0.5"></div>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Used to deliver relevant advertisements and track ad performance.
                    </p>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-4 h-4 mt-0.5 bg-indigo-500 rounded flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-gray-900">Functional</h4>
                      <button
                        onClick={() => togglePreference('functional')}
                        className={`w-8 h-4 rounded-full flex items-center transition-colors ${
                          preferences.functional ? 'bg-purple-500 justify-end' : 'bg-gray-300 justify-start'
                        }`}
                        style={preferences.functional ? { backgroundColor: '#7d42fb' } : {}}
                      >
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm mx-0.5"></div>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Remember your preferences and enhance user experience.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
            {showDetails ? (
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#7d42fb' }}
                >
                  Save Preferences
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 rounded-lg font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: '#7d42fb' }}
                >
                  Accept All
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 rounded-lg font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Reject All
                </button>
              </div>
            )}
            
            <p className="text-xs text-gray-500 text-center">
              You can change your preferences anytime in settings
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePopup;