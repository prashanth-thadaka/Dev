import type { MetadataRoute } from 'next';
import { articles, projects, publicPaths } from '@/lib/catalog';
import { siteUrl } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicPaths,
    ...articles.map((a) => `/blog/${a.slug}`),
    ...projects.map((p) => `/portfolio/${p.slug}`),
  ].map((path) => ({
    url: siteUrl + path,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/hosting' || path === '/web-design' ? 0.9 : 0.6,
  }));
}
