'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  variant?: 'light' | 'dark';
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({
  href,
  variant = 'light',
  children,
  className,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const variants = {
    light: 'text-primary-950 hover:text-primary-700',
    dark: 'text-primary-50 hover:text-secondary-300',
  };

  return (
    <Link
      href={href}
      className={cn(
        'transition-colors',
        variants[variant],
        isActive && 'font-medium',
        className
      )}
    >
      {children}
    </Link>
  );
}
