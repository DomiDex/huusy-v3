'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function WelcomeHeader() {
  const [userName, setUserName] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function getUserProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('account_customer')
          .select('username')
          .eq('id', session.user.id)
          .single();

        if (profile?.username) {
          setUserName(profile.username);
        }
      }
    }

    getUserProfile();
  }, []);

  return (
    <h1 className='md:text-4xl text-2xl font-medium'>
      Welcome back, {userName || 'Guest'}
    </h1>
  );
}
