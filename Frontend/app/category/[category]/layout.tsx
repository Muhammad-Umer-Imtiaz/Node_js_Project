import { Metadata } from 'next';

type Props = {
  params: Promise<{ category: string }>; // Note: params is now a Promise
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await the params Promise first
  const { category } = await params;
  
  // Now you can safely use the category
  const categoryName = decodeURIComponent(category).replace(/-/g, ' ');
  
  return {
    title: `Best AI Tools for ${categoryName} - AI Tools Cover`,
    description: `Discover the best ${categoryName} AI tools to optimize your workflow. Explore our curated collection of cutting-edge artificial intelligence tools for ${categoryName.toLowerCase()}.`,
    openGraph: {
      title: `Best AI Tools for ${categoryName} - AI Tools Cover`,
      description: `Discover the best ${categoryName} AI tools to optimize your workflow. Explore our curated collection of cutting-edge artificial intelligence tools.`,
      type: 'website',
      url: `https://aitoolscover.com/category/${category}`,
    },
  };
}

export default function CategoryLayout({ children }: Props) {
  return children;
}