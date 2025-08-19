'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AI_TOOLS_FEATURES, AIToolFeatures } from '@/constants';
import Link from 'next/link';
import { FiExternalLink, FiHeart, FiStar, FiFilter, FiUsers, FiTarget, FiCheckCircle } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface AITool {
  id: number;
  name: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  category: string;
  click_count: number;
  link: string;
  views: string;
  rating: number;
  pricing: string;
  tags: string[];
}

const FeaturePage = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [featureData, setFeatureData] = useState<AIToolFeatures | null>(null);
  const [tools, setTools] = useState<AITool[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    const featureSlug = pathname.split('/').pop();
    
    // Find the feature data from AI_TOOLS_FEATURES
    const matchedFeature = AI_TOOLS_FEATURES.find(
      feature => feature.id === featureSlug
    );
    
    if (matchedFeature) {
      setFeatureData(matchedFeature);
      setTools(generateDummyTools(matchedFeature.title));
    }
    
    setLoading(false);
  }, [pathname]);

  const generateDummyTools = (featureTitle: string): AITool[] => {
    const toolNames = [
      `${featureTitle} Tool 1`,
      `${featureTitle} Tool 2`,
      `${featureTitle} Tool 3`,
      `${featureTitle} Tool 4`,
      `${featureTitle} Tool 5`,
      `${featureTitle} Tool 6`,
      `${featureTitle} Tool 7`,
      `${featureTitle} Tool 8`,
      `${featureTitle} Tool 9`,
      `${featureTitle} Tool 10`,
      `${featureTitle} Tool 11`,
      `${featureTitle} Tool 12`
    ];

    const descriptions = [
      `This is a ${featureTitle.toLowerCase()} tool that helps with your daily tasks.`,
      `Advanced ${featureTitle.toLowerCase()} tool for professional use.`,
      `Simple and effective ${featureTitle.toLowerCase()} tool for beginners.`,
      `Powerful ${featureTitle.toLowerCase()} tool with advanced features.`,
      `User-friendly ${featureTitle.toLowerCase()} tool for everyone.`,
      `Professional ${featureTitle.toLowerCase()} tool for businesses.`,
      `Free ${featureTitle.toLowerCase()} tool with basic features.`,
      `Premium ${featureTitle.toLowerCase()} tool with extra capabilities.`,
      `Easy-to-use ${featureTitle.toLowerCase()} tool for quick results.`,
      `Comprehensive ${featureTitle.toLowerCase()} tool for all needs.`,
      `Modern ${featureTitle.toLowerCase()} tool with sleek design.`,
      `Reliable ${featureTitle.toLowerCase()} tool trusted by users.`
    ];

    const pricingOptions = ['Free', '$9.99/month', '$19.99/month', '$29.99/month', '$49.99/month', '$99.99/month'];
    
    const tagOptions = [
      'AI-Powered', 'Machine Learning', 'Automation', 'Analytics', 'Integration', 'Cloud-Based',
      'Real-time', 'Collaboration', 'Enterprise', 'API', 'Templates', 'Customizable',
      'Multi-platform', 'Secure', 'Scalable', 'User-friendly'
    ];

    return Array.from({ length: 12 }, (_, index) => {
      // Select 2-3 random tags
      const shuffledTags = [...tagOptions].sort(() => 0.5 - Math.random());
      const selectedTags = shuffledTags.slice(0, Math.floor(Math.random() * 2) + 2);

      return {
        id: 1000 + index,
        name: toolNames[index],
        description: descriptions[index],
        image_url: '/ai_logo.png',
        thumbnail_url: '/api/placeholder/300/200',
        category: featureTitle,
        click_count: Math.floor(Math.random() * 5000) + 100,
        link: `https://example-${index + 1}.com`,
        views: `${(Math.random() * 50 + 1).toFixed(1)}k`,
        rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // Rating between 3.5-5.0
        pricing: pricingOptions[Math.floor(Math.random() * pricingOptions.length)],
        tags: selectedTags
      };
    });
  };

  const getSortedAndFilteredTools = () => {
    if (!tools.length) return [];
    
    let filteredTools = [...tools];
    
    // Filter by pricing
    if (filterBy !== 'all') {
      filteredTools = filteredTools.filter(tool => {
        if (filterBy === 'free') return tool.pricing === 'Free';
        if (filterBy === 'paid') return tool.pricing !== 'Free';
        return true;
      });
    }
    
    // Sort tools
    switch (sortBy) {
      case 'popularity':
        return filteredTools.sort((a, b) => b.click_count - a.click_count);
      case 'rating':
        return filteredTools.sort((a, b) => b.rating - a.rating);
      case 'name':
        return filteredTools.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return filteredTools.sort((a, b) => b.id - a.id);
      default:
        return filteredTools;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d42fb] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading feature tools...</p>
        </div>
      </div>
    );
  }

  if (!featureData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature Not Found</h1>
          <p className="text-gray-600 mb-6">The feature you're looking for doesn't exist.</p>
          <Link 
            href="/ai-tools" 
            className="bg-[#7d42fb] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6b35e0] transition-colors"
          >
            Back to AI Tools
          </Link>
        </div>
      </div>
    );
  }

  const sortedTools = getSortedAndFilteredTools();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative w-full bg-[#ecf2ff] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-black">
                {featureData.mainHeading || `⚡ Best ${featureData.title} AI Tools`}
              </h1>
            </div>
            <p className="text-[#272729] text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              {featureData.introText || `${featureData.description}. Discover the most powerful AI-powered ${featureData.title.toLowerCase()} tools to enhance your workflow, boost productivity, and achieve better results.`}
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
            <span className="text-[#7d42fb] font-semibold">{featureData.title}</span>
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

      {/* Feature Content Sections */}
      {featureData.capabilities && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🚀 Key Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureData.capabilities.map((capability, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-[#7d42fb]/5 rounded-lg">
                  <FiCheckCircle className="text-[#7d42fb] mt-1 flex-shrink-0" size={20} />
                  <span className="text-gray-700">{capability}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Target Audience Section */}
      {featureData.targetAudience && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              <FiUsers className="inline-block mr-2 text-[#7d42fb]" />
              Who Can Benefit?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureData.targetAudience.map((audience, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-[#7d42fb]/5 to-[#7d42fb]/10 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">
                    {audience.icon || '👤'}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {audience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How to Choose Section */}
      {featureData.howToChoose && (
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              <FiTarget className="inline-block mr-2 text-[#7d42fb]" />
              How to Choose the Right Tool
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureData.howToChoose.map((criterion, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-[#7d42fb] transition-colors">
                  <div className="text-2xl flex-shrink-0">
                    {criterion.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 capitalize mb-1">
                      {criterion.criterion}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {criterion.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Filters and Sort */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                All {featureData.title} Tools
              </h2>
              <p className="text-gray-600">
                {sortedTools.length} AI-powered {featureData.title.toLowerCase()} tools to choose from
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Filter Dropdown */}
              <div className="relative text-black">
                <select 
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-[#7d42fb] focus:border-transparent"
                >
                  <option value="all">All Tools</option>
                  <option value="free">Free Only</option>
                  <option value="paid">Paid Only</option>
                </select>
                <FiFilter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              {/* Sort Dropdown */}
              <div className="relative text-black">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-[#7d42fb] focus:border-transparent"
                >
                  <option value="popularity">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Alphabetical</option>
                  <option value="newest">Newest</option>
                </select>
                <FiExternalLink className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1"
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#7d42fb]/10 rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={tool.image_url}
                      alt={tool.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#7d42fb] transition-colors truncate">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar
                            key={i}
                            size={12}
                            className={i < Math.floor(tool.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">{tool.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Add to favorites"
                >
                  <FiHeart size={16} />
                </button>
              </div>
              
              {/* Tool Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                {tool.description}
              </p>

              {/* Tool Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {tool.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[#7d42fb]/10 text-[#7d42fb] text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Pricing */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  tool.pricing === 'Free' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {tool.pricing}
                </span>
              </div>

              {/* Tool Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Link
                  href={tool.link}
                  className="flex items-center gap-2 text-[#7d42fb] font-medium hover:text-[#6b35e0] transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Try Now <FiExternalLink size={14} />
                </Link>
                <div className="text-xs text-gray-500">
                  #{tool.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedTools.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more results.</p>
            <button
              onClick={() => {
                setFilterBy('all');
                setSortBy('popularity');
              }}
              className="bg-[#7d42fb] text-white px-6 py-2 rounded-lg hover:bg-[#6b35e0] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Back to Categories Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Explore More AI Tools
          </h3>
          <p className="text-gray-600 mb-8">
            Discover other powerful AI tools across different categories
          </p>
          <Link
            href="/ai-tools"
            className="inline-flex items-center gap-2 bg-[#7d42fb] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#6b35e0] transition-colors shadow-lg hover:shadow-xl"
          >
            View All Categories
            <FiExternalLink size={16} />
          </Link>
        </div>
      </section>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default FeaturePage;