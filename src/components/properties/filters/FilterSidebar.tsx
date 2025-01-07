import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { City, PropertyType } from '@/lib/supabase/types';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterState {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  cityId: string;
  propertyTypeId: string;
}

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [cities, setCities] = useState<City[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    cityId: searchParams.get('cityId') || '',
    propertyTypeId: searchParams.get('propertyTypeId') || '',
  });

  useEffect(() => {
    async function fetchFilterData() {
      const [citiesData, propertyTypesData] = await Promise.all([
        supabase.from('cities').select('id, title').order('title'),
        supabase.from('property_types').select('id, title').order('title'),
      ]);

      if (citiesData.data) setCities(citiesData.data);
      if (propertyTypesData.data) setPropertyTypes(propertyTypesData.data);
    }

    fetchFilterData();
  }, []);

  const handleFilterChange = (name: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      cityId: '',
      propertyTypeId: '',
    });
    router.push('/properties');
  };

  return (
    <div className='w-full md:w-64 bg-white p-6 rounded-lg shadow-sm space-y-6'>
      <h2 className='text-xl font-heading text-primary-950'>Filters</h2>

      {/* Price Range */}
      <div className='space-y-4'>
        <h3 className='text-sm font-medium text-primary-950'>Price Range</h3>
        <div className='grid grid-cols-2 gap-2'>
          <div>
            <input
              type='number'
              placeholder='Min'
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className='w-full px-3 py-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>
          <div>
            <input
              type='number'
              placeholder='Max'
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className='w-full px-3 py-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div className='space-y-2'>
        <h3 className='text-sm font-medium text-primary-950'>Bedrooms</h3>
        <select
          value={filters.bedrooms}
          onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
          className='w-full px-3 py-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
        >
          <option value=''>Any</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}+
            </option>
          ))}
        </select>
      </div>

      {/* Bathrooms */}
      <div className='space-y-2'>
        <h3 className='text-sm font-medium text-primary-950'>Bathrooms</h3>
        <select
          value={filters.bathrooms}
          onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
          className='w-full px-3 py-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
        >
          <option value=''>Any</option>
          {[1, 1.5, 2, 2.5, 3, 3.5, 4].map((num) => (
            <option key={num} value={num}>
              {num}+
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className='space-y-2'>
        <h3 className='text-sm font-medium text-primary-950'>City</h3>
        <select
          value={filters.cityId}
          onChange={(e) => handleFilterChange('cityId', e.target.value)}
          className='w-full px-3 py-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
        >
          <option value=''>Any</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.title}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div className='space-y-2'>
        <h3 className='text-sm font-medium text-primary-950'>Property Type</h3>
        <select
          value={filters.propertyTypeId}
          onChange={(e) => handleFilterChange('propertyTypeId', e.target.value)}
          className='w-full px-3 py-2 text-sm border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
        >
          <option value=''>Any</option>
          {propertyTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.title}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className='space-y-2 pt-4'>
        <button
          onClick={applyFilters}
          className='w-full px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors'
        >
          Apply Filters
        </button>
        <button
          onClick={clearFilters}
          className='w-full px-4 py-2 bg-primary-100 text-primary-950 rounded-lg hover:bg-primary-200 transition-colors'
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
