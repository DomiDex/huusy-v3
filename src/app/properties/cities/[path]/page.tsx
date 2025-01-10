'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import MainCardWild from '@/components/properties/cards/MainCardWild';
import MainCardSkeleton from '@/components/skeleton/MainCardSkeleton';
import FilterSidebar from '@/components/properties/filters/FilterSidebar';
import type { Property, AccountPro } from '@/lib/supabase/types';

function CityContent() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<
    (Property & {
      property_type: { id: string; title: string };
      city: { id: string; title: string };
      sale_type: { id: string; title: string };
      agent: AccountPro;
    })[]
  >([]);
  const [cityTitle, setCityTitle] = useState('');
  const [cityId, setCityId] = useState<string | null>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);

        // First, get the city ID
        const { data: cityData } = await supabase
          .from('cities')
          .select('id, title')
          .eq('path', params.path)
          .single();

        if (cityData) {
          setCityTitle(cityData.title);
          setCityId(cityData.id);

          let query = supabase
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
            .eq('city_id', cityData.id)
            .order('created_at', { ascending: false });

          // Apply filters
          const minPrice = searchParams.get('minPrice');
          const maxPrice = searchParams.get('maxPrice');
          const bedrooms = searchParams.get('bedrooms');
          const bathrooms = searchParams.get('bathrooms');
          const propertyTypeId = searchParams.get('propertyTypeId');

          if (minPrice) query = query.gte('price', minPrice);
          if (maxPrice) query = query.lte('price', maxPrice);
          if (bedrooms) query = query.gte('bedrooms', bedrooms);
          if (bathrooms) query = query.gte('bathrooms', bathrooms);
          if (propertyTypeId)
            query = query.eq('property_type_id', propertyTypeId);

          const { data: propertiesData } = await query;
          setProperties(propertiesData || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [params.path, searchParams, supabase]);

  if (loading) {
    return (
      <>
        <MainHeader variant='light' />
        <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
          <div className='w-full max-w-[1400px] mx-auto'>
            <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg mb-8' />
            <div className='flex flex-col md:flex-row gap-8'>
              <aside className='md:w-64 md:flex-shrink-0'>
                <div className='bg-white rounded-lg p-6 shadow-sm'>
                  <div className='space-y-4'>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className='space-y-2'>
                        <div className='w-24 h-4 bg-primary-100 animate-pulse rounded' />
                        <div className='w-full h-10 bg-primary-50 animate-pulse rounded' />
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
              <main className='flex-1'>
                <div className='grid grid-cols-1 gap-6'>
                  {[...Array(3)].map((_, index) => (
                    <MainCardSkeleton key={index} />
                  ))}
                </div>
              </main>
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
            Properties in {cityTitle}
          </h1>

          <div className='flex flex-col md:flex-row gap-8'>
            <aside className='md:flex-shrink-0'>
              <FilterSidebar />
            </aside>

            <main className='flex-1'>
              <div className='grid grid-cols-1 gap-6'>
                {properties.map((property) => (
                  <MainCardWild key={property.id} property={property} />
                ))}

                {properties.length === 0 && (
                  <div className='col-span-full text-center py-12 bg-primary-50 rounded-lg'>
                    <p className='text-primary-800'>
                      No properties found in this city matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}

export default function CityPage() {
  return (
    <Suspense
      fallback={
        <>
          <MainHeader variant='light' />
          <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
            <div className='w-full max-w-[1400px] mx-auto'>
              <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg mb-8' />
              <div className='flex flex-col md:flex-row gap-8'>
                <aside className='md:w-64 md:flex-shrink-0'>
                  <div className='bg-white rounded-lg p-6 shadow-sm'>
                    <div className='space-y-4'>
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className='space-y-2'>
                          <div className='w-24 h-4 bg-primary-100 animate-pulse rounded' />
                          <div className='w-full h-10 bg-primary-50 animate-pulse rounded' />
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
                <main className='flex-1'>
                  <div className='grid grid-cols-1 gap-6'>
                    {[...Array(3)].map((_, index) => (
                      <MainCardSkeleton key={index} />
                    ))}
                  </div>
                </main>
              </div>
            </div>
          </section>
        </>
      }
    >
      <CityContent />
    </Suspense>
  );
}
