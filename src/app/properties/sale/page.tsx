'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import Link from 'next/link';
import Image from 'next/image';
import type { SaleType } from '@/lib/supabase/types';

// Loading skeleton component
function LoadingState() {
  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          {/* Title skeleton */}
          <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg mb-8' />

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-lg shadow-sm overflow-hidden'
              >
                {/* Image skeleton */}
                <div className='relative aspect-[16/9] w-full'>
                  <div className='w-full h-full bg-primary-100 animate-pulse' />
                </div>
                {/* Title skeleton */}
                <div className='p-4'>
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

export default function SaleTypesPage() {
  const [saleTypes, setSaleTypes] = useState<SaleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchSaleTypes() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('sale_types')
          .select('*')
          .order('title');

        if (error) throw error;

        setSaleTypes(data || []);
      } catch (err) {
        console.error('Error fetching sale types:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to fetch sale types'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSaleTypes();
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
            Browse Properties by Sale Type
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {saleTypes.map((type) => (
              <Link
                key={type.id}
                href={`/properties/sale/${type.path}`}
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

            {saleTypes.length === 0 && (
              <div className='col-span-full text-center py-12 bg-primary-50 rounded-lg'>
                <p className='text-primary-800'>No sale types available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
