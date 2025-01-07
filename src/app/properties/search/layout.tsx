import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Properties - Real Estate Marketplace',
  description:
    'Search through our extensive collection of properties. Filter by price, location, bedrooms, and more to find your perfect home.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
