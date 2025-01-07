import { Suspense } from 'react';
import MainHeader from '@/components/layout/headers/MainHeader';

interface BaseLayoutProps {
  children: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <>
      <MainHeader variant='light' />
      <Suspense
        fallback={
          <div className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
            <div className='w-full max-w-[1400px] mx-auto'>
              <div className='animate-pulse bg-primary-100 h-8 w-48 mb-8' />
              <div className='animate-pulse bg-primary-100 h-96' />
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </>
  );
}
