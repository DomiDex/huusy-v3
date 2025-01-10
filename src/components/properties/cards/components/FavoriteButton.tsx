'use client';

import { useState, useEffect, useCallback } from 'react';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  propertyId: string;
}

export default function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  const checkIfFavorite = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('property_id', propertyId)
        .eq('customer_id', user.id)
        .single();

      setIsFavorite(!!data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      setIsLoading(false);
    }
  }, [propertyId, supabase]);

  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  const toggleFavorite = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please login to save favorites');
        router.push('/login');
        return;
      }

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('property_id', propertyId)
          .eq('customer_id', user.id);

        if (error) throw error;
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase.from('favorites').insert({
          property_id: propertyId,
          customer_id: user.id,
        });

        if (error) throw error;
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className='p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow duration-200'
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <HeartIconSolid className='w-6 h-6 text-red-500' />
      ) : (
        <HeartIconOutline className='w-6 h-6 text-gray-600' />
      )}
    </button>
  );
}
