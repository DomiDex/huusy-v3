import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Types - Real Estate Marketplace',
  description:
    'Browse properties by type. Find houses, apartments, condos, and more.',
};

export default function PropertyTypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
