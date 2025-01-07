import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Real Estate Marketplace',
  description:
    'Sign in or create an account to access our real estate marketplace. List properties, save favorites, and more.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
