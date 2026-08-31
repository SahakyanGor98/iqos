import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://24iqos.ru';

  // Static routes
  const routes = [
    '',
    '/about/iqos',
    '/products/iqos',
    '/products/terea',
    '/products/water',
    '/products/accessories',
    '/trade-in',
    '/compare',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes
  const iqosSlugs = await getAllSlugs('gadget');
  const tereaSlugs = await getAllSlugs('sticks');
  const accessorySlugs = await getAllSlugs('accessories');

  const iqosRoutes = iqosSlugs.map((slug) => ({
    url: `${baseUrl}/products/iqos/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const tereaRoutes = tereaSlugs.map((slug) => ({
    url: `${baseUrl}/products/terea/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const accessoryRoutes = accessorySlugs.map((slug) => ({
    url: `${baseUrl}/products/accessories/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...iqosRoutes, ...tereaRoutes, ...accessoryRoutes];
}
