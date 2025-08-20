"use client";
import { useState } from "react";

const SubmitToolForm = () => {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [image_url, setimage_url] = useState('');
  const [thumbnail_url, setthumbnail_url] = useState('');
  const [category, setCategory] = useState('');
  const [overview, setoverview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const categories = [
    'Business & Productivity',
    'Education & Knowledge',
    'Environmental',
    'Food & Nutrition',
    'Government & Public Sector',
    'Health & Wellness',
    'Language & Communication',
    'Media & Entertainment',
    'NFT & Blockchain',
    'Personal & Lifestyle',
    'Security & Privacy',
    'Sports',
    'Tech & Engineering',
    'Travel & Navigation',
    'Utilities & Tools',
    'Other',
  ];

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Validation
    if (!name || !link || !image_url || !category || !overview || !thumbnail_url) {
      setErrorMessage("Please fill in all required fields.");
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);

    const requestBody = {
      name: name.trim(),
      link: link.trim(),
      image_url: image_url.trim(),
      thumbnail_url: thumbnail_url.trim(),
      category: category,
      overview: overview.trim()
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/tool/addtool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
                credentials: 'include'

      });

      if (response.ok) {
        setIsSuccessModalOpen(true);
        // Reset form
        setName('');
        setLink('');
        setimage_url('');
        setthumbnail_url('');
        setCategory('');
        setoverview('');
      } else {
        handleSubmitForRegularSignupUsers({ preventDefault: () => {} });
        // const error = await response.json();
        // setErrorMessage(error.message || `Submission failed with status: ${response.status}`);
        // setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Network error. Please check your connection and try again.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForRegularSignupUsers = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Validation
    if (!name || !link || !image_url || !category || !overview || !thumbnail_url) {
      setErrorMessage("Please fill in all required fields.");
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);

    const requestBody = {
      name: name.trim(),
      link: link.trim(),
      image_url: image_url.trim(),
      thumbnail_url: thumbnail_url.trim(),
      category: category,
      overview: overview.trim()
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/tools/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Token ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setIsSuccessModalOpen(true);
        // Reset form
        setName('');
        setLink('');
        setimage_url('');
        setthumbnail_url('');
        setCategory('');
        setoverview('');
      } else {
        const error = await response.json();
        setErrorMessage(error.message || `Submission failed with status: ${response.status}`);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("Network error. Please check your connection and try again.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Submit Your AI Tool</h2>
          <p className="text-gray-600">Share your amazing AI tool with the community</p>
        </div>

        {/* Tool Name */}
        <div className="space-y-2">
          <label htmlFor="toolName" className="block text-sm font-semibold text-gray-700">
            Tool Name *
          </label>
          <input
            type="text"
            id="toolName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter tool name (e.g., ChatGPT, Midjourney)"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800"
            required
            disabled={isLoading}
          />
        </div>

        {/* Tool Link */}
        <div className="space-y-2">
          <label htmlFor="toolLink" className="block text-sm font-semibold text-gray-700">
            Tool Link *
          </label>
          <input
            type="url"
            id="toolLink"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800"
            required
            disabled={isLoading}
          />
        </div>

        {/* Image URL */}
        <div className="space-y-2">
          <label htmlFor="image_url" className="block text-sm font-semibold text-gray-700">
            Image URL *
          </label>
          <input
            type="url"
            id="image_url"
            value={image_url}
            onChange={(e) => setimage_url(e.target.value)}
            placeholder="https://example.com/tool-image.png"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800"
            required
            disabled={isLoading}
          />
          {image_url && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
              <img 
                src={image_url} 
                alt="Tool preview" 
                className="w-16 h-16 object-cover rounded-lg border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const errorDiv = target.nextElementSibling as HTMLElement;
                  target.style.display = 'none';
                  if (errorDiv) errorDiv.style.display = 'block';
                }}
              />
              <div className="hidden text-sm text-red-500">Invalid image URL</div>
            </div>
          )}
        </div>
        {/* Thumbnail URL */}
        <div className="space-y-2">
          <label htmlFor="thumbnail_url" className="block text-sm font-semibold text-gray-700">
            Thumbnail URL *
          </label>
          <input
            type="url"
            id="thumbnail_url"
            value={thumbnail_url}
            onChange={(e) => setthumbnail_url(e.target.value)}
            placeholder="https://example.com/tool-image.png"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800"
            required
            disabled={isLoading}
          />
          {thumbnail_url && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Thumbnail Preview:</p>
              <img 
                src={thumbnail_url} 
                alt="Tool preview" 
                className="w-16 h-16 object-cover rounded-lg border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const errorDiv = target.nextElementSibling as HTMLElement;
                  target.style.display = 'none';
                  if (errorDiv) errorDiv.style.display = 'block';
                }}
              />
              <div className="hidden text-sm text-red-500">Invalid thumbnail URL</div>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 bg-white"
            required
            disabled={isLoading}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* overview */}
        <div className="space-y-2">
          <label htmlFor="overview" className="block text-sm font-semibold text-gray-700">
            overview *
          </label>
          <textarea
            id="overview"
            value={overview}
            onChange={(e) => setoverview(e.target.value)}
            placeholder="Describe what your AI tool does and its key features..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-800 resize-none"
            required
            disabled={isLoading}
          />
          <div className="text-right text-sm text-gray-500">
            {overview.length}/500 characters
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Tool</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed bottom-4 right-4 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center transform">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-3">Success!</h3>
            <p className="text-gray-700 mb-6">Your AI tool has been submitted successfully. Thank you for contributing to our community!</p>
            <button
              onClick={closeSuccessModal}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {isErrorModalOpen && (
        <div className="fixed bottom-4 right-4 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center transform">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-3">Oops!</h3>
            <p className="text-gray-700 mb-6">{errorMessage}</p>
            <button
              onClick={closeErrorModal}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitToolForm;