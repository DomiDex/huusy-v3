'use client';

import { usePathname } from 'next/navigation';
import MainHeader from './headers/MainHeader';
import DashboardHeader from './headers/DashboardHeader';

export default function HeaderWrapper() {
  const pathname = usePathname();

  // Paths where we don't want to show any header
  const noHeaderPaths = ['/pro/login', '/pro/register', '/customer/register'];

  // Paths where we want to show the dashboard header
  const dashboardPaths = ['/pro'];

  // Paths where we want dark header
  const darkHeaderPaths = ['/', '/rent', '/buy'];

  // Don't render any header for auth pages
  if (noHeaderPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  // Render dashboard header for pro dashboard
  if (dashboardPaths.some((path) => pathname.startsWith(path))) {
    return <DashboardHeader />;
  }

  // Determine header variant based on path
  const variant = darkHeaderPaths.includes(pathname) ? 'dark' : 'light';

  return <MainHeader variant={variant} />;
}
