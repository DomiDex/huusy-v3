import MainHeader from '@/components/layout/headers/MainHeader';
import Footer from '@/components/layout/footer/footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <MainHeader />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
