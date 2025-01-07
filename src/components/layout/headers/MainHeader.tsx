'use client';

import { useState } from 'react';
import Logo from '@/components/ui/Logo';
import NavLink from '@/components/ui/NavLink';
import AuthButton from '@/components/ui/AuthButton';

interface MainHeaderProps {
  variant?: 'light' | 'dark';
}

export default function MainHeader({ variant = 'light' }: MainHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const headerStyles = {
    light: 'bg-primary-50/80 backdrop-blur-md border-b border-primary-200',
    dark: 'bg-primary-950/50 backdrop-blur-md border-b border-primary-800',
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${headerStyles[variant]}`}
    >
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <Logo variant={variant} />

          {/* Desktop Navigation */}
          <nav className='hidden md:flex items-center space-x-8'>
            <NavLink href='/properties/sale/for-rent' variant={variant}>
              Rent
            </NavLink>
            <NavLink href='/properties/sale/for-sale' variant={variant}>
              Buy
            </NavLink>
            <NavLink href='/properties' variant={variant}>
              All Properties
            </NavLink>
            <NavLink href='/agents' variant={variant}>
              Find Agents
            </NavLink>
            <AuthButton variant={variant} />
          </nav>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2 rounded-lg hover:bg-primary-100/10'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className={`w-6 h-6 ${
                variant === 'light' ? 'text-primary-950' : 'text-primary-50'
              }`}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className='md:hidden py-4'>
            <div className='flex flex-col space-y-4'>
              <NavLink href='/rent' variant={variant}>
                Rent
              </NavLink>
              <NavLink href='/buy' variant={variant}>
                Buy
              </NavLink>
              <NavLink href='/properties' variant={variant}>
                All Properties
              </NavLink>
              <NavLink href='/agents' variant={variant}>
                Find Agents
              </NavLink>
              <AuthButton variant={variant} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
