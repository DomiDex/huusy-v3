import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://huusy.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/properties',
          '/properties/cities/*',
          '/properties/types/*',
          '/properties/sale/*',
          '/agents/*',
        ],
        disallow: [
          '/api/*',
          '/pro/*',
          '/customer/*',
          '*/login',
          '*/register',
          '*/settings',
          '/properties/search',
          '/_next/*',
          '*.json',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
