import { NextResponse } from 'next/server';
import { categories } from '@/constants';

export async function GET() {
  const baseUrl = 'https://aitoolscover.com';
  const currentDate = new Date().toISOString();

  // Helper function to create URL-friendly slugs
  const createSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Helper function to create a clean slug (e.g., "Writing & Editing" -> "Writing-Editing")
  const createCategorySlug = (label: string): string =>
    label
      .replace(/&/g, '')                // Remove ampersand
      .replace(/[^\w\s-]/g, '')         // Remove other special chars except hyphen
      .replace(/\s+/g, '-')             // Replace spaces with hyphens
      .replace(/-+/g, '-')              // Collapse multiple hyphens
      .replace(/^-+|-+$/g, '')          // Trim leading/trailing hyphens
      .toLowerCase();

  console.log(categories.map(
    category => `<url>
      <loc>${baseUrl}/category/${createCategorySlug(category.label)}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`
  ).join(''));

  // Generate category URLs
  const categoryUrls = categories.map(
    category => `<url>
      <loc>${baseUrl}/category/${createCategorySlug(category.label)}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>`
  ).join('');

  // Fetch tools for all categories and generate URLs
  let toolsUrls = '';

  try {
    // Process categories sequentially to avoid overwhelming the API
    for (const category of categories) {
      // Extract first word of category for API
      const categoryFirstWord = category.label.split(' ')[0].toLowerCase();
      console.log(`Fetching tools for category: ${categoryFirstWord}`);

      const response = await fetch(
        `/api/tools/category_without_limit/?category=${encodeURIComponent(categoryFirstWord)}`,
        { next: { revalidate: 86400 } } // Revalidate once per day
      );

      if (!response.ok) {
        console.error(`Failed to fetch tools for ${categoryFirstWord}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`Found ${data.total_results} tools for ${categoryFirstWord}`);

      // Add each tool to sitemap
      const categoryTools = data.results.map((tool: { name: string; created_at: string | number | Date; }) => {
        const toolDate = tool.created_at ? new Date(tool.created_at).toISOString() : currentDate;
        return `<url>
          <loc>${baseUrl}/ai-tools/${createSlug(tool.name)}</loc>
          <lastmod>${toolDate}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>`;
      }).join('');

      toolsUrls += categoryTools;
    }
  } catch (error) {
    console.error('Error fetching tools for sitemap:', error);
  }

  // Generate static pages URLs
  const staticUrls = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/category', priority: '0.7', changefreq: 'weekly' },
    { path: '/ai-agents', priority: '0.7', changefreq: 'weekly' },
    { path: '/ai-tools', priority: '0.7', changefreq: 'weekly' },
    { path: '/gpts', priority: '0.7', changefreq: 'weekly' },
    { path: '/prompts', priority: '0.7', changefreq: 'weekly' },
    { path: '/top-picks', priority: '0.7', changefreq: 'weekly' },
    { path: '/login', priority: '0.7', changefreq: 'monthly' },
    { path: '/signup', priority: '0.7', changefreq: 'monthly' },
    { path: '/favorites', priority: '0.7', changefreq: 'weekly' },
    { path: '/submit', priority: '0.7', changefreq: 'monthly' },
    { path: '/privacy-policy', priority: '0.7', changefreq: 'yearly' },
    { path: '/terms', priority: '0.7', changefreq: 'yearly' },
  ].map(({ path, priority, changefreq }) => `<url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('');

  // Combine all URLs into sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${categoryUrls}
    ${toolsUrls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}