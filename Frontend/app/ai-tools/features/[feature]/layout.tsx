import { Metadata } from 'next';
import { AI_TOOLS_FEATURES } from '@/constants';
import { notFound } from 'next/navigation';

interface FeatureLayoutProps {
  children: React.ReactNode;
  params: Promise<{ feature: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ feature: string }>;
}): Promise<Metadata> {
  const { feature } = await params;
  const featureData = AI_TOOLS_FEATURES.find(
    (f) => f.id === feature
  );

  if (!featureData) {
    return {
      title: 'Feature Not Found - AI Tools Cover',
      description: 'The AI tool feature you are looking for could not be found.',
    };
  }

  const {
    metaTitle,
    metaDescription,
    focusKeywords,
    title,
    description,
  } = featureData;

  return {
    title: metaTitle || `${title} - AI Tools Cover`,
    description: metaDescription || description,
    keywords: focusKeywords?.join(', ') || `${title}, AI tools, artificial intelligence`,
    
    openGraph: {
      title: metaTitle || `${title} - AI Tools Cover`,
      description: metaDescription || description,
      url: `https://aitoolscover.com/ai-tools/features/${feature}`,
      siteName: 'AI Tools Cover',
      type: 'website',
      images: [
        {
          url: featureData.image || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${title} - AI Tools Cover`,
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: metaTitle || `${title} - AI Tools Cover`,
      description: metaDescription || description,
      images: [featureData.image || '/og-image.jpg'],
      creator: '@aitoolscover',
      site: '@aitoolscover',
    },
    
    alternates: {
      canonical: `https://aitoolscover.com/ai-tools/features/${feature}`,
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
    
    other: {
      'article:author': 'AI Tools Cover',
      'article:publisher': 'https://aitoolscover.com',
    },
  };
}

export async function generateStaticParams() {
  return AI_TOOLS_FEATURES.map((feature) => ({
    feature: feature.id,
  }));
}

export default async function FeatureLayout({ children, params }: FeatureLayoutProps) {
  const { feature } = await params;
  const featureData = AI_TOOLS_FEATURES.find(
    (f) => f.id === feature
  );

  if (!featureData) {
    notFound();
  }

  return (
    <>
      {children}
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: featureData.metaTitle || `${featureData.title} - AI Tools Cover`,
            description: featureData.metaDescription || featureData.description,
            url: `https://aitoolscover.com/ai-tools/features/${feature}`,
            mainEntity: {
              '@type': 'ItemList',
              name: `${featureData.title} Tools`,
              description: featureData.description,
              numberOfItems: 12,
              itemListElement: Array.from({ length: 12 }, (_, index) => ({
                '@type': 'SoftwareApplication',
                position: index + 1,
                name: `${featureData.title} Tool ${index + 1}`,
                applicationCategory: 'AI Software',
                operatingSystem: 'Web Browser',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
              })),
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
                  name: featureData.title,
                  item: `https://aitoolscover.com/ai-tools/features/${feature}`,
                },
              ],
            },
            publisher: {
              '@type': 'Organization',
              name: 'AI Tools Cover',
              url: 'https://aitoolscover.com',
              logo: {
                '@type': 'ImageObject',
                url: 'https://aitoolscover.com/logo.png',
                width: 600,
                height: 60,
              },
            },
          }),
        }}
      />
    </>
  );
}