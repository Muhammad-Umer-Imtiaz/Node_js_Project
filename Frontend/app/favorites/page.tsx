'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiExternalLink, FiHeart, FiStar, FiTrash2 } from 'react-icons/fi';
import { FaHeart, FaHeartBroken } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// Custom hook for managing favorites (same as in AllProduct)
const useFavorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Load favorites from localStorage on component mount
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favoriteTools');
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Error parsing saved favorites:', error);
          localStorage.removeItem('favoriteTools');
        }
      }
    }
  }, []);

  const addToFavorites = (tool: any) => {
    const updatedFavorites = [...favorites, tool];
    setFavorites(updatedFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteTools', JSON.stringify(updatedFavorites));
    }

    console.log('wait');
    // Show success toast
    toast.success(`${tool.name || 'Tool'} added to favorites!`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#7d42fb',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '10px 15px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    });
    console.log('added');
  };

  const removeFromFavorites = (toolId: number) => {
    // Find the tool name before removing (optional, for better UX)
    const toolToRemove = favorites.find((tool) => tool.id === toolId);

    const updatedFavorites = favorites.filter((tool) => tool.id !== toolId);
    setFavorites(updatedFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteTools', JSON.stringify(updatedFavorites));
    }

    // Show success toast
    toast.success(`${toolToRemove?.name || 'Tool'} removed from favorites!`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#7d42fb',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '10px 15px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
    });
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('favoriteTools');
    }
  };

  const isFavorite = (toolId: any) => {
    return favorites.some((tool) => tool.id === toolId);
  };

  const toggleFavorite = (tool: { id: any }) => {
    if (isFavorite(tool.id)) {
      removeFromFavorites(tool.id);
    } else {
      addToFavorites(tool);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    isFavorite,
    toggleFavorite,
  };
};

// Heart Button Component for Favorites Page
type FavoriteHeartButtonProps = {
  tool: any;
  onRemove: (id: any) => void;
};

