'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
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

  useEffect(() => {
    checkIfFavorite();
  }, [propertyId]);

  const checkIfFavorite = async () => {
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
  };

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
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('property_id', propertyId)
          .eq('customer_id', user.id);

        if (error) throw error;
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
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

  if (isLoading) {
    return (
      <button
        className='p-2 bg-white rounded-full shadow-sm hover:bg-primary-50 transition-colors'
        disabled
      >
        <HeartIcon className='w-6 h-6 text-primary-300' />
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      className='p-2 bg-white rounded-full shadow-sm hover:bg-primary-50 transition-colors'
    >
      {isFavorite ? (
        <HeartIconSolid className='w-6 h-6 text-red-500' />
      ) : (
        <HeartIcon className='w-6 h-6 text-primary-950' />
      )}
    </button>
  );
}
