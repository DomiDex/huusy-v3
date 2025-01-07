import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: { path: string };
}): Promise<Metadata> {
  const supabase = createClient();

  const { data: property } = await supabase
    .from('properties')
    .select(
      `
      property_name,
      meta_title,
      meta_description,
      city:cities(title),
      property_type:property_types(title)
    `
    )
    .eq('path', params.path)
    .single();

  if (!property) {
    return {
      title: 'Property Not Found - Real Estate Marketplace',
      description: 'The requested property could not be found.',
    };
  }

  return {
    title:
      property.meta_title ||
      `${property.property_name} in ${property.city?.title} - Real Estate Marketplace`,
    description:
      property.meta_description ||
      `View details for ${property.property_name}, a ${property.property_type?.title} located in ${property.city?.title}.`,
  };
}

export default function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
