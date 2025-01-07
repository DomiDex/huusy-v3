'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useProperties } from '@/hooks/useProperties';
import PropertyPageLayout from '@/components/layout/PropertyPageLayout';

export default function PropertyTypePage() {
  const [typeName, setTypeName] = useState('');
  const [typeId, setTypeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const path = params.path as string;
  const searchParams = useSearchParams();

  const filters = {
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    bedrooms: searchParams.get('bedrooms') || undefined,
    bathrooms: searchParams.get('bathrooms') || undefined,
  };

  useEffect(() => {
    async function fetchPropertyType() {
      try {
        const supabase = createClient();
        const { data: type } = await supabase
          .from('property_types')
          .select('id, title')
          .eq('path', path)
          .single();

        if (!type) {
          setError('Property type not found');
          return;
        }

        setTypeName(type.title);
        setTypeId(type.id);
      } catch (err) {
        console.error('Error fetching property type:', err);
        setError('Failed to load property type');
      }
    }

    fetchPropertyType();
  }, [path]);

  const {
    properties,
    loading,
    error: propertiesError,
  } = useProperties({
    propertyTypeId: typeId || undefined,
    filters,
  });

  return (
    <PropertyPageLayout
      title={`${typeName} Properties`}
      properties={properties}
      loading={loading || !typeId}
      error={error || propertiesError}
      emptyMessage={`No ${typeName.toLowerCase()} properties found matching your criteria.`}
    />
  );
}
