import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Professional Dashboard - Real Estate Marketplace',
  description:
    'Manage your property listings, view analytics, and handle client inquiries.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
