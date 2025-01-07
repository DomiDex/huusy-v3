'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface PropertyImageSliderProps {
  images: string[];
  aspectRatio?: string;
}

export default function PropertyImageSlider({
  images,
  aspectRatio = 'aspect-[4/3]',
}: PropertyImageSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div
      className={`relative w-full ${aspectRatio} overflow-hidden rounded-xl bg-primary-100`}
    >
      <div className='overflow-hidden h-full' ref={emblaRef}>
        <div className='flex h-full'>
          {images.map((image, index) => (
            <div key={index} className='relative flex-[0_0_100%] h-full'>
              <Image
                src={image}
                alt={`Property image ${index + 1}`}
                fill
                className='object-cover'
                sizes='(max-width: 768px) 100vw, 400px'
                priority={index === 0}
                onLoadingComplete={() => setIsLoading(false)}
                onError={(e) => {
                  console.error('Image failed to load:', image);
                  e.currentTarget.src = '/placeholder-property.jpg';
                }}
              />
              {isLoading && (
                <div className='absolute inset-0 flex items-center justify-center bg-primary-100'>
                  <div className='w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin'></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='absolute bottom-4 left-0 right-0 flex justify-center gap-2'>
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}
