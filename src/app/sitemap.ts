import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority: number;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://huusy.com';
  const supabase = createClient();

  // Fetch all dynamic data in parallel
  const [
    { data: properties },
    { data: cities },
    { data: propertyTypes },
    { data: saleTypes },
    { data: agents },
  ] = await Promise.all([
    supabase.from('properties').select('path, updated_at'),
    supabase.from('cities').select('path, updated_at'),
    supabase.from('property_types').select('path, updated_at'),
    supabase.from('sale_types').select('path, updated_at'),
    supabase.from('account_pro').select('id, updated_at'),
  ]);

  // Static routes with priorities
  const staticRoutes: SitemapEntry[] = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/properties`, priority: 0.9 },
    { url: `${baseUrl}/properties/cities`, priority: 0.8 },
    { url: `${baseUrl}/properties/types`, priority: 0.8 },
    { url: `${baseUrl}/properties/sale`, priority: 0.8 },
    { url: `${baseUrl}/agents`, priority: 0.8 },
  ].map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority,
  }));

  // Dynamic routes for properties
  const propertyRoutes: SitemapEntry[] = (properties || []).map((property) => ({
    url: `${baseUrl}/properties/${property.path}`,
    lastModified: new Date(property.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Dynamic routes for cities
  const cityRoutes: SitemapEntry[] = (cities || []).map((city) => ({
    url: `${baseUrl}/properties/cities/${city.path}`,
    lastModified: new Date(city.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Dynamic routes for property types
  const propertyTypeRoutes: SitemapEntry[] = (propertyTypes || []).map(
    (type) => ({
      url: `${baseUrl}/properties/types/${type.path}`,
      lastModified: new Date(type.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })
  );

  // Dynamic routes for sale types
  const saleTypeRoutes: SitemapEntry[] = (saleTypes || []).map((type) => ({
    url: `${baseUrl}/properties/sale/${type.path}`,
    lastModified: new Date(type.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Dynamic routes for agents
  const agentRoutes: SitemapEntry[] = (agents || []).map((agent) => ({
    url: `${baseUrl}/agents/${agent.id}`,
    lastModified: new Date(agent.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...propertyRoutes,
    ...cityRoutes,
    ...propertyTypeRoutes,
    ...saleTypeRoutes,
    ...agentRoutes,
  ];
}
