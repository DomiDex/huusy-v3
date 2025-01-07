import MainHeader from '@/components/layout/headers/MainHeader';
import Footer from '@/components/layout/footer/footer';

export default function MainTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      <main className='flex-1'>{children}</main>
      <Footer />
    </>
  );
}
