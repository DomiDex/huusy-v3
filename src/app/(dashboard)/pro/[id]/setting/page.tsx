import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './components/SettingsForm';

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
    redirect('/pro/login');
  }

  // If user tries to access another user's settings, redirect them to their own
  if (session.user.id !== params.id) {
    redirect(`/pro/${session.user.id}/setting`);
  }

  // Fetch pro account data
  const { data: proData, error } = await supabase
    .from('account_pro')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !proData) {
    redirect(`/pro/${session.user.id}`);
  }

  return (
    <section className='pt-32 pb-8 px-4 md:px-16'>
      <div className='container mx-auto'>
        <h1 className='text-3xl font-heading text-primary-950 mb-8'>
          Account Settings
        </h1>
        <SettingsForm initialData={proData} />
      </div>
    </section>
  );
}
