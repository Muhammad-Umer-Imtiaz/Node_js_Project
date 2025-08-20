
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiExternalLink, FiHeart, FiStar } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { featuredProducts } from '@/constants';
import toast from 'react-hot-toast';
import ScrollButton from './ScrollButton';
import { Award } from 'lucide-react';

const shimmerStyles = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
  }
  .animate-reverse {
    animation-direction: reverse;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = shimmerStyles;
  document.head.appendChild(styleSheet);
}

interface ProductTool {
  _id: number;
  name: string;
  link: string;
  image_url: string;
  thumbnail_url: string;
  description: string;
  overview?: string;
  tags: string;
  created_at: string;
  is_approved: boolean;
  click_count: number;
  views: number;
  developer: string | null;
  category: string;
  submitted_by: string | null;
  key_features?: string;
  what_you_can_do_with?: string;
  benefits?: string;
  pricing_plans?: string;
  tips_best_practices?: string;
  final_take?: string;
}

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

  const addToFavorites = (tool: ProductTool) => {
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
    const toolToRemove = favorites.find((tool) => tool._id === toolId);

    const updatedFavorites = favorites.filter((tool) => tool._id !== toolId);
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

  const isFavorite = (toolId: number) => {
    return favorites.some((tool) => tool._id === toolId);
  };

  const toggleFavorite = (tool: ProductTool) => {
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

// Heart Button Component
interface HeartButtonProps {
  tool: ProductTool;
  isFavorite: boolean;
  onToggle: (tool: ProductTool) => void;
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

// Helper function to create URL-friendly slugs
const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Helper function to store product data in sessionStorage
const storeProductData = (product: ProductTool): void => {
  if (typeof window !== 'undefined') {
    try {
      const productData = {
        id: product._id.toString(),
        name: product.name,
        image: product.image_url,
        thumbnail: product.thumbnail_url,
        overview: product.overview || '',
        logo: product.image_url,
        description: product.description,
        tag: product.category,
        tagIcon: '',
        link: product.link,
        key_features: product.key_features || '',
        what_you_can_do_with: product.what_you_can_do_with || '',
        benefits: product.benefits || '',
        pricing_plans: product.pricing_plans || '',
        tips_best_practices: product.tips_best_practices || '',
        final_take: product.final_take || '',
      };
      console.log(product._id);
      sessionStorage.setItem(
        `product_${product._id}`,
        JSON.stringify(productData)
      );
    } catch (error) {
      console.error('Error storing product data:', error);
    }
  }
};

const AllProduct: React.FC = () => {
  const [displayedProducts, setDisplayedProducts] = useState<ProductTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const PRODUCTS_PER_LOAD = 18;
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProducts = sessionStorage.getItem('displayedProducts');
      const savedOffset = sessionStorage.getItem('currentOffset');
      const savedTimestamp = sessionStorage.getItem('productsTimestamp');
      const savedHasMore = sessionStorage.getItem('hasMoreProducts');

      const isDataFresh =
        savedTimestamp && Date.now() - parseInt(savedTimestamp) < 5 * 60 * 1000; // 5 minutes

      if (savedProducts && savedOffset && isDataFresh) {
        try {
          const parsedProducts = JSON.parse(savedProducts);
          setDisplayedProducts(parsedProducts);
          setCurrentOffset(parseInt(savedOffset));
          setHasMoreProducts(savedHasMore === 'true');
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing saved data:', error);
          clearCachedData();
        }
      }
    }
    fetchInitialProducts();
  }, []);

  // Save to cache whenever displayedProducts or currentOffset changes
  useEffect(() => {
    if (typeof window !== 'undefined' && displayedProducts.length > 0) {
      try {
        sessionStorage.setItem(
          'displayedProducts',
          JSON.stringify(displayedProducts)
        );
        sessionStorage.setItem('currentOffset', currentOffset.toString());
        sessionStorage.setItem('productsTimestamp', Date.now().toString());
        sessionStorage.setItem('hasMoreProducts', hasMoreProducts.toString());
      } catch (error) {
        console.error(
          'SessionStorage quota exceeded, clearing old data:',
          error
        );
        clearCachedData();
      }
    }
  }, [displayedProducts, currentOffset, hasMoreProducts]);

  const clearCachedData = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('displayedProducts');
      sessionStorage.removeItem('currentOffset');
      sessionStorage.removeItem('productsTimestamp');
      sessionStorage.removeItem('hasMoreProducts');
    }
  };

  const fetchInitialProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/pagination?limit=${PRODUCTS_PER_LOAD}&offset=0`
      );
      console.log('Fetching initial products...');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const products: ProductTool[] = data.results || [];
      setDisplayedProducts(products);
      setCurrentOffset(PRODUCTS_PER_LOAD);

      // If we got less than requested, we've reached the end
      setHasMoreProducts(products.length === PRODUCTS_PER_LOAD);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching products'
      );
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreProducts) return;

    setLoadingMore(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/pagination?limit=${PRODUCTS_PER_LOAD}&offset=${currentOffset}`
      );
      console.log(response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const newProducts: ProductTool[] = data.results || [];

      console.log('Pagination API Data:', newProducts);
      // Add new products to existing ones
      setDisplayedProducts((prev) => [...prev, ...newProducts]);
      setCurrentOffset((prev) => prev + PRODUCTS_PER_LOAD);

      // If we got less than requested, we've reached the end
      if (newProducts.length < PRODUCTS_PER_LOAD) {
        setHasMoreProducts(false);
      }

      console.log(
        `Loaded ${newProducts.length} more products. Total: ${
          displayedProducts.length + newProducts.length
        }`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while loading more products'
      );
      console.error('Error loading more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <main className="px-4 md:px-16">
        <h1 className="font-bold text-4xl mt-14 mb-10 px-4 text-black">
          Featured Tools
        </h1>

        {/* Modern Loading Animation */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-[#ff9e2c] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-b-[#7d42fb] rounded-full animate-spin animate-reverse"></div>
            </div>
            <span className="text-lg font-semibold text-gray-700">
              Loading amazing tools...
            </span>
          </div>
        </div>

        {/* Skeleton Loading Cards */}
        <section className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-0">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="w-full max-w-sm h-[500px] border border-gray-200 rounded-3xl mx-auto animate-pulse"
            >
              {/* Skeleton Image */}
              <div className="h-[240px] rounded-t-3xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>

              {/* Skeleton Content */}
              <div className="px-4 mt-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-[50px] h-[50px] rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
                </div>

                {/* Skeleton Description */}
                <div className="space-y-2 mb-5">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/5 animate-pulse"></div>
                </div>

                {/* Skeleton Tags */}
                <div className="flex gap-3 items-center">
                  <div className="w-[30px] h-[30px] rounded bg-gray-200 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 md:px-16">
        <h1 className="font-bold text-4xl mt-14 mb-10 px-4 text-black">
          Featured Tools
        </h1>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="text-lg text-red-600">Error: {error}</div>
          <button
            onClick={() => {
              setError(null);
              clearCachedData();
              fetchInitialProducts();
            }}
            className="bg-[#7d42fb] hover:bg-[#572eaf] text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 md:px-16">
      <h1 className="font-bold text-4xl mt-14 mb-10 px-4 text-black">
        Featured Tools
      </h1>
      <section className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-2 sm:px-0">
        {featuredProducts.map((tool) => (
          <Link key={tool.id} href={`/products/${createSlug(tool.name)}`}>
            <div
              key={tool.id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-3 sm:p-4 lg:p-6 border border-gray-100 group hover:-translate-y-1 w-full mx-auto h-[280px] sm:h-[300px] lg:h-[340px] flex flex-col"
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#7d42fb]/10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={tool.logo}
                      alt={tool.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm lg:text-base xl:text-lg text-gray-900 group-hover:text-[#7d42fb] transition-colors truncate">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            size={8}
                            className={'text-yellow-500 fill-current'}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">5</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className={`p-1 sm:p-1.5 lg:p-2 transition-colors flex-shrink-0 ${
                    isFavorite(Number(tool.id))
                      ? 'text-red-500'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                  aria-label={
                    isFavorite(Number(tool.id))
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const toolData = {
                      _id: Number(tool.id),
                      name: tool.name,
                      link: tool.link,
                      image_url: tool.logo,
                      thumbnail_url: tool.logo,
                      description: tool.description,
                      tags: tool.category,
                      created_at: '',
                      is_approved: true,
                      click_count: 0,
                      views: 0,
                      developer: null,
                      category: tool.category,
                      submitted_by: null,
                    };
                    console.log('Tool Data is', toolData);
                    toggleFavorite(toolData);
                  }}
                >
                  {isFavorite(Number(tool.id)) ? (
                    <FaHeart size={12} />
                  ) : (
                    <FiHeart size={12} />
                  )}
                </button>
              </div>

              {/* Tool Description - Flexible content area */}
              <div className="flex-1 flex flex-col min-h-0">
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-shrink-0">
                  {tool.description}
                </p>

                {/* Tool Tags - Responsive visibility */}
                <div className="flex flex-wrap gap-1 mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
                  <span className="px-2 py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full">
                    {tool.category}
                  </span>
                  <span className="px-2 py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full hidden sm:inline-block">
                    AI Tool
                  </span>
                  <span className="px-2 py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full hidden lg:inline-block">
                    Popular
                  </span>
                </div>

                {/* Pricing Badge */}
                <div className="mb-2 sm:mb-3 lg:mb-4 flex-shrink-0">
                  <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Free
                  </span>
                </div>

                {/* Spacer to push footer to bottom */}
                <div className="flex-1"></div>

                {/* Footer - Always at bottom */}
                <div className="flex items-center justify-between pt-2 sm:pt-3 lg:pt-4 border-t border-gray-100 flex-shrink-0 mt-auto">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(tool.link, '_blank', 'noopener,noreferrer');
                    }}
                    className="flex items-center gap-1 sm:gap-2 text-[#7d42fb] font-medium hover:text-[#6b35e0] transition-colors text-xs sm:text-sm"
                  >
                    Try Now <FiExternalLink size={12} />
                  </button>
                  <div className="text-xs text-gray-500">#{tool.id}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
      <h1 className="font-bold text-4xl mb-10 px-4 text-black mt-20">
        Latest AI Tools
      </h1>
      <section className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {displayedProducts.map((tool) => (
          <Link
            key={tool._id}
            href={`/tool/${createSlug(tool.name)}`}
            onClick={() => storeProductData(tool)}
          >
            <div
              key={tool._id}
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
                <HeartButton
                  tool={tool}
                  isFavorite={isFavorite(tool._id)}
                  onToggle={toggleFavorite}
                />
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
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(tool.link, '_blank', 'noopener,noreferrer');
                    }}
                    className="flex items-center gap-1 sm:gap-2 text-[#7d42fb] font-medium hover:text-[#6b35e0] transition-colors text-xs sm:text-sm"
                  >
                    Try Now <FiExternalLink size={12} />
                  </button>
                  <div className="text-xs text-gray-500">#{tool._id}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Load More Button */}
      {hasMoreProducts && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-[#7d42fb] hover:bg-[#572eaf] disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading more tools...
              </div>
            ) : (
              `Load More Tools`
            )}
          </button>
        </div>
      )}

      {!hasMoreProducts && displayedProducts.length > 0 && (
        <div className="flex justify-center mt-12 mb-8">
          <p className="text-gray-500 font-semibold">
            🎉 You've reached the end! All tools have been loaded.
          </p>
        </div>
      )}
    </main>
  );
};

export default AllProduct;
