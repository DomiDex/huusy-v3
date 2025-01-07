import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SettingsForm from './components/SettingsForm';
import { HeartIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default async function SettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session or ID mismatch, redirect to login
  if (!session?.user) {
    redirect('/customer/login');
  }

  // If user tries to access another user's settings, redirect them to their own
  if (session.user.id !== params.id) {
    redirect(`/customer/${session.user.id}/setting`);
  }

  // Fetch customer account data
  const { data: customerData, error } = await supabase
    .from('account_customer')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !customerData) {
    redirect(`/customer/${session.user.id}`);
  }

  return (
    <section className='pt-32 pb-8 px-4 md:px-16'>
      <div className='container mx-auto'>
        <h1 className='text-3xl font-heading text-primary-950 mb-8'>
          Account Settings
        </h1>
        <div className='flex flex-row items-center justify-center space-x-4 mb-8'>
          <Link
            href={`/customer/${params.id}`}
            className='flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors'
          >
            <HeartIcon className='h-5 w-5' />
            <span>My Favorites</span>
          </Link>
          <Link
            href={`/customer/${params.id}/setting`}
            className='flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors'
          >
            <Cog6ToothIcon className='h-5 w-5' />
            <span>My Settings</span>
          </Link>
        </div>
        <SettingsForm initialData={customerData} />
      </div>
    </section>
  );
}
