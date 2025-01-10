'use client';

import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import MainCardWild from '@/components/properties/cards/MainCardWild';
import MainCardSkeleton from '@/components/skeleton/MainCardSkeleton';
import FilterSidebar from '@/components/properties/filters/FilterSidebar';
import { useSearchParams } from 'next/navigation';
import type { Property, AccountPro } from '@/lib/supabase/types';

function SearchContent() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<
    (Property & {
      property_type: { id: string; title: string };
      city: { id: string; title: string };
      sale_type: { id: string; title: string };
      agent: AccountPro;
    })[]
  >([]);

  const searchParams = useSearchParams();
  const supabase = createClient();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    async function searchProperties() {
      if (!searchQuery.trim()) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select(
            `
            *,
            property_type:property_types(id, title),
            city:cities(id, title),
            sale_type:sale_types(id, title),
            agent:account_pro(*)
          `
          )
          .or(
            `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,address.ilike.%${searchQuery}%`
          )
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error searching properties:', error);
          return;
        }

        setProperties(data || []);
      } finally {
        setLoading(false);
      }
    }

    searchProperties();
  }, [searchQuery, supabase]);

  if (loading) {
    return (
      <>
        <MainHeader variant='light' />
        <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
          <div className='w-full max-w-[1400px] mx-auto'>
            <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg mb-8' />
            <div className='grid grid-cols-1 gap-6'>
              {[...Array(3)].map((_, index) => (
                <MainCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          <h1 className='text-3xl font-heading text-primary-950 mb-8'>
            Search Results for "{searchQuery}"
          </h1>

          <div className='grid grid-cols-1 gap-6'>
            {properties.map((property) => (
              <MainCardWild key={property.id} property={property} />
            ))}

            {properties.length === 0 && (
              <div className='col-span-full text-center py-12 bg-primary-50 rounded-lg'>
                <p className='text-primary-800'>
                  No properties found matching your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <>
          <MainHeader variant='light' />
          <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
            <div className='w-full max-w-[1400px] mx-auto'>
              <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg mb-8' />
              <div className='grid grid-cols-1 gap-6'>
                {[...Array(3)].map((_, index) => (
                  <MainCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </section>
        </>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
