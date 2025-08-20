
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FiExternalLink, FiHeart, FiSearch, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ProductTool {
  _id: number;
  name: string;
  link: string;
  image_url: string;
  thumbnail_url: string;
  description: string;
  tags: string;
  created_at: string;
  is_approved: boolean;
  click_count: number;
  views: number;
  developer: string | null;
  category: string;
  submitted_by: string | null;
  overview?: string;
  key_features?: string;
  what_you_can_do_with?: string;
  benefits?: string;
  pricing_plans?: string;
  tips_best_practices?: string;
  final_take?: string;
}

interface SearchResponse {
  query: string;
  category: string | null;
  total_results: number;
  results: ProductTool[];
}

const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const storeProductData = (product: ProductTool): void => {
  if (typeof window !== 'undefined') {
    try {
      const productData = {
        id: product._id.toString(),
        name: product.name,
        thumbnail: product.thumbnail_url,
        logo: product.image_url,
        description: product.description,
        tag: product.category,
        tagIcon: '',
        link: product.link,
        overview: product.overview || '',
        key_features: product.key_features || '',
        what_you_can_do_with: product.what_you_can_do_with || '',
        benefits: product.benefits || '',
        pricing_plans: product.pricing_plans || '',
        tips_best_practices: product.tips_best_practices || '',
        final_take: product.final_take || '',
      };
      sessionStorage.setItem(
        `product_${product._id}`,
        JSON.stringify(productData)
      );
    } catch (error) {
      console.error('Error storing product data:', error);
    }
  }
};