const FavoriteHeartButton: React.FC<FavoriteHeartButtonProps> = ({
  tool,
  onRemove,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => {
      onRemove(tool.id);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-red-500 hover:text-red-600 ${
        isAnimating ? 'animate-pulse scale-75' : ''
      }`}
      aria-label="Remove from favorites"
    >
      <FaHeart size={18} className="drop-shadow-sm" />
    </button>
  );
};
// Update the ProductTool interface
interface ProductTool {
  id: number;
  name: string;
  link: string;
  image_url?: string;
  image?: string; // Add this property
  thumbnail_url?: string;
  thumbnail?: string; // Add this property
  thumnail?: string; // Add this for the typo case
  description: string;
  tags?: string;
  created_at?: string;
  is_approved?: boolean;
  click_count?: number;
  views?: number;
  developer?: string | null;
  category?: string;
  submitted_by?: string | null;
}

// Helper function to create URL-friendly slugs
const createSlug = (name: string): string => {
  console.log('I am hitteD!');

  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const storeProductData = (product: ProductTool): void => {
  if (typeof window !== 'undefined') {
    try {
      // Check all possible property names for thumbnail
      const thumbnailUrl =
        product.thumbnail_url || product.thumbnail || product.thumnail;

      console.log('Product being stored:', product); // For debugging
      console.log('Thumbnail URL:', thumbnailUrl); // For debugging

      const productData = {
        id: product.id.toString(),
        name: product.name,
        image: product.image_url || product.image,
        logo: product.image_url || product.image,
        thumbnail: thumbnailUrl,
        description: product.description,
        tag: product.category,
        tagIcon: '',
        link: product.link,
      };
      sessionStorage.setItem(
        `product_${product.id}`,
        JSON.stringify(productData)
      );
      console.log('Stored product data:', productData);
    } catch (error) {
      console.error('Error storing product data:', error);
    }
  }
};

const FavoritesPage: React.FC = () => {
  const { favorites, removeFromFavorites, clearAllFavorites, toggleFavorite } =
    useFavorites();
  const [showClearModal, setShowClearModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure localStorage is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClearAll = () => {
    clearAllFavorites();
    setShowClearModal(false);
  };

  if (isLoading) {
    return (
      <main className="px-4 sm:px-6 md:px-8 lg:px-16 min-h-screen">
        <div className="flex justify-center items-center h-64 sm:h-80">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 sm:border-4 border-[#7d42fb] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 border-2 sm:border-4 border-transparent border-b-[#7d42fb] rounded-full animate-spin animate-reverse"></div>
            </div>
            <span className="text-base sm:text-lg font-semibold text-gray-700 text-center">
              Loading your favorites...
            </span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-3 sm:px-4 md:px-8 lg:px-16 min-h-screen">
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 sm:mt-12 lg:mt-14 mb-6 sm:mb-8 lg:mb-10 px-2 sm:px-4 gap-4 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-black leading-tight">
            Your Favorite AI Tools
          </h1>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={() => setShowClearModal(true)}
            className="flex items-center justify-center gap-2 bg-[#7d42fb] text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-5 rounded-full transition-all duration-300 hover:scale-105 text-sm sm:text-base w-full sm:w-auto"
          >
            <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Content Section */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
          <FaHeartBroken className="text-gray-300 text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-600 mb-3 sm:mb-4 text-center">
            No Favorites Yet
          </h2>
          <p className="text-gray-500 text-center mb-6 sm:mb-8 max-w-md text-sm sm:text-base leading-relaxed px-2">
            Start exploring our AI tools and click the heart icon to add them to
            your favorites!
          </p>
          <Link
            href="/ai-tools"
            className="bg-[#7d42fb] text-white font-semibold py-3 sm:py-3.5 px-6 sm:px-8 rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
          >
            Explore AI Tools
          </Link>
        </div>
      ) : (
        <>
          {/* Stats - Responsive */}
          <div className="mb-6 sm:mb-8 px-2 sm:px-4">
            <p className="text-gray-600 text-base sm:text-lg">
              You have{' '}
              <span className="font-bold text-red-500">{favorites.length}</span>{' '}
              favorite tool{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Favorites Grid - Enhanced Responsive */}
          <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 px-1 sm:px-0">
            {favorites.map((tool, index) => (
              <div
                key={tool.id}
                className="group relative bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100 overflow-hidden w-full"
                style={{
                  animationName: 'fadeInUp',
                  animationDuration: '0.6s',
                  animationTimingFunction: 'ease-out',
                  animationFillMode: 'forwards',
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-3 sm:p-4 lg:p-5 xl:p-6 border border-gray-100 group hover:-translate-y-0.5 w-full h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px] xl:h-[340px] flex flex-col">
                  {/* Tool Header - Responsive */}
                  <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#7d42fb]/10 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={tool.image_url}
                          alt={tool.name}
                          className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/tool/${createSlug(tool.name)}`}
                          onClick={() => storeProductData(tool)}
                          className="block"
                        >
                          <h3 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg text-gray-900 group-hover:text-[#7d42fb] transition-colors truncate hover:text-[#7d42fb] cursor-pointer leading-tight">
                            {tool.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <FiStar
                                key={i}
                                size={8}
                                className="text-yellow-500 fill-current sm:w-2.5 sm:h-2.5"
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              5
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="p-1 sm:p-1.5 lg:p-2 text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
                      aria-label="Remove from favorites"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromFavorites(tool.id);
                      }}
                    >
                      <FaHeart size={12} className="sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                    </button>
                  </div>

                  {/* Tool Description - Responsive content area */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-shrink-0">
                      {tool.description}
                    </p>

                    {/* Tool Tags - Responsive visibility */}
                    <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full">
                        {tool.category}
                      </span>
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full hidden sm:inline-block">
                        AI Tool
                      </span>
                    </div>

                    {/* Pricing Badge - Responsive */}
                    <div className="mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
                      <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Free
                      </span>
                    </div>

                    {/* Spacer to push footer to bottom */}
                    <div className="flex-1"></div>

                    {/* Footer - Responsive */}
                    <div className="flex items-center justify-between pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100 flex-shrink-0 mt-auto">
                      <Link
                        href={tool.link}
                        className="flex items-center gap-1 sm:gap-2 text-[#7d42fb] font-medium hover:text-[#6b35e0] transition-colors text-xs sm:text-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Try Now <FiExternalLink size={10} className="sm:w-3 sm:h-3" />
                      </Link>
                      <div className="text-xs text-gray-500">#{tool.id}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Clear All Confirmation Modal - Responsive */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl mx-4">
            <div className="text-center">
              <FaHeartBroken className="text-[#7d42fb] text-4xl sm:text-5xl mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Clear All Favorites?
              </h3>
              <p className="text-gray-600 mb-5 sm:mb-6 text-sm sm:text-base leading-relaxed">
                This will remove all {favorites.length} tools from your
                favorites. This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors text-sm sm:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-2.5 bg-[#7d42fb] text-white rounded-full font-medium hover:bg-red-600 transition-colors text-sm sm:text-base order-1 sm:order-2"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .animate-reverse {
            animation-direction: reverse;
          }
        }
      `}</style>
    </main>
  );
};

export default FavoritesPage;
