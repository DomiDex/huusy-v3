'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import Link from 'next/link';
import Image from 'next/image';
import type { PropertyType } from '@/lib/supabase/types';

export default function PropertyTypesPage() {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchPropertyTypes() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('property_types')
          .select('*')
          .order('title');

        if (error) throw error;

        setPropertyTypes(data || []);
      } catch (err) {
        console.error('Error fetching property types:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch property types'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPropertyTypes();
  }, []);

  if (loading) {
    return (
      <>
        <MainHeader variant='light' />
        <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
          <div className='w-full max-w-[1400px] mx-auto'>
            <p className='text-primary-800'>Loading property types...</p>
          </div>
        </section>
      </>
    );
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
            Browse Properties by Type
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6'>
            {propertyTypes.map((type) => (
              <Link
                key={type.id}
                href={`/properties/types/${type.path}`}
                className='group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden'
              >
                <div className='relative aspect-[16/9] w-full'>
                  <Image
                    src={type.og_image_url || '/images/placeholder.jpg'}
                    alt={type.title}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  />
                </div>
                <div className='p-4'>
                  <h2 className='text-xl font-heading text-primary-950'>
                    {type.title}
                  </h2>
                </div>
              </Link>
            ))}

            {propertyTypes.length === 0 && (
              <div className='col-span-full text-center py-12 bg-primary-50 rounded-lg'>
                <p className='text-primary-800'>No property types available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
