'use client';

import Image from 'next/image';
import Link from 'next/link';

type LogoVariant = 'light' | 'dark';

interface LogoProps {
  variant?: LogoVariant;
}

export default function Logo({ variant = 'light' }: LogoProps) {
  return (
    <Link href='/' className='flex items-center space-x-2'>
      <Image
        src={`/logo/${variant}-logo.svg`}
        alt={`Huusy ${variant} Logo`}
        width={100}
        height={100}
        priority
      />
    </Link>
  );
}
