import { Inter } from 'next/font/google';
import './globals.css';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import FooterWrapper from '@/components/layout/FooterWrapper';
import SmoothScroll from '@/components/providers/SmoothScroll';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Huusy - Your Premier Real Estate Marketplace',
  description:
    'Find your perfect home with Huusy. Browse through our extensive collection of properties for sale and rent. Connect with professional real estate agents and make your dream home a reality.',
  keywords:
    'real estate, homes for sale, property listings, real estate agents, houses for rent, apartments',
  openGraph: {
    title: 'Huusy - Your Premier Real Estate Marketplace',
    description:
      'Find your perfect home with Huusy. Browse through our extensive collection of properties for sale and rent.',
    type: 'website',
    url: 'https://huusy.com',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Huusy Real Estate Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Huusy - Your Premier Real Estate Marketplace',
    description:
      'Find your perfect home with Huusy. Browse through our extensive collection of properties for sale and rent.',
    images: ['/images/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SmoothScroll>
          <HeaderWrapper />
          <main className='flex-1'>{children}</main>
          <FooterWrapper />
        </SmoothScroll>
      </body>
    </html>
  );
}
