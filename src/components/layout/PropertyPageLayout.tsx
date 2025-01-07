import BaseLayout from './BaseLayout';
import FilterSidebar from '@/components/properties/filters/FilterSidebar';
import MainCardWild from '@/components/properties/cards/MainCardWild';
import type { PropertyWithRelations } from '@/hooks/useProperties';

interface PropertyPageLayoutProps {
  title: string;
  properties: PropertyWithRelations[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export default function PropertyPageLayout({
  title,
  properties,
  loading,
  error,
  emptyMessage = 'No properties found matching your criteria.',
}: PropertyPageLayoutProps) {
  const content = loading ? (
    <div className='w-full max-w-[1400px] mx-auto'>
      <p className='text-primary-800'>Loading properties...</p>
    </div>
  ) : error ? (
    <div className='w-full max-w-[1400px] mx-auto'>
      <p className='text-red-500'>Error: {error}</p>
    </div>
  ) : (
    <div className='w-full max-w-[1400px] mx-auto'>
      <h1 className='text-3xl font-heading text-primary-950 mb-8'>{title}</h1>

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
                <p className='text-primary-800'>{emptyMessage}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );

  return (
    <BaseLayout>
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        {content}
      </section>
    </BaseLayout>
  );
}
