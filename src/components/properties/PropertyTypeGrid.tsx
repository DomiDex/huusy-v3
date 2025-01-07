import Link from 'next/link';
import Image from 'next/image';
import { PropertyType } from '@/lib/supabase/types';

interface PropertyTypeGridProps {
  propertyTypes: PropertyType[];
}

export default function PropertyTypeGrid({
  propertyTypes,
}: PropertyTypeGridProps) {
  if (!propertyTypes.length) {
    return (
      <div className='col-span-full text-center py-12 bg-primary-50 rounded-lg'>
        <p className='text-primary-800'>No property types available.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {propertyTypes.map((type) => (
        <Link
          key={type.id}
          href={`/properties/type/${type.path}`}
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
            <h3 className='text-xl font-heading text-primary-950'>
              {type.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
