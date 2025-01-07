import { Suspense } from 'react';
import Link from 'next/link';
import { getProperties, getPropertyTypes } from '@/services/properties';
import PropertyCardVertical from '@/components/properties/cards/PropertyCardVertical';
import TestimonialCard from '@/components/properties/cards/testimonial/TestimonialCard';
import MainCallToAction from '@/components/cta/MainCallToAction';
import BenefitSection from '@/components/home/BenefitSection';
import { ClientHeroSection } from '@/components/home/ClientHeroSection';
import PropertyTypeGrid from '@/components/properties/PropertyTypeGrid';

// Loading skeletons
function PropertyLoadingSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className='animate-pulse bg-primary-100 rounded-lg h-[300px]'
        />
      ))}
    </div>
  );
}

function PropertyTypeLoadingSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className='animate-pulse bg-primary-100 rounded-lg h-[200px]'
        />
      ))}
    </div>
  );
}

const TESTIMONIALS = [
  {
    testimonial:
      'Finding a new apartment in the city felt impossible until I found Huusy. Their website was so easy to use! The filters helped me narrow down exactly what I was looking for, and I loved being able to save my favorite listings. I found the perfect place in no time thanks to them!"',
    authorName: 'Sarah Johnson',
    authorTitle: 'Home Buyer',
    authorImage: '/images/testimonials/testimonial-1.jpg',
  },
  {
    testimonial:
      "As a real estate investor, time is money. Huusy's website has some really impressive tools. I can set up property alerts to be notified of new listings that meet my criteria, analyze market trends, and even estimate rental yields. It's like having a personal research assistant!",
    authorName: 'Michael Chen',
    authorTitle: 'New Homeowner',
    authorImage: '/images/testimonials/testimonial-2.jpg',
  },
  {
    testimonial:
      "I was a first-time home buyer and completely overwhelmed by the process. The team at Huusy was amazing. They patiently answered all my questions, helped me find a great realtor, and guided me through every step. I couldn't have done it without them!",
    authorName: 'Emma Chen',
    authorTitle: 'Happy Renter',
    authorImage: '/images/testimonials/testimonial-3.jpg',
  },
];

async function PropertiesSection() {
  const properties = await getProperties();

  return (
    <section className='pt-32 pb-8 px-4 md:px-16 relative z-10 bg-primary-50'>
      <div className='w-full max-w-[1400px] mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-2 mb-12'>
          <h2 className='text-2xl md:text-4xl font-heading text-primary-950'>
            Explore Our Properties
          </h2>
          <Link
            href='/properties'
            className='text-white bg-secondary-500 hover:bg-secondary-600 transition-colors duration-300 px-4 py-2 rounded-md text-lg font-body'
          >
            View All Properties
          </Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {properties.slice(0, 8).map((property) => (
            <PropertyCardVertical key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}

async function PropertyTypesSection() {
  const propertyTypes = await getPropertyTypes();

  return (
    <section className='pt-32 pb-32 px-4 md:px-16 relative z-10 bg-primary-50'>
      <div className='w-full max-w-[1400px] mx-auto'>
        <div className='flex flex-col justify-center items-center gap-4 mb-12'>
          <h2 className='text-2xl md:text-4xl font-heading text-primary-950'>
            Browse by Property Type
          </h2>
          <p className='text-primary-950 text-center text-lg font-body w-full max-w-[600px]'>
            Discover properties that match your specific needs and preferences
          </p>
        </div>
        <PropertyTypeGrid propertyTypes={propertyTypes} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <ClientHeroSection />
      <BenefitSection />

      <Suspense fallback={<PropertyLoadingSkeleton />}>
        <PropertiesSection />
      </Suspense>

      <section className='pt-32 pb-32 px-4 md:px-16 relative z-10 bg-primary-50'>
        <div className='w-full max-w-[1400px] mx-auto flex flex-col justify-center items-center gap-8'>
          <div className='flex flex-col justify-center items-center gap-4 mb-12'>
            <h2 className='text-2xl md:text-4xl font-heading text-primary-950'>
              How We make a Difference
            </h2>
            <p className='text-primary-950 text-center text-lg font-body w-full max-w-[600px]'>
              We are a team of experienced real estate professionals who are
              dedicated to providing the best possible service to our clients.
            </p>
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4'>
            {TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <MainCallToAction />

      <Suspense fallback={<PropertyTypeLoadingSkeleton />}>
        <PropertyTypesSection />
      </Suspense>
    </>
  );
}
