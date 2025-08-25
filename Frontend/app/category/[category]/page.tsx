'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiExternalLink, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

type Tool = {
  _id: string | number;
  name: string;
  category: string;
  description: string;
  image_url?: string;
  thumbnail_url?: string;
  link?: string;
  views?: number;
  click_count?: number;
  created_at?: string;
};

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
}

const useFavorites = () => {
  const [favorites, setFavorites] = useState<ProductTool[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favoriteTools');
      if (savedFavorites) {
        try {
          const parsed = JSON.parse(savedFavorites);
          const standardized = parsed.map((t: any) => ({
            ...t,
            _id: parseInt(t._id || t.id),
          }));
          setFavorites(standardized);
        } catch (error) {
          console.error('Error parsing saved favorites:', error);
          localStorage.removeItem('favoriteTools');
        }
      }
    }
  }, []);

  const addToFavorites = (tool: any) => {
    setFavorites((prev) => {
      const toolId = parseInt(tool._id || tool.id);
      if (prev.some((t) => t._id === toolId)) {
        return prev;
      }
      const standardizedTool = {
        _id: toolId,
        ...tool,
      };
      const updatedFavorites = [...prev, standardizedTool];
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteTools', JSON.stringify(updatedFavorites));
      }
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
      return updatedFavorites;
    });
  };

  const removeFromFavorites = (toolId: number) => {
    setFavorites((prev) => {
      const toolToRemove = prev.find((tool) => tool._id === toolId);
      const updatedFavorites = prev.filter((tool) => tool._id !== toolId);
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
      return updatedFavorites;
    });
  };

  const isFavorite = (toolId: number) => {
    return favorites.some((tool) => tool._id === toolId);
  };

  const toggleFavorite = (tool: { _id: number }) => {
    const toolId = parseInt(String(tool._id));
    if (isFavorite(toolId)) {
      removeFromFavorites(toolId);
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
  tool: any;
  isFavorite: boolean;
  onToggle: (tool: any) => void;
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

const CategoryPage = () => {
  const [categoryName, setCategoryName] = useState('');
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const [displayedTools, setDisplayedTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMoreTools, setHasMoreTools] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const TOOLS_PER_LOAD = 18;

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    // Get category from URL path
    const path = window.location.pathname;
    const category = path.split('/category/')[1];
    if (category) {
      const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ');
      setCategoryName(decodedCategory);

      // Check for cached data first
      if (typeof window !== 'undefined') {
        const savedTools = sessionStorage.getItem('categoryDisplayedTools');
        const savedOffset = sessionStorage.getItem('categoryCurrentOffset');
        const savedTimestamp = sessionStorage.getItem('categoryToolsTimestamp');
        const savedHasMore = sessionStorage.getItem('categoryHasMoreTools');
        const savedCategory = sessionStorage.getItem('cachedCategoryName');

        const isDataFresh =
          savedTimestamp &&
          Date.now() - parseInt(savedTimestamp) < 5 * 60 * 1000; // 5 minutes

        // Check if cached data is for the same category
        if (
          savedTools &&
          savedOffset &&
          isDataFresh &&
          savedCategory === decodedCategory
        ) {
          try {
            const parsedTools = JSON.parse(savedTools);
            setDisplayedTools(parsedTools);
            setCurrentOffset(parseInt(savedOffset));
            setHasMoreTools(savedHasMore === 'true');
            setLoading(false);
            return;
          } catch (error) {
            console.error('Error parsing cached data:', error);
            clearCachedData();
          }
        }
      }

      // Fetch tools if no cache or cache is stale
      fetchInitialTools(decodedCategory);
    }
  }, []);

  useEffect(() => {
    // Cache the tools data
    if (
      typeof window !== 'undefined' &&
      displayedTools.length > 0 &&
      categoryName
    ) {
      try {
        sessionStorage.setItem(
          'categoryDisplayedTools',
          JSON.stringify(displayedTools)
        );
        sessionStorage.setItem(
          'categoryCurrentOffset',
          currentOffset.toString()
        );
        sessionStorage.setItem('categoryToolsTimestamp', Date.now().toString());
        sessionStorage.setItem('categoryHasMoreTools', hasMoreTools.toString());
        sessionStorage.setItem('cachedCategoryName', categoryName);
      } catch (error) {
        console.error('SessionStorage quota exceeded, clearing cache:', error);
        clearCachedData();
      }
    }
  }, [displayedTools, currentOffset, hasMoreTools, categoryName]);

  const clearCachedData = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('categoryDisplayedTools');
      sessionStorage.removeItem('categoryCurrentOffset');
      sessionStorage.removeItem('categoryToolsTimestamp');
      sessionStorage.removeItem('categoryHasMoreTools');
      sessionStorage.removeItem('cachedCategoryName');
    }
  };

  const fetchInitialTools = async (category: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/tools/category/?category=${category}&limit=${TOOLS_PER_LOAD}&offset=0`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const tools = data.results || [];

      setDisplayedTools(tools);
      setTotalResults(data.total_results || tools.length);
      setCurrentOffset(TOOLS_PER_LOAD);
      setHasMoreTools(tools.length === TOOLS_PER_LOAD);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load tools. Please try again.'
      );
      console.error('Error fetching tools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreTools) return;
    setLoadingMore(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/tools/category/?category=${encodeURIComponent(categoryName)}&limit=${TOOLS_PER_LOAD}&offset=${currentOffset}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newTools = data.results || [];
      setDisplayedTools((prev) => [...prev, ...newTools]);
      setCurrentOffset((prev) => prev + TOOLS_PER_LOAD);
      if (newTools.length < TOOLS_PER_LOAD) {
        setHasMoreTools(false);
      }
      console.log(
        `Loaded ${newTools.length} more tools. Total: ${displayedTools.length + newTools.length}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while loading more tools'
      );
      console.error('Error loading more tools:', err);
    } finally {
      setLoadingMore(false);
    }
  };
  const handleBackClick = () => {
    window.history.back();
  };

  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const storeProductData = (product: Tool): void => {
    if (typeof window !== 'undefined') {
      try {
        const productData = {
          _id: product._id.toString(),
          name: product.name,
          image: product.image_url,
          logo: product.image_url,
          description: product.description,
          tag: product.category,
          tagIcon: '',
          link: product.link,
          thumbnail: product.thumbnail_url
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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative w-full bg-[#ecf2ff] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            {/* Back Button */}
            <button
              // onClick={handleBackClick}
              className="inline-flex items-center text-[#7d42fb] font-semibold mb-8 hover:underline"
            ></button>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Best AI tools for{' '}
              <span className="text-[#7d42fb] capitalize">{categoryName}</span>
            </h1>

            {/* Description */}
            <p className="text-[#272729] text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              In the {categoryName} category, you'll find the best and most
              up-to-date AI tools that will help you optimize and develop your
              ideas. Easily search and use the tool that fits your needs.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Image src="/hero1.png" alt="decoration" width={80} height={70} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Image src="/hero5.png" alt="decoration" width={100} height={60} />
        </div>
      </section>

      {/* Tools Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d42fb]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                clearCachedData();
                fetchInitialTools(categoryName);
              }}
              className="bg-[#7d42fb] text-white font-semibold px-6 py-2 rounded-full hover:bg-[#6a35d9] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tools Grid */}
        {!loading && !error && displayedTools.length > 0 && (
          <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {displayedTools.map((tool) => (
              <Link
                key={tool._id}
                href={`/ai-tools/${createSlug(tool.name)}`}
                onClick={() => storeProductData(tool)}
              >
                <div
                  key={tool._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100 cursor-pointer relative"
                  style={{
                    height: '169px',
                    borderColor: '#cbd7ea',
                    boxShadow: '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      '0 0 2px 0 #24417a14, 2px 2px 9px 0 #290058';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d';
                  }}
                >
                  {/* Heart Button - Positioned absolutely in top-right */}
                  <div className="absolute top-3 right-3 z-10">
                    <HeartButton
                      tool={{
                        _id: tool._id,
                        name: tool.name,
                        category: tool.category,
                        description: tool.description,
                        image: tool.image_url,
                        thumbnail: tool.thumbnail_url,
                        views: tool.views,
                        click_count: tool.click_count,
                        link: tool.link,
                      }}
                      isFavorite={isFavorite(Number(tool._id))}
                      onToggle={toggleFavorite}
                    />
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                      {tool.image_url ? (
                        <img
                          src={tool.image_url}
                          alt={tool.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = 'none';
                            if (
                              img.nextSibling &&
                              img.nextSibling instanceof HTMLElement
                            ) {
                              (img.nextSibling as HTMLElement).style.display =
                                'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full bg-[#7d42fb] rounded-xl flex items-center justify-center text-white font-bold text-xs"
                        style={{ display: tool.image_url ? 'none' : 'flex' }}
                      >
                        AI
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <h3 className="font-bold text-lg text-gray-900 truncate flex items-center gap-1">
                        <span className="flex items-center gap-1">
                          {tool.name}
                          <FiExternalLink
                            size={18}
                            className="text-[#7d42fb] ml-2"
                          />
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {tool.category}
                      </p>
                    </div>
                  </div>

                  {/* Description with fixed height and ellipsis */}
                  <p className="text-gray-600 text-sm mb-4 overflow-hidden text-ellipsis line-clamp-3 max-h-[4.5em]">
                    {tool.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      {(tool.views ?? 0) > 0 && <span>{tool.views} views</span>}
                      {(tool.click_count ?? 0) > 0 && (
                        <span>{tool.click_count} clicks</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && displayedTools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              No tools found for "{categoryName}" category.
            </p>
            <button
              onClick={handleBackClick}
              className="text-[#7d42fb] font-semibold hover:underline"
            >
              ← Go back to explore other categories
            </button>
          </div>
        )}
        {/* Load More Button */}
        {!loading && !error && displayedTools.length > 0 && hasMoreTools && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-[#7d42fb] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#6a35d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading more tools...
                </span>
              ) : (
                `Load More Tools (${TOOLS_PER_LOAD} more)`
              )}
            </button>
          </div>
        )}

        {/* Show completion message when all tools are loaded */}
        {!loading &&
          !error &&
          displayedTools.length > 0 &&
          !hasMoreTools &&
          displayedTools.length >= TOOLS_PER_LOAD && (
            <div className="text-center mt-12">
              <p className="text-gray-600 font-semibold">
                🎉 All {displayedTools.length} tools loaded for {categoryName}!
              </p>
            </div>
          )}
      </section>
    </div>
  );
};

export default CategoryPage;