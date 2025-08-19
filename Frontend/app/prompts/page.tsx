'use client';

import { useState, useEffect, SetStateAction } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCopy, FiCheck, FiSearch, FiFilter, FiImage, FiStar, FiTrendingUp } from 'react-icons/fi';
import { FaRobot, FaPalette, FaCamera, FaPortrait, FaGem, FaMagic, FaFire } from 'react-icons/fa';
import { MdLandscape } from 'react-icons/md';

export default function PromptsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [copiedPrompt, setCopiedPrompt] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const categories = [
    { id: 'all', name: 'All Categories', icon: FiImage, color: 'purple' },
    { id: 'landscapes', name: 'Landscapes', icon: MdLandscape, color: 'green' },
    { id: 'landscapes', name: 'Landscapes', icon: MdLandscape, color: 'green' },
    { id: 'abstract', name: 'Abstract Art', icon: FaPalette, color: 'pink' },
    { id: 'photography', name: 'Photography', icon: FaCamera, color: 'indigo' },
    { id: 'fantasy', name: 'Fantasy', icon: FaMagic, color: 'purple' },
    { id: 'architecture', name: 'Architecture', icon: FaGem, color: 'gray' }
  ];

  const platforms = [
    { id: 'all', name: 'All Platforms', color: 'purple' },
    { id: 'chatgpt', name: 'ChatGPT DALL-E', color: 'green' },
    { id: 'midjourney', name: 'Midjourney', color: 'blue' },
    { id: 'gemini', name: 'Google Gemini', color: 'orange' },
    { id: 'leonardo', name: 'Leonardo AI', color: 'red' },
    { id: 'stablediffusion', name: 'Stable Diffusion', color: 'cyan' }
  ];

  const prompts = [
    {
      id: 1,
      title: "Cinematic Portrait",
      category: "portraits",
      platform: "chatgpt",
      difficulty: "Intermediate",
      popularity: 95,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
      prompt: "Create a cinematic portrait of a mysterious figure in dramatic lighting, shot with a 85mm lens, shallow depth of field, moody atmosphere, film noir style, high contrast shadows",
      tags: ["portrait", "cinematic", "dramatic", "film-noir"],
      description: "Perfect for creating movie-like character portraits with professional lighting"
    },
    {
      id: 2,
      title: "Ethereal Landscape",
      category: "landscapes",
      platform: "midjourney",
      difficulty: "Advanced",
      popularity: 88,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      prompt: "Mystical mountain landscape at golden hour, floating islands, ethereal mist, otherworldly lighting, fantasy realm, ultra-detailed, 8K resolution, magical atmosphere",
      tags: ["landscape", "fantasy", "mystical", "golden-hour"],
      description: "Creates breathtaking fantasy landscapes with magical elements"
    },
    {
      id: 3,
      title: "Abstract Fluid Art",
      category: "abstract",
      platform: "gemini",
      difficulty: "Beginner",
      popularity: 92,
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      prompt: "Abstract fluid art with vibrant colors, organic flowing shapes, liquid metal textures, iridescent surfaces, gradient blending, modern digital art style",
      tags: ["abstract", "fluid", "vibrant", "modern"],
      description: "Generate stunning abstract art with flowing, organic forms"
    },
    {
      id: 4,
      title: "Street Photography",
      category: "photography",
      platform: "leonardo",
      difficulty: "Intermediate",
      popularity: 79,
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      prompt: "Urban street photography, candid moment, golden hour lighting, shallow depth of field, authentic human expression, photojournalistic style, 35mm film aesthetic",
      tags: ["street", "photography", "urban", "candid"],
      description: "Capture authentic street moments with professional photography techniques"
    },
    {
      id: 5,
      title: "Dragon Fantasy Art",
      category: "fantasy",
      platform: "stablediffusion",
      difficulty: "Advanced",
      popularity: 96,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      prompt: "Majestic dragon perched on ancient castle ruins, epic fantasy scene, dramatic storm clouds, lightning illumination, detailed scales and wings, cinematic composition, dark fantasy aesthetic",
      tags: ["dragon", "fantasy", "epic", "castle"],
      description: "Epic fantasy scenes featuring mythical creatures and environments"
    },
    {
      id: 6,
      title: "Modern Architecture",
      category: "architecture",
      platform: "chatgpt",
      difficulty: "Intermediate",
      popularity: 84,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      prompt: "Contemporary glass and steel building, minimalist design, geometric patterns, clean lines, natural lighting, architectural photography, professional real estate style",
      tags: ["architecture", "modern", "minimalist", "geometric"],
      description: "Showcase contemporary architectural designs with professional precision"
    },
    {
      id: 7,
      title: "Anime Character Portrait",
      category: "portraits",
      platform: "midjourney",
      difficulty: "Beginner",
      popularity: 91,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      prompt: "Anime style character portrait, detailed eyes, soft shading, vibrant hair colors, expressive features, studio ghibli inspired, high quality digital art",
      tags: ["anime", "character", "portrait", "ghibli"],
      description: "Create beautiful anime-style character artwork"
    },
    {
      id: 8,
      title: "Cyberpunk Cityscape",
      category: "landscapes",
      platform: "leonardo",
      difficulty: "Advanced",
      popularity: 87,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      prompt: "Futuristic cyberpunk cityscape at night, neon lights, holographic advertisements, flying cars, rain-soaked streets, blade runner aesthetic, ultra-wide angle view",
      tags: ["cyberpunk", "futuristic", "cityscape", "neon"],
      description: "Immersive cyberpunk environments with futuristic elements"
    }
  ];

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || prompt.platform === selectedPlatform;
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const copyToClipboard = async (text: string, id: number | SetStateAction<string>) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(String(id));
      setTimeout(() => setCopiedPrompt(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleFavorite = (id: unknown) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlatformColor = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData ? platformData.color : 'gray';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-30 animate-pulse" style={{backgroundColor: '#7d42fb'}}></div>
        <div className="absolute top-1/4 right-10 w-24 h-24 rounded-full opacity-20 animate-bounce" style={{backgroundColor: '#7d42fb'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-full opacity-25 animate-pulse" style={{backgroundColor: '#7d42fb'}}></div>
        <div className="absolute bottom-10 right-1/4 w-28 h-28 rounded-full opacity-20 animate-bounce" style={{backgroundColor: '#7d42fb'}}></div>
      </div>

      <div className="relative z-10 px-4 py-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2" style={{color: '#7d42fb'}}>
              <FaFire className="animate-pulse" />
              <span className="text-sm font-medium">Trending Prompts</span>
            </div>
          </div>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #7d42fb, #a855f7)'}}>
                <FaRobot className="text-white text-2xl" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold" style={{background: 'linear-gradient(135deg, #7d42fb, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                AI Image Prompts
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect prompts for generating stunning images across ChatGPT, Gemini, Midjourney, and more
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative text-black">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prompts, tags, or styles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 outline-none transition-all duration-300"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#7d42fb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(125, 66, 251, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-black px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none bg-white min-w-40"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Platform Filter */}
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="text-black px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none bg-white min-w-40"
              >
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrompts.map(prompt => (
              <div
                key={prompt.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/50 overflow-hidden group"
              >
                {/* Image Preview */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={prompt.image}
                    alt={prompt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      Preview Example
                    </span>
                  </div>
                </div>

                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:opacity-80 transition-all duration-300">
                        {prompt.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{prompt.description}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(prompt.id)}
                      className={`p-2 rounded-full transition-all duration-300 ${
                        favorites.has(prompt.id)
                          ? 'text-yellow-500 bg-yellow-100'
                          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-100'
                      }`}
                    >
                      <FiStar className={favorites.has(prompt.id) ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {/* Tags and Meta */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(prompt.difficulty)}`}>
                      {prompt.difficulty}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-${getPlatformColor(prompt.platform)}-500`}>
                      {platforms.find(p => p.id === prompt.platform)?.name || prompt.platform}
                    </span>
                    <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                      <FiTrendingUp size={12} />
                      {prompt.popularity}%
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-purple-100 hover:text-purple-600 transition-colors duration-300 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prompt Text */}
                <div className="px-6 pb-4">
                  <div className="bg-gray-50 rounded-xl p-4 border-l-4" style={{borderLeftColor: '#7d42fb'}}>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono">
                      {prompt.prompt}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => copyToClipboard(prompt.prompt, prompt.id)}
                    className="w-full text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                    style={{
                      background: copiedPrompt === String(prompt.id) ? '#10b981' : 'linear-gradient(135deg, #7d42fb, #a855f7)',
                      opacity: copiedPrompt === String(prompt.id) ? 1 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (copiedPrompt !== String(prompt.id)) {
                        (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #6d28d9, #9333ea)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (copiedPrompt !== String(prompt.id)) {
                        (e.target as HTMLButtonElement).style.background = 'linear-gradient(135deg, #7d42fb, #a855f7)';
                      }
                    }}
                  >
                    {copiedPrompt === String(prompt.id) ? (
                      <>
                        <FiCheck size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy size={16} />
                        Copy Prompt
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredPrompts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiSearch className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No prompts found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search terms or filters</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedPlatform('all');
                }}
                className="text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                style={{backgroundColor: '#7d42fb'}}
                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#6d28d9'}
                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#7d42fb'}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="max-w-7xl mx-auto mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2" style={{color: '#7d42fb'}}>{prompts.length}+</div>
                <p className="text-gray-600">Curated Prompts</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2" style={{color: '#7d42fb'}}>{platforms.length - 1}</div>
                <p className="text-gray-600">AI Platforms</p>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2" style={{color: '#7d42fb'}}>{categories.length - 1}</div>
                <p className="text-gray-600">Categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}