'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import Image from 'next/image';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils/formatting';
import BathroomIcon from '@/components/icons/bathroomIcon';
import BedroomIcon from '@/components/icons/bedroomIcon';
import WhatsAppButton from '@/components/properties/cards/components/WhatsAppButton';
import FavoriteButton from '@/components/properties/cards/components/FavoriteButton';
import type { Property, AccountPro } from '@/lib/supabase/types';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import PropertyCardVertical from '@/components/properties/cards/PropertyCardVertical';
import TestimonialCard from '@/components/properties/cards/testimonial/TestimonialCard';

export default function PropertyDetailPage() {
  const [property, setProperty] = useState<
    | (Property & {
        property_type: { id: string; title: string };
        city: { id: string; title: string };
        sale_type: { id: string; title: string };
        agent: AccountPro;
      })
    | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProperties, setRelatedProperties] = useState<
    (Property & {
      property_type: { id: string; title: string };
      city: { id: string; title: string };
      sale_type: { id: string; title: string };
      agent: AccountPro;
    })[]
  >([]);

  const params = useParams();
  const path = params.path as string;
  const supabase = createClient();

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select(
            `
            *,
            property_type:property_types(id, title),
            city:cities(id, title),
            sale_type:sale_types(id, title),
            agent:account_pro(*)
          `
          )
          .eq('path', path)
          .single();

        if (propertyError) {
          console.error('Supabase error:', propertyError);
          setError(propertyError.message);
          return;
        }

        if (!propertyData) {
          setError('Property not found');
          return;
        }

        setProperty(propertyData);

        // Fetch related properties
        const { data: relatedData } = await supabase
          .from('properties')
          .select(
            `
            *,
            property_type:property_types(id, title),
            city:cities(id, title),
            sale_type:sale_types(id, title),
            agent:account_pro(*)
          `
          )
          .eq('sale_type_id', propertyData.sale_type_id)
          .neq('id', propertyData.id)
          .limit(3);

        setRelatedProperties(relatedData || []);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [path]);

  if (loading) {
    return (
      <>
        <MainHeader variant='light' />
        <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
          <div className='w-full max-w-[1400px] mx-auto'>
            <p className='text-primary-800'>Loading property details...</p>
          </div>
        </section>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <MainHeader variant='light' />
        <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
          <div className='w-full max-w-[1400px] mx-auto'>
            <p className='text-red-500'>Error: {error}</p>
          </div>
        </section>
      </>
    );
  }

  const slides = property.images.map((image) => ({
    src: image,
    alt: `${property.property_name} - ${property.city.title}`,
    width: 1600,
    height: 900,
    srcSet: [
      { src: image, width: 800, height: 450 },
      { src: image, width: 1600, height: 900 },
    ],
  }));

  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Main Content */}
            <div className='flex-1'>
              {/* Image Gallery */}
              <div className='grid grid-cols-1 gap-4 mb-8'>
                {property.images.length === 1 ? (
                  // Single image layout
                  <div
                    className='relative aspect-video cursor-pointer'
                    onClick={() => {
                      setCurrentImageIndex(0);
                      setIsLightboxOpen(true);
                    }}
                  >
                    <Image
                      src={property.images[0]}
                      alt={property.property_name}
                      fill
                      className='object-cover rounded-lg'
                    />
                  </div>
                ) : (
                  // Multiple images layout in a grid
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {property.images.map((image, index) => (
                      <div
                        key={index}
                        className='relative aspect-video cursor-pointer'
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <Image
                          src={image}
                          alt={`${property.property_name} - ${index + 1}`}
                          fill
                          className='object-cover rounded-lg'
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className='bg-white rounded-lg shadow-sm p-8 mb-8'>
                <div className='flex justify-between items-start mb-6'>
                  <div>
                    <span className='inline-block px-3 py-1.5 bg-secondary-500 text-sm text-white rounded-md mb-3'>
                      {property.sale_type.title}
                    </span>
                    <h1 className='text-3xl font-heading text-primary-950 mb-2'>
                      {property.property_name}
                    </h1>
                    <div className='flex items-center gap-2 text-primary-600'>
                      <MapPinIcon className='w-5 h-5' />
                      <span>
                        {property.address}, {property.city.title}
                      </span>
                    </div>
                  </div>
                  <div className='text-2xl font-bold text-secondary-500'>
                    {formatPrice(property.price)}
                  </div>
                </div>

                <div className='flex gap-6 mb-8'>
                  <div className='flex items-center gap-2'>
                    <BedroomIcon className='w-6 h-6 text-primary-600' />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <BathroomIcon className='w-6 h-6 text-primary-600' />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium'>
                      {property.property_size}
                    </span>
                    <span>sq ft</span>
                  </div>
                </div>

                <div className='prose max-w-none'>
                  <p>{property.property_details}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className='lg:w-80'>
              <div className='bg-white rounded-lg shadow-sm p-6 sticky top-32'>
                <div className='flex items-center gap-4 mb-6'>
                  <div className='relative w-16 h-16'>
                    <Image
                      src={
                        property.agent.profile_image_url ||
                        '/images/placeholder-agent.jpg'
                      }
                      alt={property.agent.full_name}
                      fill
                      className='object-cover rounded-full'
                    />
                  </div>
                  <div>
                    <h3 className='font-heading text-lg text-primary-950'>
                      {property.agent.full_name}
                    </h3>
                    {property.agent.agency_name && (
                      <p className='text-primary-600'>
                        {property.agent.agency_name}
                      </p>
                    )}
                  </div>
                </div>

                <div className='space-y-4'>
                  <WhatsAppButton
                    phone={property.agent.phone}
                    propertyTitle={property.title}
                  />
                  <FavoriteButton propertyId={property.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProperties.length > 0 && (
        <section className='pb-16 px-4 md:px-8'>
          <div className='w-full max-w-[1400px] mx-auto'>
            <h2 className='text-2xl font-heading text-primary-950 mb-8'>
              Similar Properties in {property.city.title}
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {relatedProperties.map((relatedProperty) => (
                <PropertyCardVertical
                  key={relatedProperty.id}
                  property={relatedProperty}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={currentImageIndex}
        slides={slides}
        plugins={[Thumbnails, Zoom, Counter]}
        carousel={{
          spacing: 0,
          padding: 0,
        }}
        thumbnails={{
          position: 'bottom',
          width: 120,
          height: 80,
          border: 2,
          borderRadius: 4,
          padding: 4,
          gap: 16,
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2,
        }}
        counter={{
          container: {
            style: {
              top: 'unset',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '20px',
              padding: '4px 12px',
            },
          },
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
        }}
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
        }}
      />
    </>
  );
}
