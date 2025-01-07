import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session, determine redirect based on path
  if (!session) {
    if (pathname.startsWith('/pro')) {
      redirect('/pro/login');
    } else {
      redirect('/customer/register');
    }
  }

  return (
    <div className='bg-primary-50'>
      {/* Add your dashboard layout components here (navbar, sidebar, etc.) */}
      {children}
    </div>
  );
}
