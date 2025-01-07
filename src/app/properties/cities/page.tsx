'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';
import type { City } from '@/lib/supabase/types';

// Loading skeleton component
function LoadingState() {
  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          {/* Title skeleton */}
          <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg mb-8' />

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='bg-white rounded-lg shadow-sm p-6'>
                <div className='flex items-center gap-3'>
                  {/* Icon skeleton */}
                  <div className='w-5 h-5 bg-secondary-200 animate-pulse rounded' />
                  {/* City name skeleton */}
                  <div className='w-32 h-6 bg-primary-100 animate-pulse rounded' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchCities() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .order('title');

        if (error) throw error;

        setCities(data || []);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cities');
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <>
        <MainHeader variant='light' />
        <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
          <div className='w-full max-w-[1400px] mx-auto'>
            <p className='text-red-500'>Error: {error}</p>
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
            Browse Properties by City
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/properties/cities/${city.path}`}
                className='group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6'
              >
                <div className='flex items-center gap-3 mb-2'>
                  <MapPinIcon className='w-5 h-5 text-secondary-500' />
                  <h2 className='text-xl font-heading text-primary-950'>
                    {city.title}
                  </h2>
                </div>
              </Link>
            ))}

            {cities.length === 0 && (
              <div className='col-span-full text-center py-12 bg-primary-50 rounded-lg'>
                <p className='text-primary-800'>No cities available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
