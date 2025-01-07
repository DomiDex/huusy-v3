import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://huusy.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/pro/', '/customer/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
