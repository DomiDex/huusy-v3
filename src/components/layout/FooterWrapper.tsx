'use client';

import { usePathname } from 'next/navigation';
import Footer from './footer/footer';

export default function FooterWrapper() {
  const pathname = usePathname();

  // Paths where we don't want to show footer
  const noFooterPaths = ['/pro/login', '/pro/register', '/customer/register'];

  // Don't render footer for auth pages
  if (noFooterPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return <Footer />;
}
