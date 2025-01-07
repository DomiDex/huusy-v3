import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: { path: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('path', params.path)
    .single();

  if (!city) {
    return {
      title: 'City Not Found',
      description: 'The requested city could not be found.',
    };
  }

  return {
    title:
      city.meta_title ||
      `Properties in ${city.title} - Real Estate Marketplace`,
    description:
      city.meta_description ||
      `Browse properties for sale and rent in ${city.title}. Find your perfect home in this amazing location.`,
  };
}

export default function CityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
