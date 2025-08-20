'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiExternalLink, FiHeart, FiStar } from 'react-icons/fi';
import {FaArrowLeft,FaFacebookF,FaWhatsapp,FaLinkedinIn,FaTwitter,FaHeart,FaStar,FaUser,FaThumbsUp, FaFlag,} from 'react-icons/fa';
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
  id: number;
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

export default function ToolDetailClient({
  slug,
  searchParams,
}: ToolDetailClientProps) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [similarTools, setSimilarTools] = useState<SimilarTool[]>([]);
  const [similarToolsLoading, setSimilarToolsLoading] = useState(false);
  const [similarToolsError, setSimilarToolsError] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    userName: '',
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  useEffect(() => {
    const dummyReviews: Review[] = [
      {
        id: '1',
        userName: 'Alex Johnson',
        rating: 5,
        comment:
          'Absolutely fantastic tool! It has completely transformed my workflow and saved me countless hours. The interface is intuitive and the results are consistently impressive.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        helpfulCount: 12,
      },
      {
        id: '2',
        userName: 'Sarah Chen',
        rating: 4,
        comment:
          'Great tool with excellent features. The AI capabilities are really impressive and it integrates well with my existing workflow. Minor room for improvement in speed.',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        helpfulCount: 8,
      },
      {
        id: '3',
        userName: 'Mike Rodriguez',
        rating: 5,
        comment:
          'This is exactly what I was looking for! The quality of output is exceptional and customer support is very responsive. Highly recommended!',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        helpfulCount: 15,
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
      const toolToRemove = favorites.find((tool) => tool.id === toolId);

      const updatedFavorites = favorites.filter((tool) => tool.id !== toolId);
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
      return favorites.some((tool) => tool.id === toolId);
    };

    const toggleFavorite = (tool: { id: number }) => {
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
      toggleFavorite,
    };
  };

  const { isFavorite, toggleFavorite } = useFavorites();
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

    try {
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

      toast.success('Review submitted successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#7d42fb',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '8px',
          padding: '10px 15px',
        },
      });
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
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
    if (reviews.length === 0) return '0.0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const fetchSimilarTools = async (tag: string) => {
    if (!tag) return;

    setSimilarToolsLoading(true);
    setSimilarToolsError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/suggestions?tag=${encodeURIComponent(tag)}`
        // `/api/tools/similar/?tag=${encodeURIComponent(tag)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SimilarToolsResponse = await response.json();
      setSimilarTools(data.results || []);
    } catch (error) {
      console.error('Error fetching similar tools:', error);
      setSimilarToolsError('Failed to load similar tools');
      setSimilarTools([]);
    } finally {
      setSimilarToolsLoading(false);
    }
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

  const storeProductData = (product: SimilarTool): void => {
    if (typeof window !== 'undefined') {
      try {
        const productData = {
          id: product.id.toString(),
          name: product.name,
          image: product.image_url,
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

  useEffect(() => {
    const loadProduct = () => {
      const isNumericId = /^\d+$/.test(slug);

      if (isNumericId) {
        const featuredProduct = featuredProducts.find(
          (item) => item.id.toString() === slug
        );
        if (featuredProduct) {
          setProduct(featuredProduct);
          setLoading(false);
          return;
        }
      }
      if (searchParams.name && searchParams.description) {
        const productFromParams = {
          id: slug,
          name: searchParams.name as string,
          image: (searchParams.image as string) || '/api/placeholder/400/300',
          thumbnail:
            (searchParams.thumbnail as string) || '/api/placeholder/400/300',
          logo:
            (searchParams.logo as string) ||
            (searchParams.image as string) ||
            '/api/placeholder/50/50',
          description: searchParams.description as string,
          tag:
            (searchParams.category as string) ||
            (searchParams.tag as string) ||
            'AI Tool',
          tagIcon: (searchParams.tagIcon as string) || '',
          link: (searchParams.link as string) || '#',
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

            if (productSlug === slug) {
              setProduct(data);
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

  if (loading) {
    return (
      <div className="p-8 ml-10">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-[#7d42fb] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-semibold text-gray-700">
              Loading product...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="p-8 ml-10">
        <Link
          href="/"
          className="flex gap-2 items-center text-[#000418] font-bold hover:underline mb-8"
        >
          <FaArrowLeft size={15} /> <span>Browse all tools</span>
        </Link>
        <div className="flex justify-center items-center h-64">
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
      </div>
    );
  }

  const isApiProduct = !featuredProducts.find(
    (item) => item.id.toString() === slug
  );

  return (
    <div className="p-8 ml-10">
      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-10">
        <div className="flex flex-col gap-6 mt-0">
          <div className="flex gap-2">
            <img src={product.logo} alt={product.name} height={40} width={40} />
            <h1 className="text-[#000000] text-3xl font-bold">
              {product.name}
            </h1>
          </div>

          <Link
            href={product.link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white bg-[#7d42fb] border-2 border-black px-3 py-3 w-40 rounded-xl font-semibold hover:bg-black transition hover:-translate-y-1 text-center"
          >
            Visit Website
          </Link>
          <div>
            <h3 className="text-[#000000] font-bold text-2xl">Overview</h3>
            <p className="text-[#000000] text-md font-semibold leading-8 w-130">
              {product.description}
            </p>
          </div>
          <p className="text-xl text-[#000000] font-bold">
            Category:
            <span className="bg-[#ecf2ff] ml-4 px-5 py-1 text-sm font-semibold rounded-full">
              {product.tag}
            </span>
          </p>
          <div className="flex items-center space-x-4">
            <p className="text-xl text-[#000000] font-bold">Share this on:</p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Facebook"
                className="bg-[#3b5998] text-white rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaFacebookF size={16} />
              </a>
              <a
                href="https://api.whatsapp.com/send?text=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on WhatsApp"
                className="bg-[#25D366] text-white rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaWhatsapp size={16} />
              </a>
              <a
                href="https://www.linkedin.com/shareArticle?mini=true&url=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on LinkedIn"
                className="bg-[#0e76a8] text-white rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaLinkedinIn size={16} />
              </a>
              <a
                href="https://twitter.com/intent/tweet?url=YOUR_URL"
                target="_blank"
                rel="noopener noreferrer"
                title="Share on Twitter"
                className="bg-[#1DA1F2] text-white rounded-full p-2 hover:scale-110 transition-transform"
              >
                <FaTwitter size={16} />
              </a>
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-0.5 border border-gray-100 cursor-pointer relative flex items-center justify-center flex items-center justify-center w-[500px] h-[500px]"
          style={{
            height: '300px',
            borderColor: '#cbd7ea',
            boxShadow: '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d',
          }}
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              '0 0 2px 0 #24417a14, 2px 2px 9px 0 #290058';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              '0 0 2px 0 #24417a14, 0 2px 6px 0 #2900577d';
          }}
        >
          <Image
            src={product.thumbnail || '/api/placeholder/400/300'}
            alt={product.name}
            width={500}
            height={500}
            sizes="500px"
            className="object-fill w-full h-full rounded-2xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/api/placeholder/400/300';
            }}
            unoptimized
          />
        </div>
      </div>

      {/* Modal overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div
            className="relative z-10 max-w-[90vw] max-h-[90vh] overflow-hidden rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-white/80 rounded-full p-2 text-black hover:bg-white"
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
            <Image
              src={product.thumbnail || '/api/placeholder/400/300'}
              alt={product.name}
              width={1000}
              height={1000}
              sizes="90vw"
              className="object-contain max-h-[90vh] max-w-[90vw]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/api/placeholder/400/300';
              }}
              unoptimized
            />
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row gap-8 mt-16 mb-16">
        <div className="flex-1 lg:max-w-[calc(100%-424px)]">
          <h2 className="text-3xl font-bold mb-8 text-black">
            About {product.name}
          </h2>
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-[#f8faff] to-[#ecf2ff] rounded-2xl p-8 mb-8 border border-[#cbd7ea]">
              <p className="text-gray-800 text-lg leading-relaxed mb-6">
                {product.name} represents a cutting-edge solution in the{' '}
                {product.tag.toLowerCase()} space, designed to revolutionize how
                professionals and businesses approach their daily workflows.
                This innovative AI-powered tool combines advanced machine
                learning algorithms with intuitive user interface design to
                deliver exceptional results that exceed user expectations.
                Whether you're a seasoned professional or just starting your
                journey in the digital landscape, {product.name} provides the
                perfect balance of sophistication and accessibility.
              </p>
              <p className="text-gray-800 text-lg leading-relaxed mb-6">
                What sets {product.name} apart from other tools in the market is
                its comprehensive approach to solving complex challenges through
                intelligent automation and data-driven insights. The platform
                leverages state-of-the-art artificial intelligence to analyze
                patterns, predict outcomes, and provide actionable
                recommendations that drive measurable results. Users
                consistently report significant improvements in productivity,
                accuracy, and overall satisfaction when integrating{' '}
                {product.name} into their existing workflows.
              </p>
              <p className="text-gray-800 text-lg leading-relaxed">
                The development team behind {product.name} has invested
                countless hours in research and development to ensure that every
                feature serves a specific purpose and adds genuine value to the
                user experience. From seamless integration capabilities to
                robust security measures, every aspect of the tool has been
                carefully crafted to meet the evolving needs of modern
                businesses. With regular updates and continuous improvements
                based on user feedback, {product.name} continues to set new
                standards in the {product.tag.toLowerCase()} industry.
              </p>
            </div>
          </div>
        </div>
        <aside className="w-full lg:w-[400px] lg:sticky lg:top-8 lg:self-start">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-black">
            Featured Tools
          </h2>
          <ul className="space-y-6">
            {featuredTools.map((tool, index) => (
              <Link href={tool.link} target="_blank" key={index}>
                <li
                  key={index}
                  className="flex items-center justify-between p-3 py-5 border border-[#cecece] rounded-xl transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={tool.logo}
                      alt={tool.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-medium text-black">{tool.name}</span>
                  </div>
                  <FiExternalLink size={24} className="text-[#7d42fb]" />
                </li>
              </Link>
            ))}
          </ul>
        </aside>
      </div>
      <div className="mt-16 mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-black">User Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStarRating(Math.round(parseFloat(getAverageRating())))}
              <span className="text-2xl font-bold text-gray-800">
                {getAverageRating()}
              </span>
              <span className="text-gray-600">({reviews.length} reviews)</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-[#cbd7ea] shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-black mb-6">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={newReview.userName}
                  onChange={(e) =>
                    setNewReview((prev) => ({
                      ...prev,
                      userName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7d42fb] focus:border-transparent transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {renderStarRating(newReview.rating, true, (rating) =>
                    setNewReview((prev) => ({ ...prev, rating }))
                  )}
                  <span className="text-sm text-gray-600 ml-2">
                    {newReview.rating > 0
                      ? `${newReview.rating} star${newReview.rating > 1 ? 's' : ''}`
                      : 'Select rating'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#7d42fb] focus:border-transparent transition-all resize-none"
                placeholder="Share your experience with this tool..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="bg-[#7d42fb] text-white px-8 py-3 rounded-xl font-semibold hover:bg-black transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
        <div className="space-y-6">
          {reviews
            .slice(0, showAllReviews ? reviews.length : 3)
            .map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 border border-[#cbd7ea] shadow-sm hover:shadow-md transition-shadow"
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
                  <button className="text-gray-400 hover:text-gray-600 p-2">
                    <FaFlag size={16} />
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {review.comment}
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleHelpfulClick(review.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      review.isHelpful
                        ? 'bg-[#7d42fb] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <FaThumbsUp size={14} />
                    <span className="text-sm">
                      Helpful ({review.helpfulCount})
                    </span>
                  </button>
                </div>
              </div>
            ))}
        </div>
        {reviews.length > 3 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              {showAllReviews
                ? 'Show Less Reviews'
                : `Show All ${reviews.length} Reviews`}
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row px-4 md:px-6 py-10 gap-8 mt-10">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-6 text-black">Similar Tools</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {similarTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tool/${createSlug(tool.name)}`}
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
                          link: tool.link,
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
                    <p className="text-gray-600 text-sm mb-4 overflow-hidden text-ellipsis line-clamp-3 max-h-[4.5em]">
                      {tool.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {(tool.views ?? 0) > 0 && (
                          <span>{tool.views} views</span>
                        )}
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
        </div>
      </div>
    </div>
  );
}
