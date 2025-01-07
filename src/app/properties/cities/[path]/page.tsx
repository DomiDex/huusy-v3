'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import MainCardWild from '@/components/properties/cards/MainCardWild';
import MainCardSkeleton from '@/components/skeleton/MainCardSkeleton';
import FilterSidebar from '@/components/properties/filters/FilterSidebar';
import type { Property, AccountPro } from '@/lib/supabase/types';

// Loading skeleton component
function LoadingState() {
  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          {/* Title skeleton */}
          <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg mb-8' />

          <div className='flex flex-col md:flex-row gap-8'>
            {/* Sidebar skeleton */}
            <aside className='md:w-64 md:flex-shrink-0'>
              <div className='bg-white rounded-lg p-6 shadow-sm'>
                <div className='space-y-4'>
                  {/* Filter title skeletons */}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className='space-y-2'>
                      <div className='w-24 h-4 bg-primary-100 animate-pulse rounded' />
                      <div className='w-full h-10 bg-primary-50 animate-pulse rounded' />
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main content skeleton */}
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

export default function CityPropertiesPage() {
  const [cityName, setCityName] = useState('Loading...');
  const [cityId, setCityId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<
    (Property & {
      property_type: { id: string; title: string };
      city: { id: string; title: string };
      sale_type: { id: string; title: string };
      agent: AccountPro;
    })[]
  >([]);

  const params = useParams();
  const path = params.path as string;
  const searchParams = useSearchParams();
  const supabase = createClient();

  const filters = {
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    bedrooms: searchParams.get('bedrooms') || undefined,
    bathrooms: searchParams.get('bathrooms') || undefined,
  };

  useEffect(() => {
    async function fetchCityAndProperties() {
      try {
        setLoading(true);
        // Fetch city first
        const { data: city } = await supabase
          .from('cities')
          .select('id, title')
          .eq('path', path)
          .single();

        if (!city) {
          setError('City not found');
          return;
        }

        setCityName(city.title);
        setCityId(city.id);

        // Then fetch properties for this city
        const { data: propertiesData, error: propertiesError } = await supabase
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
          .eq('city_id', city.id)
          .order('created_at', { ascending: false });

        if (propertiesError) {
          throw propertiesError;
        }

        setProperties(propertiesData || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    }

    fetchCityAndProperties();
  }, [path, searchParams]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          <h1 className='text-3xl font-heading text-primary-950 mb-8'>
            Properties in {cityName}
          </h1>

          <div className='flex flex-col md:flex-row gap-8'>
            <aside className='md:w-64 md:flex-shrink-0'>
              <FilterSidebar />
            </aside>

            <main className='flex-1'>
              {error ? (
                <div className='text-red-500'>{error}</div>
              ) : properties.length === 0 ? (
                <div className='text-center py-12 bg-primary-50 rounded-lg'>
                  <p className='text-primary-800'>
                    No properties found in {cityName} matching your criteria.
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-6'>
                  {properties.map((property) => (
                    <MainCardWild key={property.id} property={property} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
}
