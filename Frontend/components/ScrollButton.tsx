"use client";
import { useEffect, useState } from 'react';
import { scrollToTop, scrollToBottom } from '../utils/scroll'; // Adjust path as needed

const ScrollButton = ({ type = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (type === 'top') {
      setIsVisible(window.scrollY > 100); // Show after scrolling down 100px
    } else if (type === 'bottom') {
      const { scrollHeight, clientHeight, scrollTop } = document.documentElement;
      setIsVisible(scrollTop + clientHeight < scrollHeight - 100); // Show if not near bottom
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [type]);

  const handleClick = () => {
    if (type === 'top') {
      scrollToTop();
    } else if (type === 'bottom') {
      scrollToBottom();
    }
  };

  // Icon components
  const ChevronUpIcon = () => (
    <svg 
      className="w-6 h-6" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2.5} 
        d="M5 15l7-7 7 7" 
      />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg 
      className="w-6 h-6" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2.5} 
        d="M19 9l-7 7-7-7" 
      />
    </svg>
  );

  return (
    <button
      onClick={handleClick}
      style={{ zIndex: 9999 }}
      className={`
        fixed bottom-6 right-6 
        w-14 h-14 
        rounded-full 
        bg-[#7d42fb]
        text-white 
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 hover:-translate-y-1
        active:scale-95
        border-2 border-white/20
        backdrop-blur-sm
        group
        ${isVisible 
          ? 'opacity-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
      aria-label={type === 'top' ? 'Scroll to top' : 'Scroll to bottom'}
    >
      <div className="relative overflow-hidden w-full h-full rounded-full flex items-center justify-center">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-white/10 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
        
        {/* Icon with animation */}
        <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">
          {type === 'top' ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </div>
        
        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-full bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-150"></div>
      </div>
    </button>
  );
};

export default ScrollButton;