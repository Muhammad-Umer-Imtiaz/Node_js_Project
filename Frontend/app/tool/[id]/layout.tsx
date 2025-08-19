import { Metadata } from 'next';
import { featuredProducts } from '@/constants';

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

// Helper function to get product data from various sources
async function getProductData(slug: string) {
  // Check if it's a numeric ID (featured product)
  const isNumericId = /^\d+$/.test(slug);
  
  if (isNumericId) {
    const featuredProduct = featuredProducts.find(
      (item) => item.id.toString() === slug
    );
    if (featuredProduct) {
      return {
        name: featuredProduct.name,
        description: featuredProduct.description,
        category: featuredProduct.tag,
        image: featuredProduct.image,
        slug: slug
      };
    }
  }

  // For non-numeric slugs, create a generic product info
  // Since we can't access sessionStorage in server components,
  // we'll create SEO-friendly defaults based on the slug
  const productName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    name: productName,
    description: `Discover ${productName}, an innovative AI tool designed to enhance your productivity and streamline your workflow. Explore features, pricing, and user reviews.`,
    category: 'AI Tool',
    image: '/api/placeholder/400/300',
    slug: slug
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params Promise first
  const { id } = await params;
  
  // Get product data
  const productData = await getProductData(id);
  
  return {
    title: `${productData.name} - AI Tools Cover | Reviews, Features & Pricing`,
    description: productData.description,
    keywords: [
      productData.name,
      'AI tool',
      productData.category,
      'artificial intelligence',
      'productivity',
      'automation',
      'reviews',
      'features',
      'pricing'
    ].join(', '),
    openGraph: {
      title: `${productData.name} - AI Tools Cover`,
      description: productData.description,
      type: 'website',
      url: `https://aitoolscover.com/ai-tools/${id}`,
      images: [
        {
          url: productData.image || 'https://aitoolscover.com/api/placeholder/400/300',
          width: 400,
          height: 300,
          alt: `${productData.name} - AI Tool Screenshot`,
        },
      ],
      siteName: 'AI Tools Cover',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productData.name} - AI Tools Cover`,
      description: productData.description,
      images: [productData.image || 'https://aitoolscover.com/api/placeholder/400/300'],
      creator: '@aitoolscover',
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
      canonical: `https://aitoolscover.com/ai-tools/${id}`,
    },
  };
}

// Generate static params for featured products (optional, for better performance)
export async function generateStaticParams() {
  return featuredProducts.map((product) => ({
    id: product.id.toString(),
  }));
}

export default function ToolLayout({ children }: Props) {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Tools Cover",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Web",
            "url": "https://aitoolscover.com",
            "description": "Discover and compare the best AI tools for your needs",
            "provider": {
              "@type": "Organization",
              "name": "AI Tools Cover",
              "url": "https://aitoolscover.com"
            }
          }),
        }}
      />
      {children}
    </>
  );
}