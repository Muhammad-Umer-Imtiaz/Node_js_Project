'use client';
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { categories } from "@/constants";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper function to create a clean slug (e.g., "Writing & Editing" -> "writing-editing")
  const createCategorySlug = (label: string): string =>
    label
      .replace(/&/g, '')                // Remove ampersand
      .replace(/[^\w\s-]/g, '')         // Remove other special chars except hyphen
      .replace(/\s+/g, '-')             // Replace spaces with hyphens
      .replace(/-+/g, '-')              // Collapse multiple hyphens
      .replace(/^-+|-+$/g, '')          // Trim leading/trailing hyphens
      .toLowerCase();

  const handleCategoryClick = (category: string) => {
    const categorySlug = createCategorySlug(category);
    router.push(`/category/${categorySlug}`);
    setIsMobileOpen(false); // Close mobile menu after selection
  };

  const isActiveCategory = (category: string) => {
    const categorySlug = createCategorySlug(category);
    return pathname === `/category/${categorySlug}`;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes staggerFadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .sidebar-container {
          animation: slideInFromLeft 0.6s ease-out;
        }

        .sidebar-header {
          animation: fadeInScale 0.8s ease-out 0.2s both;
        }

        .category-item {
          animation: staggerFadeIn 0.5s ease-out both;
        }

        .category-item:nth-child(1) { animation-delay: 0.3s; }
        .category-item:nth-child(2) { animation-delay: 0.4s; }
        .category-item:nth-child(3) { animation-delay: 0.5s; }
        .category-item:nth-child(4) { animation-delay: 0.6s; }
        .category-item:nth-child(5) { animation-delay: 0.7s; }
        .category-item:nth-child(6) { animation-delay: 0.8s; }
        .category-item:nth-child(7) { animation-delay: 0.9s; }
        .category-item:nth-child(8) { animation-delay: 1.0s; }
        .category-item:nth-child(9) { animation-delay: 1.1s; }
        .category-item:nth-child(10) { animation-delay: 1.2s; }
        .category-item:nth-child(11) { animation-delay: 1.3s; }
        .category-item:nth-child(12) { animation-delay: 1.4s; }

        .toggle-button {
          animation: fadeInScale 1s ease-out 0.5s both;
        }

        /* Smooth transitions */
        .sidebar-container {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .category-item {
          transition: all 0.3s ease;
        }

        /* Mobile overlay */
        .mobile-overlay {
          backdrop-filter: blur(4px);
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          sidebar-container fixed top-0 left-0 h-full bg-white z-40
          transition-all duration-300 ease-in-out border-r-2 border-gray-100
          ${isCollapsed ? 'w-16' : 'w-70'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:h-screen
          ${isLoaded ? 'loaded' : ''}
        `}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header px-4 pt-4 bg-white">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-[#7d42fb] font-bold text-lg">Categories</h2>
            )}
            <button
              onClick={toggleSidebar}
              className="toggle-button hidden lg:flex items-center justify-center w-8 h-8 bg-[#7d42fb] hover:bg-[#7d42fb]/130 rounded-full transition-all duration-300 transform hover:scale-110"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight size={16} className="text-white" />
              ) : (
                <ChevronLeft size={16} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {categories.map(({ label, emoji }, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(label)}
              className={`category-item w-full text-left px-3 py-3 rounded-lg font-medium text-sm group relative overflow-hidden transition-all duration-300 transform hover:scale-105 hover:translate-x-1 ${
                isActiveCategory(label)
                  ? 'bg-[#7d42fb] text-white shadow-lg'
                  : 'text-gray-700 hover:bg-[#ecf2ff] hover:text-[#7d42fb] hover:shadow-md'
              }`}
              style={{ 
                animationDelay: `${0.3 + index * 0.1}s`,
                opacity: 0
              }}
              title={isCollapsed ? label : ''}
            >
              {!isActiveCategory(label) && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#7d42fb]/5 to-[#6a35d9]/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg"></div>
              )}
              
              <span className={`relative z-10 ${isCollapsed ? 'sr-only lg:not-sr-only lg:text-xs lg:text-center lg:block' : ''}`}>
                {isCollapsed ? emoji : `${emoji} ${label}`}
              </span>
              
              {isCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </button>
          ))}

        </div>

      </aside>
    </>
  );
};

export default Sidebar;