// components/CompleteFooterSection.js
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { categories } from "@/constants";

// Publish Tools Section Component
function PublishToolsSection() {
  const [link, setLink] = useState('/login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token provided");
      setLink('/login');
    } else {
      console.log("Token:", token);
      setLink('/submit');
    }
  }, []);
  return (
    <section className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Free Tool Container */}
          <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 w-full min-h-[280px] sm:min-h-[320px]">
            {/* Background Circle */}
            <div className="absolute top-4 right-4 w-60 h-60 sm:w-80 sm:h-80 bg-gray-300 rounded-full opacity-30 transform translate-x-16 sm:translate-x-20 -translate-y-16 sm:-translate-y-20"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                {/* Icon */}
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M7 13L10 16L17 9M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="white"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">
                  Publish a free tool!
                </h3>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base font-medium mb-6 sm:mb-8 leading-relaxed">
                  We continuously seek the newest and most innovative AI tools to enhance our directory.
                </p>
              </div>

              {/* Button */}
              <Link href={link}>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
                  Publish now
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M5 12H19M19 12L12 5M19 12L12 19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* Featured Tool Container */}
          <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 sm:p-8 lg:p-12 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 w-full min-h-[280px] sm:min-h-[320px]">
            {/* Background Circle */}
            <div className="absolute top-4 right-4 w-60 h-60 sm:w-80 sm:h-80 bg-purple-500 rounded-full opacity-20 transform translate-x-16 sm:translate-x-20 -translate-y-16 sm:-translate-y-20"></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                {/* Icon */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" 
                      stroke="purple" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      fill="purple"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                  Publish a featured tool!
                </h2>

                {/* Description */}
                <p className="text-purple-100 text-sm sm:text-base font-medium mb-6 sm:mb-8 leading-relaxed">
                  We explore the internet and social media platforms to list AI tools, so we'll likely find and feature yours.
                </p>
              </div>

              {/* Button */}
              <Link href={link}>
                <button className="bg-black hover:bg-gray-800 text-white font-semibold px-6 sm:px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 w-full sm:w-auto">
                  Publish now
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M5 12H19M19 12L12 5M19 12L12 19" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-white py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Image src="/logo.png" alt="logo" width={50} height={50} />
              <span className="font-bold text-xl text-black ml-2">Tools Cover</span>
            </div>
            <p className="text-[#4a4a4a] font-medium text-sm leading-relaxed">
              Never miss out on the latest developments in AI. AI Tools Cover
              delivers daily updates on new tools, ensuring you stay informed
              about the freshest and most impactful technologies.
            </p>
          </div>

          {/* AI Tools Column */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 text-black">AI Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <ul className="space-y-3">
                  {categories.slice(0, 9).map((tool, index) => (
                    <li key={tool.label}>
                      <Link href={`/category/${tool.label}`}>
                        <span className="text-[#4a4a4a] font-medium text-sm hover:text-purple-600 cursor-pointer transition-colors duration-200">
                          Best AI {tool.label} Tools
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  {categories.slice(9, 18).map((tool, index) => (
                    <li key={tool.label}>
                      <Link href={`/category/${tool.label}`}>
                        <span className="text-[#4a4a4a] font-medium text-sm hover:text-purple-600 cursor-pointer transition-colors duration-200">
                          Best AI {tool.label} Tools
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Support & Contact Column */}
          <div className="lg:col-span-1">
            {/* Support Section */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4 text-black">Support</h3>
              <ul className="space-y-3">
                {["Submit Tool", "Update Tool", "Contact"].map((item) => (
                  <li key={item}>
                    <Link href={`/submit`}>
                      <span className="text-[#4a4a4a] font-medium text-sm hover:text-purple-600 cursor-pointer transition-colors duration-200">
                        {item}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Section */}
            <div>
              <h3 className="font-bold text-lg mb-4 text-black">Contact</h3>
              <a
                href="mailto:info@aitoolscover.com"
                className="text-[#4a4a4a] font-medium text-sm hover:text-purple-600 transition-colors duration-200 block mb-4"
              >
                info@aitoolscover.com
              </a>

              <div className="flex space-x-3 mb-4">
                <Link
                  href="https://twitter.com/aitoolscover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors duration-200">
                    {/* X (Twitter) */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </Link>
                <Link
                  href="https://linkedin.com/company/aitoolscover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors duration-200">
                    {/* LinkedIn */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </Link>
                <Link
                  href="https://www.instagram.com/aitoolscover_"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200">
                    {/* Instagram */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2" fill="none"/>
                      <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" fill="none"/>
                      <circle cx="17" cy="7" r="1.2" fill="white"/>
                    </svg>
                  </div>
                </Link>
                <Link
                  href="https://www.facebook.com/aitoolscover"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-800 transition-colors duration-200">
                    {/* Facebook */}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
              
              <StartupFame />
            </div>
          </div>
        </div>
      </div>
      <CopyRight />
    </footer>
  );
}

function StartupFame() {
  return (
    <a href="https://startupfa.me/s/ai-tools-cover?utm_source=aitoolscover.com" target="_blank"><img src="https://startupfa.me/badges/featured/dark-rounded.webp" alt="Featured on Startup Fame" width="171" height="54" /></a>
  );
};

const CopyRight = () => (
    <div className="max-w-4xl mx-auto">
      <div className="border-t border-gray-200 bg-white rounded-lg shadow-sm p-6 mt-8">
        <div className="text-center text-gray-700 text-sm">
          <div className="mb-2 font-medium">© Copyright aitoolscover.com All Rights Reserved</div>
          <div className="flex justify-center items-center space-x-6 text-xs">
            <Link href="/privacy-policy" className="hover:text-purple-600 cursor-pointer transition-colors duration-200 hover:underline">
              Privacy Policy
            </Link>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <Link href="/terms" className="hover:text-purple-600 cursor-pointer transition-colors duration-200 hover:underline">
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </div>
);

// Complete Footer Section Export
export default function CompleteFooterSection() {
  return (
    <>
      <PublishToolsSection />
      <Footer />
    </>
  );
}