const useFavorites = () => {
  const [favorites, setFavorites] = useState<ProductTool[]>([]);

  useEffect(() => {
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

  const addToFavorites = (tool: ProductTool) => { // Fixed: Type as ProductTool
    const updatedFavorites = [...favorites, tool];
    setFavorites(updatedFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteTools', JSON.stringify(updatedFavorites));
    }

    console.log('wait');
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
    const toolToRemove = favorites.find((tool) => tool._id === toolId);

    const updatedFavorites = favorites.filter((tool) => tool._id !== toolId);
    setFavorites(updatedFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('favoriteTools', JSON.stringify(updatedFavorites));
    }

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

  const isFavorite = (toolId: number) => {
    return favorites.some((tool) => tool._id === toolId);
  };

  const toggleFavorite = (tool: ProductTool) => { // Fixed: Changed from { id: number } to ProductTool
    if (isFavorite(tool._id)) {
      removeFromFavorites(tool._id);
    } else {
      addToFavorites(tool);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
};

interface HeartButtonProps {
  tool: ProductTool; // Fixed: Type as ProductTool
  isFavorite: boolean;
  onToggle: (tool: ProductTool) => void; // Fixed: Type as ProductTool
}

const HeartButton: React.FC<HeartButtonProps> = ({
  tool,
  isFavorite,
  onToggle,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    onToggle(tool);

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
        isAnimating ? 'animate-pulse' : ''
      } ${
        isFavorite
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <FaHeart size={18} className="drop-shadow-sm" />
      ) : (
        <FiHeart size={18} />
      )}
    </button>
  );
};

const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (query.trim()) {
      fetchSearchResults(query);
    }
  }, [query]);

  const fetchSearchResults = async (searchQuery: string) => {
    try {
      if (!searchQuery.trim()) {
        setError("Please enter a search term");
        return;
      }

      setLoading(true);
      setError(null);

      console.log("Searching for:", searchQuery);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/search?q=${encodeURIComponent(searchQuery)}`
      );

      console.log("API response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      console.log(data);
      setSearchData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while searching"
      );
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 animate-pulse"
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-24 sm:w-32 mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/5"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="h-3 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="px-3 sm:px-4 md:px-8 lg:px-16 py-6 sm:py-8 min-h-screen">
      {/* Header Section - Responsive */}
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <FiSearch className="text-xl sm:text-2xl text-[#7d42fb]" />
            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-black">
              Search Results
            </h1>
          </div>

          {/* Search Bar - Centered and Responsive */}
          <div className="flex justify-center sm:justify-end w-full sm:w-auto">
            <div className="relative flex items-center w-full max-w-md sm:max-w-lg rounded-full border-2 border-[#7d42fb] bg-white shadow-lg px-3 sm:px-4 py-2.5 sm:py-3 lg:py-4 transition-all duration-300 hover:shadow-xl hover:scale-105">
              <input
                type="text"
                placeholder="Search for AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 outline-none bg-transparent text-sm sm:text-base px-2 placeholder-gray-400 text-black"
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 sm:right-2 bg-[#7d42fb] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 rounded-full hover:bg-[#6a35d9] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Search Query Display - Responsive */}
        {query && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-base text-gray-600 px-2 sm:px-0">
            <span>Search query:</span>
            <span className="font-semibold text-[#7d42fb] bg-[#ecf2ff] px-3 py-1 rounded-full inline-block w-fit">
              "{query}"
            </span>
          </div>
        )}
      </div>

      {/* Loading State - Responsive */}
      {loading && (
        <div>
          <div className="flex justify-center items-center mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 sm:border-4 border-[#7d42fb] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-base sm:text-lg font-semibold text-gray-700">
                Searching...
              </span>
            </div>
          </div>
          <LoadingSkeleton />
        </div>
      )}

      {/* Error State - Responsive */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center h-48 sm:h-64 px-4">
          <div className="text-red-500 text-base sm:text-lg mb-3 sm:mb-4">⚠️ Search Error</div>
          <div className="text-red-600 mb-4 sm:mb-6 text-center text-sm sm:text-base">{error}</div>
          <button
            onClick={() => fetchSearchResults(query)}
            className="bg-[#7d42fb] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-[#6a35d9] transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      )}

      {/* No Query State - Responsive */}
      {!query && !loading && (
        <div className="flex flex-col items-center justify-center h-48 sm:h-64 px-4">
          <FiSearch className="text-4xl sm:text-5xl lg:text-6xl text-gray-300 mb-3 sm:mb-4" />
          <div className="text-lg sm:text-xl text-gray-500 mb-2 text-center">
            No search query provided
          </div>
          <div className="text-gray-400 text-center text-sm sm:text-base">
            Please go back and enter a search term
          </div>
        </div>
      )}

      {/* Search Results - Responsive */}
      {searchData && !loading && !error && (
        <div>
          {/* Results Summary - Responsive */}
          <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <span className="text-gray-700 text-sm sm:text-base">
                Found{' '}
                <span className="font-bold text-[#7d42fb]">
                  {searchData.total_results}
                </span>
                {searchData.total_results === 1 ? ' result' : ' results'}
              </span>
              {searchData.category && (
                <span className="bg-[#ecf2ff] px-3 py-1 rounded-full text-xs sm:text-sm text-black w-fit">
                  Category: {searchData.category}
                </span>
              )}
            </div>
          </div>

          {searchData.results.length > 0 ? (
            <section className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {searchData.results.map((tool) => (
                <Link
                  key={tool._id}
                  href={`/tool/${createSlug(tool.name)}`}
                  onClick={() => storeProductData(tool)}
                >
                  <div
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 group hover:-translate-y-1 w-full max-w-sm mx-auto h-[280px] sm:h-[320px] lg:h-[340px] flex flex-col"
                  >
                    {/* Tool Header */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4 flex-shrink-0">
                      <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#7d42fb]/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={tool.image_url}
                            alt={tool.name}
                            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 group-hover:text-[#7d42fb] transition-colors truncate">
                            {tool.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FiStar
                                  key={i}
                                  size={10}
                                  className={'text-yellow-500 fill-current'}
                                />
                              ))}
                              <span className="text-xs text-gray-500 ml-1">5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`p-1.5 sm:p-2 transition-colors flex-shrink-0 ${
                          isFavorite(tool._id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                        }`}
                        aria-label={isFavorite(tool._id) ? "Remove from favorites" : "Add to favorites"}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(tool); // Fixed: tool is now correctly typed as ProductTool
                        }}
                      >
                        {isFavorite(tool._id) ? <FaHeart size={14} /> : <FiHeart size={14} />}
                      </button>
                    </div>

                    {/* Tool Description - Flexible content area */}
                    <div className="flex-1 flex flex-col min-h-0">
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-shrink-0">
                        {tool.description}
                      </p>

                      {/* Tool Tags */}
                      <div className="flex flex-wrap gap-1 mb-3 sm:mb-4 flex-shrink-0">
                        <span className="px-2 py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full">
                          {tool.category}
                        </span>
                        <span className="px-2 py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full">
                          tag number 2
                        </span>
                        <span className="px-2 py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full">
                          tag number 3
                        </span>
                      </div>

                      {/* Pricing Badge */}
                      <div className="mb-3 sm:mb-4 flex-shrink-0">
                        <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                          Free
                        </span>
                      </div>

                      {/* Spacer to push footer to bottom */}
                      <div className="flex-1"></div>

                      {/* Footer - Always at bottom */}
                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 flex-shrink-0 mt-auto">
                        <Link
                          href={tool.link}
                          className="flex items-center gap-1 sm:gap-2 text-[#7d42fb] font-medium hover:text-[#6b35e0] transition-colors text-xs sm:text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Try Now <FiExternalLink size={12} />
                        </Link>
                        <div className="text-xs text-gray-500">#{tool._id}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </section>
          ) : (
            // No Results Found - Responsive
            <div className="flex flex-col items-center justify-center h-48 sm:h-64 px-4">
              <FiSearch className="text-4xl sm:text-5xl lg:text-6xl text-gray-300 mb-3 sm:mb-4" />
              <div className="text-lg sm:text-xl text-gray-500 mb-2 text-center">No results found</div>
              <div className="text-gray-400 text-center text-sm sm:text-base">
                Try searching with different keywords or check the spelling
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
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

        @media (min-width: 640px) {
          .line-clamp-2 {
            -webkit-line-clamp: 3;
          }
        }
      `}</style>
    </main>
  );
};

const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="px-4 md:px-16 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="w-6 h-6 border-2 border-[#7d42fb] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
