'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FiExternalLink,
  FiHeart,
  FiStar,
  FiHome,
  FiChevronRight,
  FiCheck,
  FiCopy,
  FiCode,
  FiShare2,
  FiEye,
  FiMousePointer,
} from 'react-icons/fi';
import {
  FaArrowLeft,
  FaFacebookF,
  FaWhatsapp,
  FaLinkedinIn,
  FaTwitter,
  FaHeart,
  FaStar,
  FaUser,
  FaThumbsUp,
  FaFlag,
  FaShieldAlt,
  FaDollarSign,
  FaGift,
} from 'react-icons/fa';
import { featuredTools, featuredProducts } from '@/constants';
import toast from 'react-hot-toast';

const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isHelpful?: boolean;
}

interface SimilarTool {
  _id: number;
  name: string;
  link: string;
  image_url: string;
  thumbnail_url: string;
  description: string;
  tags: string | null;
  created_at: string;
  is_approved: boolean;
  click_count: number;
  views: number;
  developer: string | null;
  category: string;
  submitted_by: string | null;
}

interface SimilarToolsResponse {
  category: string;
  total_results: number;
  results: SimilarTool[];
}

interface ToolDetailClientProps {
  slug: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

function ToolDetailClient({ slug, searchParams }: ToolDetailClientProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [similarTools, setSimilarTools] = useState<SimilarTool[]>([]);
  const [similarToolsLoading, setSimilarToolsLoading] = useState(false);
  const [similarToolsError, setSimilarToolsError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    userName: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Initialize dummy reviews
  useEffect(() => {
    const dummyReviews: Review[] = [
      {
        id: '1',
        userName: 'Alex Johnson',
        rating: 5,
        comment:
          'Absolutely fantastic tool! It has completely transformed my workflow and saved me countless hours.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        helpfulCount: 12,
      },
      {
        id: '2',
        userName: 'Sarah Chen',
        rating: 4,
        comment:
          'Great tool with excellent features. The AI capabilities are really impressive.',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        helpfulCount: 8,
      },
    ];
    setReviews(dummyReviews);
  }, []);

  const useFavorites = () => {
    const [favorites, setFavorites] = useState<SimilarTool[]>([]);

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
      const toolId = tool._id || tool.id;
      
      // Check if tool is already in favorites
      const isAlreadyFavorite = favorites.some((favTool) => favTool._id === toolId);
      if (isAlreadyFavorite) {
        return; // Don't add if already exists
      }

      const standardizedTool = {
        _id: toolId, // Use _id consistently
        name: tool.name || product.name,
        image: tool.image || product.image || product.logo,
        overview: tool.overview || '',
        image_url: tool.image_url || product.image || product.logo,
        thumbnail: tool.thumbnail || product.thumbnail,
        thumbnail_url: tool.thumbnail_url || product.thumbnail,
        description: tool.description || product.description,
        category: tool.category || product.tag,
        link: tool.link || product.link,
        ...tool,
      };

      const updatedFavorites = [...favorites, standardizedTool];
      setFavorites(updatedFavorites);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteTools', JSON.stringify(updatedFavorites));
      }

      toast.success(`${standardizedTool.name || 'Tool'} added to favorites!`, {
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

    const toggleFavorite = (tool: any) => {
      const toolId = tool._id || tool.id;
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

  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchSimilarTools = async (tag: string) => {
    if (!tag) return;
    console.log("hello from Tag", tag);
    setSimilarToolsLoading(true);
    setSimilarToolsError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/suggestions?tag=${tag}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SimilarToolsResponse = await response.json();
      console.log(data);
      setSimilarTools(data.results || []);
    } catch (error) {
      console.error('Error fetching similar tools:', error);
      setSimilarToolsError('Failed to load similar tools');
      setSimilarTools([]);
    } finally {
      setSimilarToolsLoading(false);
    }
  };

  const storeProductData = (product: SimilarTool): void => {
    if (typeof window !== 'undefined') {
      try {
        const productData = {
          _id: product._id.toString(), // Use _id
          id: product._id.toString(),
          name: product.name,
          image: product.image_url,
          thumbnail: product.thumbnail_url,
          logo: product.image_url,
          description: product.description,
          tag: product.category,
          tagIcon: '🤖',
          link: product.link,
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 500) + 50,
          isVerified: true,
          pricing: 'freemium',
          views: product.views || Math.floor(Math.random() * 10000) + 1000,
          clicks: product.click_count || Math.floor(Math.random() * 3000) + 500,
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

  useEffect(() => {
    const loadProduct = () => {
      const isNumericId = /^\d+$/.test(slug);

      if (isNumericId) {
        // Fixed: Match slug against item.id.toString() instead of item.name
        const featuredProduct = featuredProducts.find(
          (item) => item.id.toString() === slug
        );
        if (featuredProduct) {
          const enhancedProduct = {
            ...featuredProduct,
            _id: featuredProduct.id, // Add _id
            rating: 4.5 + Math.random() * 0.5,
            reviewCount: Math.floor(Math.random() * 500) + 50,
            isVerified: true,
            pricing: 'freemium',
            views: Math.floor(Math.random() * 10000) + 1000,
            clicks: Math.floor(Math.random() * 3000) + 500,
          };
          setProduct(enhancedProduct);
          setLoading(false);
          return;
        }
      }

      if (searchParams.name && searchParams.description) {
        const productFromParams = {
          _id: parseInt(slug) || Date.now(), // Add _id
          id: slug,
          name: searchParams.name as string,
          image:
            (searchParams.image as string) ||
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
          thumbnail:
            (searchParams.thumbnail as string) ||
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=400&fit=crop',
          logo:
            (searchParams.logo as string) ||
            (searchParams.image as string) ||
            'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=50&h=50&fit=crop',
          description: searchParams.description as string,
          tag:
            (searchParams.category as string) ||
            (searchParams.tag as string) ||
            'AI Tool',
          tagIcon: (searchParams.tagIcon as string) || '🤖',
          link: (searchParams.link as string) || '#',
          rating: 4.5 + Math.random() * 0.5,
          reviewCount: Math.floor(Math.random() * 500) + 50,
          isVerified: true,
          pricing: 'freemium',
          views:
            parseInt(searchParams.views as string) ||
            Math.floor(Math.random() * 10000) + 1000,
          clicks:
            parseInt(searchParams.clicks as string) ||
            Math.floor(Math.random() * 3000) + 500,
        };
        setProduct(productFromParams);
        setLoading(false);
        return;
      }

      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('product_')) {
            const data = JSON.parse(sessionStorage.getItem(key) || '{}');
            const productSlug = createSlug(data.name);

            // Fixed: Use strict equality (===) instead of loose equality (==)
            if (productSlug === slug) {
              const enhancedData = {
                ...data,
                _id: parseInt(data._id || data.id), // Ensure _id exists
                id: parseInt(data.id),
                isVerified: true,
                pricing: data.pricing || 'freemium',
              };
              setProduct(enhancedData);
              setLoading(false);
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error retrieving stored product data:', error);
      }

      setNotFound(true);
      setLoading(false);
    };

    loadProduct();
  }, [slug, searchParams]);

  useEffect(() => {
    if (product && product.tag) {
      fetchSimilarTools(product.tag);
    }
  }, [product]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newReview.userName.trim() ||
      !newReview.comment.trim() ||
      newReview.rating === 0
    ) {
      toast.error('Please fill in all fields and provide a rating!');
      return;
    }

    setIsSubmittingReview(true);

    setTimeout(() => {
      const review: Review = {
        id: Date.now().toString(),
        userName: newReview.userName.trim(),
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        date: new Date().toISOString(),
        helpfulCount: 0,
      };

      setReviews((prev) => [review, ...prev]);
      setNewReview({ rating: 0, comment: '', userName: '' });
      setIsSubmittingReview(false);
      toast.success('Review submitted successfully!');
    }, 1000);
  };

  const handleHelpfulClick = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpfulCount: review.isHelpful
                ? review.helpfulCount - 1
                : review.helpfulCount + 1,
              isHelpful: !review.isHelpful,
            }
          : review
      )
    );
  };

  const renderStarRating = (
    rating: number,
    interactive = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() =>
              interactive && onRatingChange && onRatingChange(star)
            }
          >
            <FaStar
              size={interactive ? 24 : 16}
              className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return product?.rating?.toFixed(1) || '0.0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getPricingBadge = () => {
    switch (product?.pricing) {
      case 'free':
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            <FaGift size={12} />
            Free
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            <FaDollarSign size={12} />
            Paid
          </span>
        );
      case 'freemium':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
            <FaDollarSign size={12} />
            Freemium
          </span>
        );
      default:
        return null;
    }
  };

  const embedCode = `<iframe src="https://aitools.com/embed/${product?._id || product?.id}" width="300" height="200" frameborder="0"></iframe>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-5 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#7d42fb] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-semibold text-gray-700">
            Loading product...
          </span>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-5 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/" className="text-[#7d42fb] hover:underline">
            Return to home page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link
            href="/"
            className="flex items-center text-gray-500 hover:text-[#7d42fb] transition-colors"
          >
            <FiHome className="mr-1" />
            Home
          </Link>
          <FiChevronRight className="text-gray-400" />
          <Link
            href="/tools"
            className="text-gray-500 hover:text-[#7d42fb] transition-colors"
          >
            Tools
          </Link>
          <FiChevronRight className="text-gray-400" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7d42fb]/10 to-transparent rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <img
                    src={product.logo}
                    alt={product.name}
                    className="w-16 h-16 rounded-2xl shadow-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-4xl font-bold text-gray-900">
                        {product.name}
                      </h1>
                      {product.isVerified && (
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          <FaShieldAlt size={12} />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Rating and Stats */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        {renderStarRating(Math.round(product.rating || 4.5))}
                        <span className="font-bold text-lg text-gray-900">
                          {(product.rating || 4.5).toFixed(1)}
                        </span>
                        <span className="text-gray-600">
                          ({product.reviewCount || reviews.length} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Category and Pricing */}
                    <div className="text-gray-900 flex items-center gap-3 mb-4">
                      <span className="text-gray-600">Pricing Model</span>
                      {getPricingBadge()}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-[#7d42fb] to-[#9b59ff] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
                  >
                    Visit Website
                    <FiExternalLink size={18} />
                  </a>

                  <button
                    onClick={() => toggleFavorite(product)}
                    className={`px-6 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isFavorite(product._id || product.id) 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isFavorite(product._id || product.id) ? (
                      <FaHeart size={18} />
                    ) : (
                      <FiHeart size={18} />
                    )}
                    {isFavorite(product._id || product.id)
                      ? 'Favorited'
                      : 'Add to Favorites'}
                  </button>
                </div>

                {/* Social Share */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-semibold">Share:</span>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="bg-[#3b5998] text-white p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      <FaFacebookF size={16} />
                    </a>
                    <a
                      href="#"
                      className="bg-[#25D366] text-white p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      <FaWhatsapp size={16} />
                    </a>
                    <a
                      href="#"
                      className="bg-[#0e76a8] text-white p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      <FaLinkedinIn size={16} />
                    </a>
                    <a
                      href="#"
                      className="bg-[#1DA1F2] text-white p-3 rounded-full hover:scale-110 transition-transform"
                    >
                      <FaTwitter size={16} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div
                  className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
                  onClick={() => setIsModalOpen(true)}
                >
                  <img
                    src={product.thumbnail || product.image}
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3">
                      <FiExternalLink size={24} className="text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-8">
            <div
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
              style={{
                boxShadow:
                  '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                About {product.name}
                <div className="h-1 flex-1 bg-gradient-to-r from-[#7d42fb] to-transparent rounded"></div>
              </h2>

              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-r from-[#f8faff] to-[#ecf2ff] rounded-2xl p-8 border border-[#cbd7ea]">
                  {product.overview ? (
                    <>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        What is {product.name}?
                      </h3>
                      <p className="text-gray-800 leading-relaxed mb-6">
                        {product.overview}
                      </p>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        Key Features:
                      </h3>
                      <p className="text-gray-800 leading-relaxed mb-6">
                        {product.key_features}
                      </p>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        What you can do with {product.name}:
                      </h3>
                      <p className="text-gray-800 leading-relaxed mb-6">
                        {product.what_you_can_do_with}
                      </p>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        Benefits:
                      </h3>
                      <p className="text-gray-800 leading-relaxed mb-6">
                        {product.benefits}
                      </p>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        Pricing Plans
                      </h3>
                      <p className="text-gray-800 leading-relaxed mb-6">
                        {product.pricing_plans}
                      </p>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        Tips & Best Practices
                      </h3>
                      <p className="text-gray-800 leading-relaxed mb-6">
                        {product.tips_best_practices}
                      </p>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        Final Thoughts
                      </h3>
                      <p className="text-gray-800 leading-relaxed mb-6">
                        {product.final_take}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-800 leading-relaxed mb-6">
                        {product.name} represents a cutting-edge solution in the{' '}
                        {product.tag.toLowerCase()} space, designed to
                        revolutionize how professionals and businesses approach
                        their daily workflows. This innovative AI-powered tool
                        combines advanced machine learning algorithms with
                        intuitive user interface design to deliver exceptional
                        results.
                      </p>
                      <p className="text-gray-800 leading-relaxed mb-6">
                        What sets {product.name} apart is its comprehensive
                        approach to solving complex challenges through
                        intelligent automation and data-driven insights. Users
                        consistently report significant improvements in
                        productivity, accuracy, and overall satisfaction.
                      </p>
                      <p className="text-gray-800 leading-relaxed">
                        With regular updates and continuous improvements based
                        on user feedback, {product.name}
                        continues to set new standards in the{' '}
                        {product.tag.toLowerCase()} industry.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div
              className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
              style={{
                boxShadow:
                  '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  User Reviews
                </h2>
                <div className="flex items-center gap-2">
                  {renderStarRating(Math.round(parseFloat(getAverageRating())))}
                  <span className="text-2xl font-bold text-gray-800">
                    {getAverageRating()}
                  </span>
                  <span className="text-gray-600">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Write Review Form */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Write a Review
                </h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                    <input
                      type="text"
                      value={newReview.userName}
                      onChange={(e) =>
                        setNewReview((prev) => ({
                          ...prev,
                          userName: e.target.value,
                        }))
                      }
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7d42fb] focus:border-transparent"
                      placeholder="Your name"
                      required
                    />
                    <div className="flex items-center gap-2">
                      {renderStarRating(newReview.rating, true, (rating) =>
                        setNewReview((prev) => ({ ...prev, rating }))
                      )}
                      <span className="text-sm text-gray-600">
                        {newReview.rating > 0
                          ? `${newReview.rating} stars`
                          : 'Select rating'}
                      </span>
                    </div>
                  </div>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7d42fb] focus:border-transparent resize-none"
                    placeholder="Share your experience..."
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="bg-[#7d42fb] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#6b38e6] transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews
                  .slice(0, showAllReviews ? reviews.length : 3)
                  .map((review) => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#7d42fb] rounded-full flex items-center justify-center text-white font-bold">
                            <FaUser size={20} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review.userName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStarRating(review.rating)}
                              <span className="text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                      <button
                        onClick={() => handleHelpfulClick(review.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          review.isHelpful
                            ? 'bg-[#7d42fb] text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <FaThumbsUp size={14} />
                        Helpful ({review.helpfulCount})
                      </button>
                    </div>
                  ))}
              </div>

              {reviews.length > 3 && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    {showAllReviews
                      ? 'Show Less'
                      : `Show All ${reviews.length} Reviews`}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Featured Tools */}
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-transparent bg-clip-padding relative sticky top-8 overflow-hidden"
              style={{
                boxShadow:
                  '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="absolute inset-0 rounded-2xl p-[2px] bg-[length:200%_100%] animate-gradient-x">
                <div className="bg-white rounded-2xl w-full h-full"></div>
              </div>

              <div className="relative z-10 p-6 -m-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#7d42fb] to-[#9b59ff] rounded-xl flex items-center justify-center">
                    <FiStar className="text-white" size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Featured Tools
                  </h3>
                </div>

                <div className="space-y-3">
                  {featuredTools.map((tool, index) => (
                    <a
                      key={index}
                      href={tool.link}
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group border border-gray-100 hover:border-[#7d42fb]/30 hover:shadow-md"
                    >
                      <div className="relative">
                        <img
                          src={tool.logo}
                          alt={tool.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm"
                        />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#7d42fb] to-[#9b59ff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-gray-900 group-hover:text-[#7d42fb] transition-colors block truncate">
                          {tool.name}
                        </span>
                        <span className="text-xs text-gray-500 group-hover:text-gray-600">
                          Featured Tool
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <FiExternalLink
                          size={18}
                          className="text-gray-400 group-hover:text-[#7d42fb] transition-colors group-hover:transform group-hover:scale-110 duration-300"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Promote Tool Widget */}
            <div className="bg-gradient-to-br from-[#7d42fb] to-[#9b59ff] rounded-2xl shadow-lg p-6 border border-purple-200 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-10 -mb-10"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 rounded-full p-2">
                    <FiCode size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Promote {product.name}
                    </h3>
                    <p className="text-white/80 text-sm">
                      Share this amazing tool
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
                  <div className="bg-white rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src="/logo.png"
                        alt="AI Tools Cover"
                        className="w-4 h-4 object-contain"
                      />
                      <a
                        href="https://aitoolscover.com"
                        target="_blank"
                        className="text-xs text-gray-600 font-medium hover:text-purple-600 transition-colors"
                      >
                        Featured on AIToolsCover.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/90 text-sm font-medium">
                      Widget Code
                    </span>
                    <button
                      onClick={() => {
                        const widgetCode = `<div style="max-width: 220px; padding: 12px; background: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; border: 1px solid #e5e7eb;">
  <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
    <img src="${window.location.origin}/logo.png" alt="AI Tools Cover" style="width: 16px; height: 16px; object-fit: contain;" />
    <a href="https://aitoolscover.com" target="_blank" style="font-size: 12px; color: #6b7280; text-decoration: none; font-weight: 500; transition: color 0.2s;" onmouseover="this.style.color='#7c3aed'" onmouseout="this.style.color='#6b7280'">
      Featured on AIToolsCover.com
    </a>
  </div>
</div>`;
                        navigator.clipboard.writeText(widgetCode);
                        toast.success('Widget code copied to clipboard!', {
                          duration: 3000,
                          position: 'top-right',
                          style: {
                            background: '#10b981',
                            color: 'white',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            padding: '10px 15px',
                          },
                        });
                      }}
                      className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      <FiCopy size={12} />
                      Copy
                    </button>
                  </div>
                  <div className="text-green-400 font-mono text-xs overflow-hidden">
                    <div className="opacity-70">
                      &lt;div style="max-width: 220px..."&gt;
                    </div>
                    <div className="ml-2 opacity-50">
                      // Widget with logo and attribution
                    </div>
                    <div className="opacity-70">&lt;/div&gt;</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const shareText = `Check out ${product.name} - ${product.description.substring(0, 100)}... ${window.location.href}`;
                      if (navigator.share) {
                        navigator.share({
                          title: product.name,
                          text: shareText,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(shareText);
                        toast.success('Share link copied to clipboard!');
                      }
                    }}
                    className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 border border-white/10"
                  >
                    <FiShare2 size={16} />
                    Share
                  </button>
                  <button
                    onClick={() => {
                      const badgeCode = `<a href="aitoolscover.com" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
  <img src="${window.location.origin}/logo.png" alt="Featured on AIToolsCover.com" style="width: 20px; height: 20px; border-radius: 4px;" />
  Featured on AIToolsCover.com
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M7 17L17 7M17 7H7M17 7V17"/>
  </svg>
</a>`;
                      navigator.clipboard.writeText(badgeCode);
                      toast.success('Badge code copied to clipboard!', {
                        duration: 3000,
                        position: 'top-right',
                        style: {
                          background: '#10b981',
                          color: 'white',
                          fontWeight: 'bold',
                          borderRadius: '8px',
                          padding: '10px 15px',
                        },
                      });
                    }}
                    className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 border border-white/10"
                  >
                    <FiCode size={16} />
                    Badge
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-white/70 text-xs text-center">
                    Help others discover amazing AI tools like {product.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal for full-size image */}
          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={() => setIsModalOpen(false)}
            >
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
              <div className="relative z-10 max-w-[90vw] max-h-[90vh] overflow-hidden rounded-lg">
                <button
                  className="absolute top-4 right-4 bg-white/80 rounded-full p-2 text-black hover:bg-white z-20"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <img
                  src={product.thumbnail || product.image}
                  alt={product.name}
                  className="object-contain max-h-[90vh] max-w-[90vw]"
                />
              </div>
            </div>
          )}

          {/* Embed Code Modal */}
          {showEmbedCode && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setShowEmbedCode(false)}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
              <div
                className="relative bg-white rounded-2xl p-8 max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold mb-4">Embed Code</h3>
                <p className="text-gray-600 mb-4">
                  Copy this code to embed the tool on your website:
                </p>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto mb-4">
                  {embedCode}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={copyEmbedCode}
                    className="bg-[#7d42fb] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#6b38e6] transition-colors flex items-center gap-2"
                  >
                    {copiedEmbed ? <FiCheck size={16} /> : <FiCopy size={16} />}
                    {copiedEmbed ? 'Copied!' : 'Copy Code'}
                  </button>
                  <button
                    onClick={() => setShowEmbedCode(false)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Loading Overlay */}
          {isSubmittingReview && (
            <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7d42fb] mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">
                  Submitting your review...
                </p>
              </div>
            </div>
          )}

          {/* Success Toast */}
          {copiedEmbed && (
            <div className="fixed top-8 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
              <FiCheck size={20} />
              <span>Embed code copied to clipboard!</span>
            </div>
          )}
        </div>

        {/* Similar Tools */}
        <div className="m-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Similar Tools</h2>

          {similarToolsLoading && (
            <div className="flex justify-center items-center h-32">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-4 border-[#7d42fb] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-semibold text-gray-700">
                  Loading similar tools...
                </span>
              </div>
            </div>
          )}

          {similarToolsError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-600 font-medium">{similarToolsError}</p>
            </div>
          )}

          {!similarToolsLoading &&
            !similarToolsError &&
            similarTools.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-600 font-medium">
                  No similar tools found for this category.
                </p>
              </div>
            )}

          {!similarToolsLoading && similarTools.length > 0 && (
            <section className="w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {similarTools.map((tool) => (
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
                              <span className="text-xs text-gray-500 ml-1">
                                5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label={isFavorite(tool._id) ? 'Remove from favorites' : 'Add to favorites'}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(tool);
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
                          AI Tool
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
          )}
        </div>

        {/* Custom Styles */}
        <style jsx>{`
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes gradient-x {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }

          .animate-gradient-x {
            animation: gradient-x 3s ease infinite;
          }

          .prose p {
            margin-bottom: 1rem;
          }

          .prose p:last-child {
            margin-bottom: 0;
          }
        `}</style>
      </div>
    </div>
  );
}

export default ToolDetailClient;