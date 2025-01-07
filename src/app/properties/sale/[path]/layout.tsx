import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: { path: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: saleType } = await supabase
    .from('sale_types')
    .select('*')
    .eq('path', params.path)
    .single();

  if (!saleType) {
    return {
      title: 'Sale Type Not Found',
      description: 'The requested sale type could not be found.',
    };
  }

  return {
    title:
      saleType.meta_title ||
      `${saleType.title} Properties - Real Estate Marketplace`,
    description:
      saleType.meta_description ||
      `Browse properties available for ${saleType.title.toLowerCase()}. Find your perfect property with our easy-to-use filters.`,
  };
}

export default function SaleTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
