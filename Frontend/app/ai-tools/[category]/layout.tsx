import { Metadata } from 'next';
import { AI_TOOLS_CATEGORIES } from '@/constants';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const categorySlug = category;

  // Find matching category from AI_TOOLS_CATEGORIES
  const matchedCategory = AI_TOOLS_CATEGORIES.find(
    cat => cat.id.toLowerCase() === categorySlug.toLowerCase()
  );

  if (!matchedCategory) {
    return {
      title: 'Category Not Found - AI Tools Cover',
      description: 'The AI tools category you are looking for could not be found.',
    };
  }

  return {
    title: matchedCategory.metaTitle || `${matchedCategory.title} - AI Tools Cover`,
    description: matchedCategory.metaDescription || matchedCategory.description,
    keywords: matchedCategory.focusKeywords ? matchedCategory.focusKeywords.join(', ') : undefined,
    openGraph: {
      title: matchedCategory.metaTitle || `${matchedCategory.title} - AI Tools Cover`,
      description: matchedCategory.metaDescription || matchedCategory.description,
      images: [
        {
          url: matchedCategory.image,
          width: 1200,
          height: 630,
          alt: matchedCategory.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: matchedCategory.metaTitle || `${matchedCategory.title} - AI Tools Cover`,
      description: matchedCategory.metaDescription || matchedCategory.description,
      images: [matchedCategory.image],
    },
    alternates: {
      canonical: `/ai-tools/${categorySlug}`,
    },
  };
}

export async function generateStaticParams() {
  return AI_TOOLS_CATEGORIES.map((category) => ({
    category: category.id.toLowerCase(),
  }));
}

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ category: string }>;
}

export default async function CategoryLayout({ children, params }: LayoutProps) {
  const { category } = await params;
  const categorySlug = category;

  // Find matching category to verify it exists
  const matchedCategory = AI_TOOLS_CATEGORIES.find(
    cat => cat.id.toLowerCase() === categorySlug.toLowerCase()
  );

  // If category doesn't exist, let Next.js handle the 404
  if (!matchedCategory) {
    return children;
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: matchedCategory.title,
            description: matchedCategory.description,
            url: `https://aitoolscover.com/ai-tools/${categorySlug}`,
            mainEntity: {
              '@type': 'ItemList',
              name: `${matchedCategory.title} Collection`,
              description: matchedCategory.description,
              numberOfItems: matchedCategory.features?.length || 0,
              itemListElement: matchedCategory.features?.map((feature, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: feature,
                url: `https://aitoolscover.com/ai-tools/features/${feature.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              })) || [],
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://aitoolscover.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'AI Tools',
                  item: 'https://aitoolscover.com/ai-tools',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: matchedCategory.title,
                  item: `https://aitoolscover.com/ai-tools/${categorySlug}`,
                },
              ],
            },
            publisher: {
              '@type': 'Organization',
              name: 'AI Tools Cover',
              url: 'https://aitoolscover.com',
            },
          }),
        }}
      />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="AI Tools Cover" />
      <meta property="article:publisher" content="AI Tools Cover" />
      <meta name="theme-color" content="#7d42fb" />
      
      {/* Focus Keywords as Meta Keywords */}
      {matchedCategory.focusKeywords && (
        <meta name="keywords" content={matchedCategory.focusKeywords.join(', ')} />
      )}
      
      {/* Category-specific structured data */}
      <meta property="og:site_name" content="AI Tools Cover" />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:site" content="@aitoolscover" />
      <meta name="twitter:creator" content="@aitoolscover" />
      
      {children}
    </>
  );
}