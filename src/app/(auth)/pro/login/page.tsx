import Image from 'next/image';
import LoginForm from './components/LoginForm';

export default function ProLoginPage() {
  return (
    <section className='h-screen flex flex-col items-center justify-center relative bg-primary-950'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0 overflow-hidden'>
        <Image
          src='/images/auth-bg.webp'
          alt='Background'
          fill
          priority
          className='object-cover object-center opacity-70'
        />
      </div>

      {/* Content */}
      <div className='container mx-auto relative z-10'>
        <div
          className='w-11/12 md:w-5/12 mx-auto flex flex-col items-start mb-8 p-8 rounded-2xl 
          bg-primary-950/60 backdrop-blur-md 
          border border-primary-50/10 space-y-4'
        >
          <h1 className='font-heading text-4xl text-primary-50 '>
            Professional Login
          </h1>

          <LoginForm />
        </div>
      </div>
    </section>
  );
}
