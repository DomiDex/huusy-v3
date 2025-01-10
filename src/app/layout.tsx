import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import HeaderWrapper from '@/components/layout/HeaderWrapper';
import FooterWrapper from '@/components/layout/FooterWrapper';
import SmoothScroll from '@/components/providers/SmoothScroll';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Huusy',
    default: 'Huusy - Real Estate Marketplace',
  },
  description:
    'Find your dream home with Huusy - The modern real estate marketplace',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://huusy.com'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Huusy',
  },
  robots: {
    index: true,
    follow: true,
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
