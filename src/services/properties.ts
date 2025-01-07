import { createClient } from '@/lib/supabase/server';
import { Property } from '@/lib/supabase/types';
import { cache } from 'react';

export const getProperties = cache(async () => {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('properties')
      .select(
        `
        id,
        property_name,
        path,
        excerpt,
        images,
        bathrooms,
        bedrooms,
        property_size,
        price,
        address,
        property_type:property_types!property_type_id (
          id, 
          title
        ),
        city:cities!city_id (
          id, 
          title
        ),
        sale_type:sale_types!sale_type_id (
          id, 
          title
        ),
        agent:account_pro!agent_id (
          id,
          full_name,
          email,
          agency_name,
          phone,
          profile_image_url
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data as Property[];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
});

export const getPropertyTypes = cache(async () => {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('property_types')
      .select('*')
      .order('title');

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching property types:', error);
    return [];
  }
});
