import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'Browse AI Tools by Category - AI Tools Cover | Discover Best AI Solutions',
  description: 'Explore our comprehensive collection of AI tools organized by category. Find the perfect artificial intelligence solutions for business, productivity, design, development, and more.',
  keywords: [
    'AI tools',
    'artificial intelligence',
    'AI categories',
    'AI tools by category',
    'machine learning tools',
    'productivity AI',
    'business AI tools',
    'design AI tools',
    'development AI tools',
    'AI software',
    'AI applications',
    'browse AI tools',
    'AI tool directory',
    'best AI tools'
  ].join(', '),
  openGraph: {
    title: 'Browse AI Tools by Category - AI Tools Cover',
    description: 'Discover the best AI tools organized by category. Explore our curated collection of cutting-edge artificial intelligence solutions for every need.',
    type: 'website',
    url: '/category',
    images: [
      {
        url: '/images/category-overview-og.jpg', // You can create this image or use a placeholder
        width: 1200,
        height: 630,
        alt: 'AI Tools Cover - Browse Tools by Category',
      },
    ],
    siteName: 'AI Tools Cover',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse AI Tools by Category - AI Tools Cover',
    description: 'Discover the best AI tools organized by category. Find the perfect AI solution for your needs.',
    images: ['/images/category-overview-twitter.jpg'], // You can create this image or use a placeholder
    creator: '@aitoolscover',
    site: '@aitoolscover',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/category',
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
  other: {
    'revisit-after': '7 days',
    'content-language': 'en',
    'distribution': 'global',
    'rating': 'general',
  },
};

export default function CategoryLayout({ children }: Props) {
  return (
    <>
      {/* JSON-LD Structured Data for Category Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "AI Tools Categories",
            "description": "Browse our comprehensive collection of AI tools organized by category",
            "url": "https://aitoolscover.com/category",
            "mainEntity": {
              "@type": "ItemList",
              "name": "AI Tool Categories",
              "description": "Categories of artificial intelligence tools",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Business & Productivity",
                  "url": "https://aitoolscover.com/category/business-productivity"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Design & Art",
                  "url": "https://aitoolscover.com/category/design-art"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Development & Programming",
                  "url": "https://aitoolscover.com/category/development-programming"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Content Creation",
                  "url": "https://aitoolscover.com/category/content-creation"
                },
                {
                  "@type": "ListItem",
                  "position": 5,
                  "name": "Marketing & Sales",
                  "url": "https://aitoolscover.com/category/marketing-sales"
                }
              ]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://aitoolscover.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Categories",
                  "item": "https://aitoolscover.com/category"
                }
              ]
            },
            "provider": {
              "@type": "Organization",
              "name": "AI Tools Cover",
              "url": "https://aitoolscover.com",
              "logo": "https://aitoolscover.com/logo.png",
              "sameAs": [
                "https://twitter.com/aitoolscover",
                "https://www.facebook.com/aitoolscover",
                "https://www.linkedin.com/company/aitoolscover"
              ]
            }
          }),
        }}
      />

      {/* Additional meta tags for better SEO */}
      <link rel="preconnect" href="https://ai-tools-backend-p3sk.onrender.com" />
      <link rel="dns-prefetch" href="https://ai-tools-backend-p3sk.onrender.com" />
      
      {children}
    </>
  );
}