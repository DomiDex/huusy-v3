import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: { path: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: propertyType } = await supabase
    .from('property_types')
    .select('*')
    .eq('path', params.path)
    .single();

  if (!propertyType) {
    return {
      title: 'Property Type Not Found',
      description: 'The requested property type could not be found.',
    };
  }

  return {
    title: `${propertyType.title} Properties - Real Estate Marketplace`,
    description: `Browse our collection of ${propertyType.title.toLowerCase()} properties. Find your perfect ${propertyType.title.toLowerCase()} with our easy-to-use filters.`,
  };
}

export default function PropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
