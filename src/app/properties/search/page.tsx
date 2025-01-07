'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import MainCardWild from '@/components/properties/cards/MainCardWild';
import MainCardSkeleton from '@/components/skeleton/MainCardSkeleton';
import FilterSidebar from '@/components/properties/filters/FilterSidebar';
import { useSearchParams } from 'next/navigation';
import type { Property, AccountPro } from '@/lib/supabase/types';
import { Metadata } from 'next';

// Loading skeleton component
function LoadingState() {
  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          {/* Title and search info skeleton */}
          <div className='space-y-4 mb-8'>
            <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg' />
            <div className='w-96 h-6 bg-primary-100 animate-pulse rounded' />
          </div>

          <div className='flex flex-col md:flex-row gap-8'>
            {/* Sidebar skeleton */}
            <aside className='md:w-64 md:flex-shrink-0'>
              <div className='bg-white rounded-lg p-6 shadow-sm'>
                <div className='space-y-4'>
                  {/* Filter title skeletons */}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className='space-y-2'>
                      <div className='w-24 h-4 bg-primary-100 animate-pulse rounded' />
                      <div className='w-full h-10 bg-primary-50 animate-pulse rounded' />
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main content skeleton */}
            <main className='flex-1'>
              <div className='grid grid-cols-1 gap-6'>
                {[...Array(3)].map((_, index) => (
                  <MainCardSkeleton key={index} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
}

export default function SearchResultsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<
    (Property & {
      property_type: { id: string; title: string };
      city: { id: string; title: string };
      sale_type: { id: string; title: string };
      agent: AccountPro;
    })[]
  >([]);

  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    async function fetchProperties() {
      try {
        setIsLoading(true);
        setError(null);

        let query = supabase
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
          .order('created_at', { ascending: false });

        // Get all search parameters
        const saleType = searchParams.get('saleType');
        const search = searchParams.get('search');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const bedrooms = searchParams.get('bedrooms');
        const bathrooms = searchParams.get('bathrooms');
        const cityId = searchParams.get('cityId');
        const propertyTypeId = searchParams.get('propertyTypeId');

        // Apply database-level filters first
        if (minPrice) query = query.gte('price', minPrice);
        if (maxPrice) query = query.lte('price', maxPrice);
        if (bedrooms) query = query.gte('bedrooms', bedrooms);
        if (bathrooms) query = query.gte('bathrooms', bathrooms);
        if (cityId) query = query.eq('city_id', cityId);
        if (propertyTypeId)
          query = query.eq('property_type_id', propertyTypeId);

        if (saleType) {
          const { data: saleTypeData } = await supabase
            .from('sale_types')
            .select('id')
            .eq('title', saleType)
            .single();

          if (saleTypeData) {
            query = query.eq('sale_type_id', saleTypeData.id);
          }
        }

        if (search) {
          const searchTerms = search
            .toLowerCase()
            .split(' ')
            .filter(Boolean)
            .map((term) => term.trim());

          // First, get all related data
          const { data: searchResults, error: searchError } = await supabase
            .from('properties')
            .select(
              `
              *,
              property_type:property_types(id, title, path),
              city:cities(id, title, path),
              sale_type:sale_types(id, title, path),
              agent:account_pro(
                id, 
                full_name, 
                email, 
                agency_name, 
                phone, 
                description
              )
            `
            )
            .order('created_at', { ascending: false });

          if (searchError) throw searchError;

          const filteredData = searchResults?.filter((property) => {
            // Create comprehensive searchable variations
            const searchableVariations = {
              // Property basic info
              basic: [
                property.property_name,
                property.path,
                property.excerpt,
                property.property_details,
                property.address,
                property.meta_title,
                property.meta_description,
              ],
              // Location info
              location: [
                property.address,
                property.city?.title,
                property.city?.path,
                property.city?.meta_title,
                property.city?.meta_description,
              ],
              // Property type info
              propertyType: [
                property.property_type?.title,
                property.property_type?.path,
                property.sale_type?.title,
                property.sale_type?.path,
              ],
              // Agent info
              agent: [
                property.agent?.full_name,
                property.agent?.agency_name,
                property.agent?.email,
                property.agent?.phone,
                property.agent?.description,
              ],
              // Numeric values with variations
              numeric: [
                // Price variations
                property.price?.toString(),
                property.price?.toLocaleString(),
                `$${property.price}`,
                `${Math.round(property.price / 1000)}k`,
                `${(property.price / 1000000).toFixed(1)}m`,
                // Property specs
                `${property.bedrooms} bed`,
                `${property.bedrooms} beds`,
                `${property.bedrooms}b`,
                `${property.bathrooms} bath`,
                `${property.bathrooms} baths`,
                `${property.bathrooms}ba`,
                `${property.property_size} sqft`,
                `${property.property_size} sq ft`,
              ],
            };

            return searchTerms.every((term) => {
              // Handle numeric searches (price, beds, baths, sqft)
              if (/^\d+$/.test(term) || term.startsWith('$')) {
                const cleanTerm = term.replace(/[$,]/g, '');
                const searchNumber = parseInt(cleanTerm);

                if (!isNaN(searchNumber)) {
                  // Check all numeric fields with appropriate thresholds
                  return (
                    Math.abs(property.price - searchNumber) <=
                      searchNumber * 0.15 ||
                    property.bedrooms === searchNumber ||
                    property.bathrooms === searchNumber ||
                    Math.abs(property.property_size - searchNumber) <=
                      searchNumber * 0.15
                  );
                }
              }

              // Handle special formats (3b, 2ba, etc.)
              if (term.match(/^(\d+)b$/i)) {
                return property.bedrooms === parseInt(term.replace(/b$/i, ''));
              }
              if (term.match(/^(\d+)ba$/i)) {
                return (
                  property.bathrooms === parseInt(term.replace(/ba$/i, ''))
                );
              }

              // General search across all fields
              const searchableText = Object.values(searchableVariations)
                .flat()
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

              return searchableText.includes(term);
            });
          });

          // Enhanced sorting by relevance
          if (filteredData?.length > 0) {
            const priceSearchTerm = searchTerms.find(
              (term) => /^\d+$/.test(term) || term.startsWith('$')
            );

            if (priceSearchTerm) {
              const targetPrice =
                parseInt(priceSearchTerm.replace(/[$,kmKM]/g, '')) *
                (priceSearchTerm.toLowerCase().includes('k')
                  ? 1000
                  : priceSearchTerm.toLowerCase().includes('m')
                  ? 1000000
                  : 1);

              filteredData.sort((a, b) => {
                const diffA = Math.abs((a.price - targetPrice) / targetPrice);
                const diffB = Math.abs((b.price - targetPrice) / targetPrice);
                return diffA - diffB;
              });
            }
          }

          if (isMounted) {
            setProperties(filteredData || []);
          }
          return;
        }

        const { data, error: queryError } = await query;

        if (queryError) {
          throw new Error(queryError.message);
        }

        if (isMounted) {
          setProperties(data || []);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to fetch properties';
          setError(errorMessage);
          console.error('Error fetching properties:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  return (
    <>
      <MainHeader />
      <section className='container mx-auto pt-32 pb-8 px-4 md:px-16'>
        <div className='flex flex-col md:flex-row gap-8'>
          <aside className='md:w-1/4'>
            <FilterSidebar />
          </aside>
          <main className='md:w-3/4'>
            {error ? (
              <div className='text-center py-12 bg-red-50 rounded-lg'>
                <p className='text-red-600'>{error}</p>
              </div>
            ) : isLoading ? (
              <LoadingState />
            ) : properties.length > 0 ? (
              <div className='grid gap-6'>
                {properties.map((property) => (
                  <MainCardWild key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className='text-center py-12 bg-primary-50 rounded-lg'>
                <p className='text-primary-800'>
                  No properties found matching your criteria.
                </p>
              </div>
            )}
          </main>
        </div>
      </section>
    </>
  );
}
