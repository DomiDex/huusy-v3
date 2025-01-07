'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import PropertiesCardBig from '@/components/properties/PropertiesCardBig';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import type { Property, AccountPro } from '@/lib/supabase/types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<
    (Property & {
      property_type: { id: string; title: string };
      city: { id: string; title: string };
      sale_type: { id: string; title: string };
      agent: AccountPro | null;
    })[]
  >([]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchProperties() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

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
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      setProperties(data || []);
    }

    fetchProperties();
  }, []);

  return (
    <section className='pt-32 pb-8 px-4 md:px-16'>
      <div className='container mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-3xl font-heading text-primary-950'>
            My Properties
          </h1>
          <Link
            href='./properties/add'
            className='flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors'
          >
            <PlusIcon className='w-5 h-5' />
            Add Property
          </Link>
        </div>

        <div className='grid grid-cols-1 gap-6'>
          {properties.map((property) => (
            <PropertiesCardBig key={property.id} property={property} />
          ))}

          {properties.length === 0 && (
            <div className='text-center py-12 bg-primary-50 rounded-lg'>
              <p className='text-primary-800'>
                You haven't added any properties yet.
              </p>
              <Link
                href='./properties/add'
                className='inline-block mt-4 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors'
              >
                Add Your First Property
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
