'use client';

import Logo from '@/components/ui/Logo';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function DashboardHeader() {
  const params = useParams();
  const userId = params.id;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-primary-50 text-primary-950 transition-colors'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo & Navigation */}
          <div className='flex items-center space-x-8'>
            <Logo />

            {/* Desktop Navigation */}
            <nav className='hidden md:flex items-center space-x-6'>
              <Link
                href={`/pro/${userId}`}
                className='text-primary-950 hover:text-primary-800 transition-colors'
              >
                Home
              </Link>
              <Link
                href={`/pro/${userId}/properties`}
                className='text-primary-950 hover:text-primary-800 transition-colors'
              >
                My Properties
              </Link>
              <Link
                href={`/pro/${userId}/properties/add`}
                className='text-primary-950 hover:text-primary-800 transition-colors'
              >
                Add Property
              </Link>
              <Link
                href={`/pro/${userId}/setting`}
                className='text-primary-950 hover:text-primary-800 transition-colors'
              >
                Settings
              </Link>
            </nav>
          </div>

          {/* Logout Button & Mobile Menu Button */}
          <div className='flex items-center space-x-4'>
            <button
              onClick={handleLogout}
              className='hidden md:flex items-center space-x-2 px-4 py-2 text-primary-950 hover:text-primary-800 transition-colors'
            >
              <ArrowRightOnRectangleIcon className='h-5 w-5' />
              <span>Logout</span>
            </button>

            <button
              className='md:hidden p-2'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className='w-6 h-6 text-primary-950'
                fill='none'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                {isMenuOpen ? (
                  <path d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-primary-800'>
            <nav className='flex flex-col space-y-4'>
              <Link
                href={`/pro/${userId}`}
                className='text-primary-950 hover:text-primary-800 transition-colors'
              >
                Home
              </Link>
              <Link
                href={`/pro/${userId}/properties`}
                className='text-primary-950 hover:text-primary-800 transition-colors'
              >
                My Properties
              </Link>
              <Link
                href={`/pro/${userId}/properties/add`}
                className='text-primary-950 hover:text-primary-800 transition-colors'
              >
                Add Property
              </Link>
              <Link
                href={`/pro/${userId}/setting`}
                className='text-primary-950 hover:text-primary-800 transition-colors'
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className='flex items-center space-x-2 text-primary-950 hover:text-primary-800 transition-colors'
              >
                <ArrowRightOnRectangleIcon className='h-5 w-5' />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
