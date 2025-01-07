import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://huusy.com';
  const supabase = createClient();

  // Fetch dynamic data
  const [
    { data: properties },
    { data: cities },
    { data: propertyTypes },
    { data: agents },
  ] = await Promise.all([
    supabase.from('properties').select('path, updated_at'),
    supabase.from('cities').select('path, updated_at'),
    supabase.from('property_types').select('path, updated_at'),
    supabase.from('account_pro').select('id, updated_at'),
  ]);

  // Static routes
  const staticRoutes = [
    '',
    '/properties',
    '/agents',
    '/properties/cities',
    '/properties/types',
    '/properties/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Property routes
  const propertyRoutes = (properties || []).map((property) => ({
    url: `${baseUrl}/properties/${property.path}`,
    lastModified: property.updated_at
      ? new Date(property.updated_at)
      : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // City routes
  const cityRoutes = (cities || []).map((city) => ({
    url: `${baseUrl}/properties/cities/${city.path}`,
    lastModified: city.updated_at ? new Date(city.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Property type routes
  const propertyTypeRoutes = (propertyTypes || []).map((type) => ({
    url: `${baseUrl}/properties/types/${type.path}`,
    lastModified: type.updated_at ? new Date(type.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Agent routes
  const agentRoutes = (agents || []).map((agent) => ({
    url: `${baseUrl}/agents/${agent.id}`,
    lastModified: agent.updated_at ? new Date(agent.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...propertyRoutes,
    ...cityRoutes,
    ...propertyTypeRoutes,
    ...agentRoutes,
  ];
}
