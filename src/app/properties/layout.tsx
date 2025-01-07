import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Properties - Real Estate Marketplace',
  description:
    'Browse our extensive collection of properties for sale and rent. Find your perfect home with our easy-to-use filters.',
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
