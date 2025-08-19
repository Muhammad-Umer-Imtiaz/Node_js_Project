//issue is here in session Storagein line 193
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FiExternalLink, FiHeart, FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp, FiUsers, FiTarget, FiZap, FiTrendingUp } from 'react-icons/fi';
import { FaHeart, FaBrain, FaRobot, FaCalendarAlt, FaFileAlt, FaPuzzlePiece, FaChartBar } from 'react-icons/fa';
import { AI_TOOLS_CATEGORIES } from '@/constants';
import toast from 'react-hot-toast';

interface Tool {
  _id: number;
  name: string;
  description: string;
  image_url?: string;
  thumbnail_url: string;
  category: string;
  click_count: number;
  link?: string;
  views?: string;
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
  };

  const removeFromFavorites = (toolId: number) => {
    const toolToRemove = favorites.find(tool => tool._id === toolId);
    
    const updatedFavorites = favorites.filter(tool => tool._id !== toolId);
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
    return favorites.some(tool => tool._id === toolId);
  };

  const toggleFavorite = (tool: { _id: number; }) => {
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

// Tools Slider Component
interface ToolsSliderProps {
  tools: Tool[];
  featureName: string;
}

const ToolsSlider: React.FC<ToolsSliderProps> = ({ tools, featureName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();
  const itemsPerPage = 3;
  const totalPages = Math.ceil(tools.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentTools = () => {
    const start = currentIndex * itemsPerPage;
    return tools.slice(start, start + itemsPerPage);
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
          id: product._id.toString(),
          name: product.name,
          thumbnail: product.thumbnail_url,
          logo: product.image_url,
          description: product.description,
          tag: product.category,
          tagIcon: '',
          link: product.link,
        };
        // Before
console.log(`product_${product._id}`)

// After
const storageKey = `product_${product._id}`;
console.log('Storing product with key:', storageKey);
sessionStorage.setItem(storageKey, JSON.stringify(productData));
      } catch (error) {
        console.error('Error storing product data:', error);
      }
    }
  };

  return (
    <div className="relative">
      {/* Slider Container with Navigation Buttons */}
      <div className="relative">
        {/* Left Navigation Button */}
        {totalPages > 1 && (
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 shadow-lg ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-white text-[#7d42fb] hover:bg-[#7d42fb] hover:text-white hover:scale-110 border border-[#7d42fb]'
            }`}
            style={{ transform: 'translateX(-50%) translateY(-50%)', left: '-20px' }}
          >
            <FiChevronLeft size={20} />
          </button>
        )}

        {/* Right Navigation Button */}
        {totalPages > 1 && (
          <button
            onClick={nextSlide}
            disabled={currentIndex === totalPages - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all duration-300 shadow-lg ${
              currentIndex === totalPages - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                : 'bg-white text-[#7d42fb] hover:bg-[#7d42fb] hover:text-white hover:scale-110 border border-[#7d42fb]'
            }`}
            style={{ transform: 'translateX(50%) translateY(-50%)', right: '-20px' }}
          >
            <FiChevronRight size={20} />
          </button>
        )}

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 px-8">
          {getCurrentTools().map((tool) => (
            <Link
              key={tool.id}
              href={`/ai-tools/${createToolSlug(tool.name)}`}
              onClick={() => storeProductData(tool)}
            >
              <div
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer relative group transform hover:scale-105"
                style={{
                  height: '200px',
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
                    tool={tool}
                    isFavorite={isFavorite(tool._id)}
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
                    <h3 className="font-bold text-lg text-gray-900 truncate flex items-center gap-1 group-hover:text-[#7d42fb] transition-colors">
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

                <p className="text-gray-600 text-sm mb-4 overflow-hidden text-ellipsis line-clamp-4 max-h-[4.5em]">
                  {tool.description}
                </p>

                {/* Tool Stats */}
                <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                  <span>👁️ {tool.views || '2.1k'} views</span>
                  <span>🔗 {tool.click_count || 150} clicks</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Controls (Pagination Dots) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#7d42fb] w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Interactive Guide Component
// Replace the entire AIProductivityGuide component with this dynamic version
const AICategoryGuide = ({ categoryData }: { categoryData: any }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  if (!categoryData) return null;

  const keyFeatures = categoryData.keyFeatures || [];
  const targetUsers = categoryData.targetUsers || [];
  const useCases = categoryData.useCases || [];
  const selectionCriteria = categoryData.selectionCriteria || [];

  // Icon mapping for different categories
  const getIconForFeature = (feature: string, index: number) => {
    const icons = [FaBrain, FaRobot, FaCalendarAlt, FaFileAlt, FaPuzzlePiece, FaChartBar];
    return icons[index % icons.length];
  };

  const getUserIcon = (user: string, index: number) => {
    const icons = [FiTrendingUp, FiUsers, FiZap, FiTarget, '🏠', '💼'];
    return icons[index % icons.length];
  };

  return (
    <section className="bg-gradient-to-br from-[#ecf2ff] via-white to-[#f8faff] py-5">
      <div className="max-w-6xl mx-auto px-6 mt-5">
        {/* Dynamic Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Is an <span className="text-[#7d42fb]">{categoryData.title}?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {categoryData.detailedDescription}
          </p>
        </div>

        {/* Use Cases Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {useCases.map((useCase: string, index: number) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#7d42fb]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#7d42fb] font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{useCase}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Key Features */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#7d42fb] rounded-full flex items-center justify-center">
                <FiTarget className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">🚀 Key Features to Look For</h3>
            </div>
            <div className="space-y-4">
              {keyFeatures.map((feature: string, index: number) => {
                const IconComponent = getIconForFeature(feature, index);
                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-gray-200 bg-[#7d42fb]/5 border-[#7d42fb] transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="text-[#7d42fb]" size={20} />
                      <span className="font-semibold text-gray-900">{feature}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Who Should Use */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#7d42fb] rounded-full flex items-center justify-center">
                <FiUsers className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">👥 Who Should Use These Tools?</h3>
            </div>
            <div className="space-y-4">
              {targetUsers.map((user: string, index: number) => {
                const userIcon = getUserIcon(user, index);
                return (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-gray-200 hover:border-[#7d42fb] hover:bg-[#7d42fb]/5 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveSection(activeSection === `user-${index}` ? null : `user-${index}`)}
                  >
                    <div className="flex items-center gap-3">
                      {typeof userIcon === 'string' ? (
                        <span className="text-xl">{userIcon}</span>
                      ) : (
                        React.createElement(userIcon, { className: "text-[#7d42fb]", size: 20 })
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">{user}</h4>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selection Guide */}
        <div className="bg-gradient-to-r from-[#7d42fb] to-[#9f7aea] rounded-2xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">✅ How to Choose the Right Tool</h3>
            <p className="text-lg opacity-90">Ask yourself these essential questions:</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectionCriteria.map((question: string, index: number) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-xs">{index + 1}</span>
                  </div>
                  <p className="text-white/90 leading-relaxed">{question}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get category from URL
    const path = window.location.pathname;
    const categorySlug = path.split('/ai-tools/')[1];
    
    if (categorySlug) {
      // Find matching category from AI_TOOLS_CATEGORIES
      const matchedCategory = AI_TOOLS_CATEGORIES.find(
        cat => cat.id.toLowerCase().replace(/\s+/g, '-') === categorySlug
      );
      
      if (matchedCategory) {
        setCategoryData(matchedCategory);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Extract feature from URL path
    const pathParts = pathname.split('/');
    const lastPath = pathParts[pathParts.length - 1];
    
    // Check if the last part is a feature
    if (categoryData?.features.some(
      (      feat: string) => feat.toLowerCase().replace(/[^a-z0-9]+/g, '-') === lastPath
    )) {
      setSelectedFeature(lastPath);
    } else {
      setSelectedFeature(null);
    }
  }, [pathname, categoryData]);

  const handleFeatureClick = (feature: string) => {
    const featureSlug = feature.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    router.push(`/ai-tools/${featureSlug}`);
  };

  // Generate dummy tools for each feature (increased to 6 for better slider demo)
  const generateDummyTools = (feature: string): Tool[] => {
    const baseTools = [
      {
        id: Math.random() * 1000,
        name: `${feature} Pro`,
        description: `Advanced ${feature.toLowerCase()} tool with AI-powered capabilities. Perfect for professionals and teams looking to enhance their workflow.`,
        image_url: '/ai_logo.png',
        thumbnail_url: '/api/placeholder/300/200',
        category: categoryData?.title || 'AI Tool',
        click_count: Math.floor(Math.random() * 500) + 50,
        link: `https://example.com/${feature.toLowerCase().replace(/\s+/g, '-')}`,
        views: `${(Math.random() * 5 + 1).toFixed(1)}k`
      },
      {
        id: Math.random() * 1000,
        name: `Smart ${feature}`,
        description: `Intelligent ${feature.toLowerCase()} solution that automates complex tasks and provides instant results with machine learning algorithms.`,
        image_url: '/ai_logo.png',
        thumbnail_url: '/api/placeholder/300/200',
        category: categoryData?.title || 'AI Tool',
        click_count: Math.floor(Math.random() * 500) + 50,
        link: `https://example.com/smart-${feature.toLowerCase().replace(/\s+/g, '-')}`,
        views: `${(Math.random() * 5 + 1).toFixed(1)}k`
      },
      {
        id: Math.random() * 1000,
        name: `${feature} Assistant`,
        description: `AI-powered ${feature.toLowerCase()} assistant that helps you create, optimize, and manage your projects efficiently.`,
        image_url: '/ai_logo.png',
        thumbnail_url: '/api/placeholder/300/200',
        category: categoryData?.title || 'AI Tool',
        click_count: Math.floor(Math.random() * 500) + 50,
        link: `https://example.com/${feature.toLowerCase().replace(/\s+/g, '-')}-assistant`,
        views: `${(Math.random() * 5 + 1).toFixed(1)}k`
      },
      {
        id: Math.random() * 1000,
        name: `Ultra ${feature}`,
        description: `Next-generation ${feature.toLowerCase()} platform with cutting-edge AI technology for maximum productivity and efficiency.`,
        image_url: '/ai_logo.png',
        thumbnail_url: '/api/placeholder/300/200',
        category: categoryData?.title || 'AI Tool',
        click_count: Math.floor(Math.random() * 500) + 50,
        link: `https://example.com/ultra-${feature.toLowerCase().replace(/\s+/g, '-')}`,
        views: `${(Math.random() * 5 + 1).toFixed(1)}k`
      },
      {
        id: Math.random() * 1000,
        name: `${feature} Master`,
        description: `Professional-grade ${feature.toLowerCase()} solution designed for enterprises and power users who demand excellence.`,
        image_url: '/ai_logo.png',
        thumbnail_url: '/api/placeholder/300/200',
        category: categoryData?.title || 'AI Tool',
        click_count: Math.floor(Math.random() * 500) + 50,
        link: `https://example.com/${feature.toLowerCase().replace(/\s+/g, '-')}-master`,
        views: `${(Math.random() * 5 + 1).toFixed(1)}k`
      },
      {
        id: Math.random() * 1000,
        name: `AI ${feature} Hub`,
        description: `Comprehensive ${feature.toLowerCase()} ecosystem that combines multiple AI tools in one powerful, user-friendly platform.`,
        image_url: '/ai_logo.png',
        thumbnail_url: '/api/placeholder/300/200',
        category: categoryData?.title || 'AI Tool',
        click_count: Math.floor(Math.random() * 500) + 50,
        link: `https://example.com/ai-${feature.toLowerCase().replace(/\s+/g, '-')}-hub`,
        views: `${(Math.random() * 5 + 1).toFixed(1)}k`
      }
    ];
    
    return baseTools.slice(0, 6); // Return 6 tools for better slider demo
  };

  const createFeatureSlug = (feature: string): string => {
    return feature
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d42fb] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Link 
            href="/ai-tools" 
            className="bg-[#7d42fb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6b35e0] transition-colors"
          >
            Back to Categories
          </Link>
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
            <div className="flex items-center justify-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-black mt-5">
                ⚡ Best {categoryData.title}{' '}
              </h1>
            </div>
            <p className="text-[#272729] text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              {categoryData.detailedDescription}
            </p>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-6 mt-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-[#7d42fb]">Home</Link>
            <span>/</span>
            <Link href="/ai-tools" className="hover:text-[#7d42fb]">AI Tools</Link>
            <span>/</span>
            <span className="text-[#7d42fb] font-semibold">{categoryData.title}</span>
          </nav>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Image src="/hero1.png" alt="decoration" width={80} height={70} />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Image src="/hero5.png" alt="decoration" width={100} height={60} />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-16">
          {categoryData?.features.map((feature: string, index: number) => {
            const featureSlug = feature.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            
            return (
              <div key={index} className="feature-section">
                {/* Feature Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <button
                      onClick={() => handleFeatureClick(feature)}
                      className="inline-block"
                    >
                      <h2 className="text-2xl md:text-3xl font-bold text-[#7d42fb] mb-2 relative cursor-pointer">
                        <span className={`border-b-2 border-solid border-[#7d42fb] ${
                          selectedFeature === featureSlug ? 'text-[#6b35e0]' : ''
                        }`}>
                          {feature}
                        </span>
                        <FiExternalLink
                          size={18}
                          className="inline ml-2 text-[#7d42fb] opacity-100 align-middle"
                        />
                      </h2>
                    </button>
                  </div>
                </div>

                {/* Tools Slider - Show only if this feature is selected or no feature is selected */}
                {(!selectedFeature || selectedFeature === featureSlug) && (
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <ToolsSlider 
                      tools={generateDummyTools(feature)} 
                      featureName={feature}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Show AI Productivity Guide only when no specific feature is selected */}
      {!selectedFeature && <AICategoryGuide categoryData={categoryData} />}
    </div>
  );
};

export default CategoryPage;

<style jsx>{`
  .line-clamp-4 {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .feature-section {
    padding-bottom: 2rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .feature-section:last-child {
    border-bottom: none;
  }
`}</style>