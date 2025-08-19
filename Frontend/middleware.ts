import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define your categories and features
const CATEGORIES = ['productivity', 'text-generators', 'business-tools', 'image-tools', 'video-tools', 'automation-tools', 'art-generators', 'audio-generators', 'code-tools'];

const FEATURES = [
  // Productivity Features
  'personal-assistant',
  'research',
  'spreadsheets',
  'presentations',
  'search-engine',
  'translation',
  'email-assistants',
  
  // Business Tools Features
  'website-builders',
  'marketing',
  'finance',
  'project-management',
  'social-media',
  'education',
  'e-commerce',
  'seo',
  'customer-support',
  'human-resources',
  'sales-assistant',
  'stock-trading',
  'legal',
  'teachers',
  'startup-tools',
  'real-estate',
  'blockchain',
  'nft',
  'web3',
  
  // Video Tools Features
  'video-enhancer',
  'video-editing',
  'video-generators',
  'text-to-video',
  
  // Text Generator Features
  'prompt-generators',
  'writing-generators',
  'email-generators',
  'paraphrasing',
  'copywriting',
  'storyteller',
  'summarizer',
  
  // Image Tools Features
  'design-generators',
  'image-generators',
  'image-editing',
  'text-to-image',
  
  // Automation Tools Features
  'workflows',
  'ai-agents',
  
  // Art Generator Features
  'cartoon-generators',
  'portrait-generators',
  'avatar-generators',
  'logo-generator',
  '3d-art',
  
  // Audio Generator Features
  'audio-editing',
  'text-to-speech',
  'transcriber',
  'music',
  
  // Code Tools Features
  'code-assistant',
  'low-code-no-code',
  'sql'
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if it's an AI tools route
  if (pathname.startsWith('/ai-tools/')) {
    const slug = pathname.split('/ai-tools/')[1];
    
    // Skip if it's the main page or has additional path segments
    if (!slug || slug.includes('/')) {
      return NextResponse.next();
    }
    
    // Check if it's a feature first (higher priority)
    if (FEATURES.includes(slug)) {
      // Rewrite to feature page
      return NextResponse.rewrite(new URL(`/ai-tools/features/${slug}`, request.url));
    }
    
    // Then check if it's a category
    if (CATEGORIES.includes(slug)) {
      // Let it go to category page normally
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/ai-tools/:path*',
};