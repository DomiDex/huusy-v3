'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export default function BenefitSection() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '700%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-600%']);

  return (
    <section className='py-32 px-4 md:px-16 relative z-10 bg-primary-50 mt-[700px]'>
      <div className='container mx-auto flex md:flex-row flex-col justify-between items-center gap-12'>
        {/* Left Content */}
        <div className='flex flex-col items-start space-y-8 md:w-5/12'>
          <div className='space-y-4'>
            <h2 className='text-3xl font-heading text-primary-950'>
              Benefits of Using Our Platform
            </h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste at
              ipsam quo eveniet quis sequi delectus. Inventore vel ad ipsa qui
              reiciendis nemo molestiae deleniti! Minus impedit error sit dicta.
            </p>
          </div>
        </div>

        {/* Right Images */}
        <div className='relative md:w-7/12 h-[300px] bg-primary-50/50'>
          {/* First Image - Moving Up (Landscape) */}
          <motion.div
            className='absolute left-24 md:left-0 top-0 md:w-[220px] md:h-[140px] w-[140px] h-[80px] z-10 shadow-lg'
            style={{ y: y1 }}
          >
            <Image
              src='/images/parallax/parallaxleft@2x.webp'
              alt='Property 1'
              fill
              priority
              quality={100}
              className='object-cover rounded-2xl'
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.currentTarget.src = '/images/placeholder.jpg';
              }}
            />
          </motion.div>

          {/* Middle Image - Static (Bigger) */}
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[350px] z-0'>
            <Image
              src='/images/parallax/parallax-middle@2x.webp'
              alt='Property 2'
              fill
              priority
              sizes='(max-width: 768px) 100vw, 300px'
              quality={100}
              className='object-cover rounded-2xl'
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.currentTarget.src = '/images/placeholder.jpg';
              }}
            />
          </div>

          {/* Third Image - Moving Down (Smaller) */}
          <motion.div
            className='absolute md:right-0 right-12 bottom-0 md:w-[190px] md:h-[250px] w-[140px] h-[160px] z-10 shadow-lg'
            style={{ y: y2 }}
          >
            <Image
              src='/images/parallax/parallax-right@2x.webp'
              alt='Property 3'
              fill
              priority
              sizes='(max-width: 768px) 100vw, 160px'
              quality={100}
              className='object-cover rounded-2xl'
              onError={(e) => {
                console.error('Image failed to load:', e);
                e.currentTarget.src = '/images/placeholder.jpg';
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
