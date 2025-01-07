import WelcomeHeader from '@/components/dashboard/WelcomeHeader';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { HeartIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createClient();

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session or ID mismatch, redirect to login
  if (!session?.user) {
    redirect('/customer/register');
  }

  // If user tries to access another user's dashboard, redirect them to their own
  if (session.user.id !== params.id) {
    redirect(`/customer/${session.user.id}`);
  }

  return (
    <section className='pt-32 pb-8 px-4 md:px-16'>
      <div className='container mx-auto flex flex-col items-start justify-center space-y-8'>
        <WelcomeHeader />
        <div className='flex flex-row items-center justify-center space-x-4'>
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
        <div className='flex flex-col items-start justify-center space-y-4'></div>
      </div>
    </section>
  );
}
