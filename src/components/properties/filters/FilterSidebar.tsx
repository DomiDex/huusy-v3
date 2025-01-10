'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function FilterContent({
  onFilterChange,
}: {
  onFilterChange?: (filters: any) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchFilterData() {
      try {
        const [citiesResponse, propertyTypesResponse] = await Promise.all([
          supabase.from('cities').select('id, title').order('title'),
          supabase.from('property_types').select('id, title').order('title'),
        ]);

        setCities(citiesResponse.data || []);
        setPropertyTypes(propertyTypesResponse.data || []);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilterData();
  }, [supabase]);

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value) {
      current.delete(key);
    } else {
      current.set(key, value);
    }

    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`);

    if (onFilterChange) {
      const filters = Object.fromEntries(current.entries());
      onFilterChange(filters);
    }
  };

  if (loading) {
    return (
      <div className='bg-white rounded-lg p-6 shadow-sm space-y-6'>
        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='space-y-2'>
              <div className='w-24 h-4 bg-primary-100 animate-pulse rounded' />
              <div className='w-full h-10 bg-primary-50 animate-pulse rounded' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg p-6 shadow-sm space-y-6'>
      {/* Price Range */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-primary-950'>
          Price Range
        </label>
        <select
          className='w-full px-3 py-2 bg-primary-50 border border-primary-200 
          rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          value={searchParams.get('minPrice') || ''}
        >
          <option value=''>Min Price</option>
          <option value='100000'>$100,000</option>
          <option value='200000'>$200,000</option>
          <option value='300000'>$300,000</option>
          <option value='500000'>$500,000</option>
          <option value='750000'>$750,000</option>
          <option value='1000000'>$1,000,000</option>
        </select>
        <select
          className='w-full px-3 py-2 bg-primary-50 border border-primary-200 
          rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          value={searchParams.get('maxPrice') || ''}
        >
          <option value=''>Max Price</option>
          <option value='200000'>$200,000</option>
          <option value='300000'>$300,000</option>
          <option value='500000'>$500,000</option>
          <option value='750000'>$750,000</option>
          <option value='1000000'>$1,000,000</option>
          <option value='2000000'>$2,000,000+</option>
        </select>
      </div>

      {/* Bedrooms */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-primary-950'>
          Bedrooms
        </label>
        <select
          className='w-full px-3 py-2 bg-primary-50 border border-primary-200 
          rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
          value={searchParams.get('bedrooms') || ''}
        >
          <option value=''>Any</option>
          <option value='1'>1+</option>
          <option value='2'>2+</option>
          <option value='3'>3+</option>
          <option value='4'>4+</option>
          <option value='5'>5+</option>
        </select>
      </div>

      {/* Bathrooms */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-primary-950'>
          Bathrooms
        </label>
        <select
          className='w-full px-3 py-2 bg-primary-50 border border-primary-200 
          rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
          onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
          value={searchParams.get('bathrooms') || ''}
        >
          <option value=''>Any</option>
          <option value='1'>1+</option>
          <option value='2'>2+</option>
          <option value='3'>3+</option>
          <option value='4'>4+</option>
        </select>
      </div>

      {/* Property Type */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-primary-950'>
          Property Type
        </label>
        <select
          className='w-full px-3 py-2 bg-primary-50 border border-primary-200 
          rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
          onChange={(e) => handleFilterChange('propertyTypeId', e.target.value)}
          value={searchParams.get('propertyTypeId') || ''}
        >
          <option value=''>Any</option>
          {propertyTypes.map((type: any) => (
            <option key={type.id} value={type.id}>
              {type.title}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className='space-y-2'>
        <label className='block text-sm font-medium text-primary-950'>
          City
        </label>
        <select
          className='w-full px-3 py-2 bg-primary-50 border border-primary-200 
          rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
          onChange={(e) => handleFilterChange('cityId', e.target.value)}
          value={searchParams.get('cityId') || ''}
        >
          <option value=''>Any</option>
          {cities.map((city: any) => (
            <option key={city.id} value={city.id}>
              {city.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default function FilterSidebar({
  onFilterChange,
}: {
  onFilterChange?: (filters: any) => void;
}) {
  return (
    <Suspense
      fallback={
        <div className='bg-white rounded-lg p-6 shadow-sm space-y-6'>
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='space-y-2'>
                <div className='w-24 h-4 bg-primary-100 animate-pulse rounded' />
                <div className='w-full h-10 bg-primary-50 animate-pulse rounded' />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <FilterContent onFilterChange={onFilterChange} />
    </Suspense>
  );
}
