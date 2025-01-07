import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Property, AccountPro } from '@/lib/supabase/types';

export type PropertyWithRelations = Property & {
  property_type: { id: string; title: string };
  city: { id: string; title: string };
  sale_type: { id: string; title: string };
  agent: AccountPro;
};

type UsePropertiesOptions = {
  cityId?: string;
  propertyTypeId?: string;
  saleTypeId?: string;
  filters?: {
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
  };
};

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<PropertyWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = createClient();

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

      if (options.cityId) query = query.eq('city_id', options.cityId);
      if (options.propertyTypeId)
        query = query.eq('property_type_id', options.propertyTypeId);
      if (options.saleTypeId)
        query = query.eq('sale_type_id', options.saleTypeId);

      if (options.filters) {
        const { minPrice, maxPrice, bedrooms, bathrooms } = options.filters;
        if (minPrice) query = query.gte('price', minPrice);
        if (maxPrice) query = query.lte('price', maxPrice);
        if (bedrooms) query = query.gte('bedrooms', bedrooms);
        if (bathrooms) query = query.gte('bathrooms', bathrooms);
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load properties'
      );
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, error, refetch: fetchProperties };
}
