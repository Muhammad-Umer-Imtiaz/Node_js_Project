'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiExternalLink, FiHeart } from 'react-icons/fi';
import { categories } from '@/constants';
import toast from 'react-hot-toast';
import { FaHeart } from 'react-icons/fa';

interface Tool {
  id: number;
  name: string;
  description: string;
  image_url?: string;
  thumbnail_url: string;
  category: string;
  click_count: number;
  link?: string;
  views?: string;
}

interface CategoryData {
  category: string;
  emoji: string;
  tools: Tool[];
  totalCount: number;
  loading: boolean;
}

const useFavorites = () => {
  const [favorites, setFavorites] = useState<Tool[]>([]);

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
  const toolToRemove = favorites.find(tool => tool.id === toolId);
  
  const updatedFavorites = favorites.filter(tool => tool.id !== toolId);
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
    return favorites.some(tool => tool.id === toolId);
  };

  const toggleFavorite = (tool: { id: number; }) => {
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
    isFavorite,
    toggleFavorite
  };
};

// Heart Button Component
interface HeartButtonProps {
  tool: any;
  isFavorite: boolean;
  onToggle: (tool: any) => void;
}

const HeartButton: React.FC<HeartButtonProps> = ({ tool, isFavorite, onToggle }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: { preventDefault: () => void; stopPropagation: () => void; }) => {
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

const CategoryOverviewPage = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    setLoading(true);
    const categoryPromises = categories.map(async ({ label, emoji }) => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/tool/category?category=${encodeURIComponent(label)}&offset=1&limit=20`
          // `/api/tools/category/?category=${encodeURIComponent(label)}&limit=6&offset=0`
        );
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          return {
            category: label,
            emoji,
            tools: data.results || [],
            totalCount: data.results?.length || 0,
            loading: false,
          };
        }
        return {
          category: label,
          emoji,
          tools: [],
          totalCount: 0,
          loading: false,
        };
      } catch (error) {
        console.error(`Error fetching ${label} tools:`, error);
        return {
          category: label,
          emoji,
          tools: [],
          totalCount: 0,
          loading: false,
        };
      }
    });

    const results = await Promise.all(categoryPromises);
    setCategoryData(results.filter((category) => category.totalCount > 0)); // Only show categories with tools
    setLoading(false);
  };

  const createCategorySlug = (category: string): string => {
    return category.toLowerCase().replace(/\s+/g, '-');
  };

  const createToolSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const storeProductData = (product: Tool): void => {
    if (typeof window !== 'undefined') {
      try {
        const productData = {
          id: product.id.toString(),
          name: product.name,
          thumbnail: product.thumbnail_url,
          logo: product.image_url,
          description: product.description,
          tag: product.category,
          tagIcon: '',
          link: product.link,
        };
        sessionStorage.setItem(
          `product_${product.id}`,
          JSON.stringify(productData)
        );
      } catch (error) {
        console.error('Error storing product data:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d42fb] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative w-full bg-[#ecf2ff] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Browse AI Tools by{' '}
              <span className="text-[#7d42fb]">Category</span>
            </h1>
            <p className="text-[#272729] text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              Discover the best AI tools organized by category. Each section
              shows the top tools to help you find exactly what you need for
              your projects.
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

      {/* Categories Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {categoryData.map(({ category, emoji, tools, totalCount }) => (
            <div key={category} className="category-section">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{emoji}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Best AI {category} Tools ({totalCount})
                  </h2>
                </div>
                <Link
                  href={`/category/${createCategorySlug(category)}`}
                  className="text-[#7d42fb] font-semibold hover:underline flex items-center gap-2"
                >
                  View All
                  <FiExternalLink size={16} />
                </Link>
              </div>

              {/* Tools Grid - 4x2 layout */}
              <div className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {tools.slice(0, 8).map((tool, index) => (
                  <Link
                    key={tool.id}
                    href={`/ai-tools/${createToolSlug(tool.name)}`}
                    onClick={() => storeProductData(tool)}
                  >
                    <div
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
                      <div className="absolute top-3 right-3 z-10">
                        <HeartButton 
                          tool={{
                            id: tool.id,
                            name: tool.name,
                            category: tool.category,
                            description: tool.description,
                            image: tool.image_url,
                            thumbnail: tool.thumbnail_url,
                            views: tool.views,
                            click_count: tool.click_count,
                            link: tool.link
                          }}
                          isFavorite={isFavorite(tool.id)}
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
                                  (
                                    img.nextSibling as HTMLElement
                                  ).style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div
                            className="w-full h-full bg-[#7d42fb] rounded-xl flex items-center justify-center text-white font-bold text-xs"
                            style={{
                              display: tool.image_url ? 'none' : 'flex',
                            }}
                          >
                            AI
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 truncate flex items-center gap-1">
                            <span className="flex items-center gap-1">
                              {tool.name}
                              <FiExternalLink
                                size={14}
                                className="text-[#7d42fb]"
                              />
                            </span>
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {tool.category}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 overflow-hidden text-ellipsis line-clamp-3 max-h-[4.5em]">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-section {
          padding-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .category-section:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default CategoryOverviewPage;
