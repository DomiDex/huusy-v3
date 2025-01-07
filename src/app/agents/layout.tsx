import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Real Estate Agents - Real Estate Marketplace',
  description:
    'Meet our experienced real estate agents. Find the perfect professional to help you buy or sell your property.',
};

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
