'use client';

import Link from 'next/link';
import { Property, AccountPro } from '@/lib/supabase/types';
import { formatPrice } from '@/lib/utils/formatting';
import PropertyImageSlider from './components/PropertyImageSlider';
import WhatsAppButton from './components/WhatsAppButton';
import FavoriteButton from './components/FavoriteButton';

interface PropertyCardVerticalProps {
  property: Property & {
    property_type: { id: string; title: string };
    city: { id: string; title: string };
    sale_type: { id: string; title: string };
    agent: AccountPro | null;
  };
}

export default function PropertyCardVertical({
  property,
}: PropertyCardVerticalProps) {
  return (
    <div className='w-full flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 p-2'>
      <Link href={`/properties/${property.path}`} className='flex-1'>
        <div className='relative aspect-[4/3] w-full'>
          <PropertyImageSlider images={property.images} />
          <div className='absolute top-4 left-4 z-10'>
            <span className='inline-block px-3 py-1.5 bg-secondary-500 text-sm text-white rounded-md'>
              {property.sale_type.title}
            </span>
          </div>
        </div>

        <div className='p-4 flex flex-col gap-2'>
          <span className='text-sm text-primary-800 capitalize'>
            {property.property_type.title}
          </span>
          <h2 className='text-xl font-heading text-primary-950 line-clamp-1'>
            {property.property_name}
          </h2>
          <p className='text-lg font-heading text-primary-950'>
            {formatPrice(property.price)}
          </p>
        </div>
      </Link>

      <div className='px-4 pb-4 flex flex-row gap-2'>
        {property.agent && (
          <WhatsAppButton
            phoneNumber={property.agent.phone}
            className='w-full justify-center'
          />
        )}
        <FavoriteButton propertyId={property.id} />
      </div>
    </div>
  );
}
