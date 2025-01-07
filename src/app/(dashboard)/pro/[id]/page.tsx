import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import PropertiesCardBig from '@/components/properties/PropertiesCardBig';

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session or ID mismatch, redirect to login
  if (!session?.user) {
    redirect('/pro/login');
  }

  // If user tries to access another user's dashboard, redirect them to their own
  if (session.user.id !== params.id) {
    redirect(`/pro/${session.user.id}`);
  }

  // Fetch pro account data
  const { data: proData, error: proError } = await supabase
    .from('account_pro')
    .select('*')
    .eq('id', params.id)
    .single();

  if (proError || !proData) {
    redirect(`/pro/${session.user.id}`);
  }

  // Fetch recent properties
  const { data: properties, error: propertiesError } = await supabase
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
    .eq('agent_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(3);

  if (propertiesError) {
    console.error('Error fetching properties:', propertiesError);
  }

  return (
    <section className='pt-32 pb-8 px-4 md:px-16'>
      <div className='container mx-auto flex flex-col space-y-12'>
        {/* Welcome Section */}
        <div className='flex flex-col items-start space-y-8'>
          <h1 className='text-3xl font-heading text-primary-950'>
            Welcome, {proData.full_name}
          </h1>
          <div className='flex items-center gap-4'>
            <Link
              href={`/pro/${params.id}/properties`}
              className='px-4 py-2 bg-primary-100 text-primary-950 rounded-lg hover:bg-primary-200 transition-colors'
            >
              View All Properties
            </Link>
            <Link
              href={`/pro/${params.id}/properties/add`}
              className='flex items-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors'
            >
              <PlusIcon className='w-5 h-5' />
              Add Property
            </Link>
          </div>
        </div>

        {/* Recent Properties Section */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-heading text-primary-950'>
            Recent Properties
          </h2>
          <div className='grid grid-cols-1 gap-6'>
            {properties && properties.length > 0 ? (
              properties.map((property) => (
                <PropertiesCardBig key={property.id} property={property} />
              ))
            ) : (
              <div className='text-center py-12 bg-primary-50 rounded-lg'>
                <p className='text-primary-800'>
                  You haven't added any properties yet.
                </p>
                <Link
                  href={`/pro/${params.id}/properties/add`}
                  className='inline-block mt-4 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors'
                >
                  Add Your First Property
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
