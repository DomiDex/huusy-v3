'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import SearchTab from './SearchTab';

export function ClientHeroSection() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.7]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.8, 0]);

  return (
    <section className='pt-32 pb-8 px-4 md:px-16 h-screen fixed top-0 left-0 w-full z-0 overflow-hidden flex flex-col items-center justify-center bg-primary-950'>
      <motion.div className='absolute inset-0 z-0' style={{ scale, opacity }}>
        <Image
          src='/images/background/hero@2x.webp'
          alt='Hero Background'
          fill
          priority
          quality={100}
          sizes='100vw'
          className='object-cover'
        />
      </motion.div>
      <div className='absolute inset-0 bg-primary-950/20 z-1' />

      <div className='relative z-2 w-full max-w-[1400px] mx-auto'>
        <h1 className='text-4xl font-heading text-white text-center'>
          Find Your Perfect Home
        </h1>
        <p className='text-white text-center font-body w-full max-w-[600px] mx-auto mb-8'>
          Find your perfect home with Huusy. Our platform offers a wide range of
          properties, from apartments to mansions, and from urban to rural
          locations.
        </p>
        <SearchTab />
      </div>
    </section>
  );
}
