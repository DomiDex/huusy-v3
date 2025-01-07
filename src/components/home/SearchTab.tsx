'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface City {
  id: string;
  title: string;
  path: string;
}

interface PropertyType {
  id: string;
  title: string;
  path: string;
}

export default function SearchTab() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'rent' | 'buy'>('rent');
  const [cities, setCities] = useState<City[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const supabase = createClient();

    async function fetchFilterData() {
      try {
        const [
          { data: citiesData, error: citiesError },
          { data: propertyTypesData, error: propertyTypesError },
        ] = await Promise.all([
          supabase.from('cities').select('id, title, path').order('title'),
          supabase
            .from('property_types')
            .select('id, title, path')
            .order('title'),
        ]);

        if (citiesError) throw citiesError;
        if (propertyTypesError) throw propertyTypesError;

        if (citiesData) setCities(citiesData);
        if (propertyTypesData) setPropertyTypes(propertyTypesData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    }

    fetchFilterData();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const params = new URLSearchParams();
    params.append('search', searchTerm);
    params.append('saleType', activeTab === 'rent' ? 'For Rent' : 'For Sale');
    router.push(`/properties/search?${params.toString()}`);
  };

  const handleCityChange = (cityPath: string) => {
    if (!cityPath) return;
    router.push(`/properties/cities/${cityPath}`);
  };

  const handlePropertyTypeChange = (typePath: string) => {
    if (!typePath) return;
    router.push(`/properties/types/${typePath}`);
  };

  return (
    <div className='w-10/12 mx-auto'>
      <div className='flex flex-row gap-4'>
        <button
          onClick={() => setActiveTab('rent')}
          className={`backdrop-blur-md px-4 py-2 rounded-t-md ${
            activeTab === 'rent'
              ? 'bg-primary-950 text-white'
              : 'bg-primary-950/60 text-white/80'
          }`}
        >
          Rent
        </button>
        <button
          onClick={() => setActiveTab('buy')}
          className={`backdrop-blur-md px-4 py-2 rounded-t-md ${
            activeTab === 'buy'
              ? 'bg-primary-950 text-white'
              : 'bg-primary-950/60 text-white/80'
          }`}
        >
          Buy
        </button>
      </div>
      <div className='bg-primary-950/60 backdrop-blur-md rounded-tr-md rounded-br-md rounded-bl-md p-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1 flex gap-4'>
            <input
              type='text'
              placeholder='Search properties...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='flex-1 px-4 py-2 rounded-md bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:border-white/40'
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className='px-6 py-2 bg-secondary-500 text-white rounded-md hover:bg-secondary-600 transition-colors'
            >
              Search
            </button>
          </div>
          <select
            onChange={(e) => handleCityChange(e.target.value)}
            className='px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40'
            defaultValue=''
          >
            <option value=''>Browse by City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.path}>
                {city.title}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => handlePropertyTypeChange(e.target.value)}
            className='px-4 py-2 rounded-md bg-white/10 text-white border border-white/20 focus:outline-none focus:border-white/40'
            defaultValue=''
          >
            <option value=''>Browse by Type</option>
            {propertyTypes.map((type) => (
              <option key={type.id} value={type.path}>
                {type.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
