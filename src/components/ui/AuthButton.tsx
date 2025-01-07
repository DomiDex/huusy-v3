'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import NavLink from './NavLink';
import { useRouter } from 'next/navigation';

interface AuthButtonProps {
  variant?: 'light' | 'dark';
}

export default function AuthButton({ variant = 'light' }: AuthButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const buttonStyles = {
    light:
      'border-secondary-500 text-secondary-500 hover:bg-secondary-500 hover:text-primary-50',
    dark: 'border-secondary-100 text-secondary-100 hover:bg-secondary-400 hover:border-secondary-400 hover:text-primary-50',
  };

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isAuthenticated) {
    return (
      <button
        onClick={handleLogout}
        className={`px-4 py-2 border rounded-lg transition-all ${buttonStyles[variant]}`}
      >
        Sign Out
      </button>
    );
  }

  return (
    <NavLink
      href='/customer/register'
      className={`px-4 py-2 border rounded-lg transition-all ${buttonStyles[variant]}`}
    >
      Sign In
    </NavLink>
  );
}
