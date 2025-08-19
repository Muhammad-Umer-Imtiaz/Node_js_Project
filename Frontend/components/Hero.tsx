'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .hero-section {
          animation: slideInFromTop 0.8s ease-out;
        }

        .search-block {
          animation: fadeInScale 1s ease-out 0.3s both;
        }

        .decorative-image {
          animation: fadeInScale 1.2s ease-out 0.6s both;
        }

        .main-heading {
          animation: slideInFromTop 0.8s ease-out 0.2s both;
        }

        .description {
          animation: slideInFromTop 0.8s ease-out 0.4s both;
        }



        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(125, 66, 251, 0.3); }
          50% { box-shadow: 0 0 20px rgba(125, 66, 251, 0.6), 0 0 30px rgba(125, 66, 251, 0.4); }
        }

        .company-logo:hover {
          animation: float 2s ease-in-out infinite, 2s ease-in-out infinite;
        }

        @keyframes shimmerBackground {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }

        .sponsored-banner:hover {
          background-size: 200% 100%;
        }

        /* Mobile-specific adjustments */
        @media (max-width: 768px) {
          .decorative-image {
            display: none;
          }
        }
      `}</style>

      <section className={`relative flex justify-center w-full min-h-[470px] h-auto bg-[#ecf2ff] hero-section ${isLoaded ? 'loaded' : ''}`}>        {/* Decorative Images - Desktop Only */}
        <div className="hidden lg:flex absolute flex-col space-y-10 justify-center top-[20%] left-[5%]">
          <div className="decorative-image">
            <Image src="/hero1.png" alt="hero" width={125} height={109} />
          </div>
          <div className="decorative-image" style={{ animationDelay: '0.8s' }}>
            <Image src="/hero2.png" alt="hero" width={43} height={41} />
          </div>
        </div>
        
        <div className="hidden lg:flex absolute flex-col space-y-10 justify-center top-[35%] left-[15%]">
          <div className="decorative-image" style={{ animationDelay: '0.7s' }}>
            <Image src="/hero4.png" alt="hero" width={61} height={19} />
          </div>
          <div className="decorative-image" style={{ animationDelay: '0.9s' }}>
            <Image src="/hero3.png" alt="hero" width={130} height={65} />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col items-center justify-center mt-5 space-y-6 py-8 lg:py-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-4 leading-tight text-center main-heading">
            <span className="block">Discover the Top AI tools</span>
            <span className="block">with AI Tools Cover!</span>
          </h1>

          {/* <p className="text-[#272729] font-semibold max-w-2xl text-sm sm:text-base lg:text-lg mb-8 text-center description px-4 lg:px-0">
            Your gateway to the finest AI tools, meticulously organized
            <span className="block">
              and categorized for easy access.
            </span>
          </p> */}

          <div className="relative flex items-center w-[320px] max-w-lg rounded-full border-2 border-[#7d42fb] bg-white shadow-lg px-4 py-3 lg:py-4 search-block transform hover:shadow-xl hover:scale-105 transition-all duration-300 mt-5">
            <input
              type="text"
              placeholder="Search for AI tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 outline-none bg-transparent text-sm lg:text-base px-2 placeholder-gray-400 text-black"
            />
            <button 
              onClick={handleSearch}
              className="absolute bg-[#7d42fb] right-[2%] text-white text-xs sm:text-sm lg:text-base font-semibold px-4 sm:px-6 py-2 lg:py-2.5 rounded-full hover:bg-[#6a35d9] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
            >
              Search
            </button>
          </div>

          {/* Call to Action */}
          <div className="text-center mb-0">
            <a title="All The Best AI Tools" style={{color: 'black'}} href="https://allinai.tools">All in AI Tools</a>
          </div>

          {/* Sponsored Banner - Compact Version */}
          <div className="w-full max-w-2xl px-4 mt-5">
            <div className="relative p-3 transition-all duration-300 overflow-hidden">
              <div className="text-center mb-2">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sponsored by
                </h3>
              </div>
              
              {/* Compact Company Logos */}
              <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 relative z-10">
                {/* Company 1 */}
                <div className="group flex flex-col items-center transition-all duration-300 hover:scale-105 cursor-pointer company-logo">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                    <span className="text-white font-bold text-xs md:text-sm">AI</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-purple-600 transition-colors">
                    TechCorp
                  </span>
                </div>

                {/* Company 2 */}
                <div className="group flex flex-col items-center transition-all duration-300 hover:scale-105 cursor-pointer company-logo">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                    <span className="text-white font-bold text-xs md:text-sm">IN</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-teal-600 transition-colors">
                    InnovateAI
                  </span>
                </div>

                {/* Company 3 */}
                <div className="group flex flex-col items-center transition-all duration-300 hover:scale-105 cursor-pointer company-logo">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                    <span className="text-white font-bold text-xs md:text-sm">FU</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-red-600 transition-colors">
                    FutureTech
                  </span>
                </div>

                {/* Company 4 */}
                <div className="group flex flex-col items-center transition-all duration-300 hover:scale-105 cursor-pointer company-logo">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                    <span className="text-white font-bold text-xs md:text-sm">SM</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-pink-600 transition-colors">
                    SmartMind
                  </span>
                </div>

                {/* Company 5 */}
                <div className="group flex flex-col items-center transition-all duration-300 hover:scale-105 cursor-pointer company-logo">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                    <span className="text-white font-bold text-xs md:text-sm">NX</span>
                  </div>
                  <span className="text-xs font-medium text-gray-600 mt-1 group-hover:text-indigo-600 transition-colors">
                    NextGen
                  </span>
                </div>
              </div>

              {/* Subtle Background Elements */}
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-200 rounded-full opacity-40 animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-200 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Decorative Images - Desktop Only */}
        <div className="hidden lg:flex absolute flex-col space-y-10 justify-center top-[25%] right-[5%]">
          <div className="decorative-image" style={{ animationDelay: '0.8s' }}>
            <Image src="/hero4.png" alt="hero" width={61} height={19} />
          </div>
          <div className="decorative-image" style={{ animationDelay: '1.0s' }}>
            <Image src="/hero5.png" alt="hero" width={175} height={108} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;