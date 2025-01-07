'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import MainCardWild from '@/components/properties/cards/MainCardWild';
import MainCardSkeleton from '@/components/skeleton/MainCardSkeleton';
import Image from 'next/image';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import type { Property, AccountPro } from '@/lib/supabase/types';

// Loading skeleton component
function LoadingState() {
  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          {/* Agent profile card skeleton */}
          <div className='bg-white rounded-lg shadow-sm p-8 mb-12'>
            <div className='flex flex-col md:flex-row gap-8'>
              {/* Image skeleton */}
              <div className='relative w-full md:w-64 h-64'>
                <div className='w-full h-full bg-primary-100 animate-pulse rounded-lg' />
              </div>

              {/* Agent info skeleton */}
              <div className='flex-1 space-y-6'>
                {/* Name skeleton */}
                <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg' />

                {/* Contact info skeletons */}
                <div className='space-y-4'>
                  {/* Agency */}
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary-100 animate-pulse rounded' />
                    <div className='w-48 h-5 bg-primary-100 animate-pulse rounded' />
                  </div>
                  {/* Phone */}
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary-100 animate-pulse rounded' />
                    <div className='w-36 h-5 bg-primary-100 animate-pulse rounded' />
                  </div>
                  {/* Email */}
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-primary-100 animate-pulse rounded' />
                    <div className='w-52 h-5 bg-primary-100 animate-pulse rounded' />
                  </div>
                </div>

                {/* Bio skeleton */}
                <div className='space-y-2'>
                  <div className='w-full h-4 bg-primary-100 animate-pulse rounded' />
                  <div className='w-3/4 h-4 bg-primary-100 animate-pulse rounded' />
                  <div className='w-1/2 h-4 bg-primary-100 animate-pulse rounded' />
                </div>
              </div>
            </div>
          </div>

          {/* Properties section skeleton */}
          <div className='space-y-6'>
            {/* Section title skeleton */}
            <div className='w-48 h-6 bg-primary-100 animate-pulse rounded-lg' />

            {/* Properties grid */}
            <div className='grid grid-cols-1 gap-6'>
              {[...Array(3)].map((_, index) => (
                <MainCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function AgentDetailPage() {
  const [agent, setAgent] = useState<AccountPro | null>(null);
  const [properties, setProperties] = useState<
    (Property & {
      property_type: { id: string; title: string };
      city: { id: string; title: string };
      sale_type: { id: string; title: string };
    })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const agentId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    async function fetchAgentAndProperties() {
      try {
        // Fetch agent details
        const { data: agentData, error: agentError } = await supabase
          .from('account_pro')
          .select('*')
          .eq('id', agentId)
          .single();

        if (agentError) throw agentError;
        if (!agentData) {
          setError('Agent not found');
          return;
        }

        setAgent(agentData);

        // Fetch agent's properties
        const { data: propertiesData, error: propertiesError } = await supabase
          .from('properties')
          .select(
            `
            *,
            property_type:property_types(id, title),
            city:cities(id, title),
            sale_type:sale_types(id, title)
          `
          )
          .eq('agent_id', agentId)
          .order('created_at', { ascending: false });

        if (propertiesError) throw propertiesError;

        setProperties(propertiesData || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load agent details');
      } finally {
        setLoading(false);
      }
    }

    fetchAgentAndProperties();
  }, [agentId]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !agent) {
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

  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          <div className='bg-white rounded-lg shadow-sm p-8 mb-12'>
            <div className='flex flex-col md:flex-row gap-8'>
              <div className='relative w-full md:w-64 aspect-square'>
                <Image
                  src={
                    agent.profile_image_url || '/images/placeholder-agent.jpg'
                  }
                  alt={agent.full_name}
                  fill
                  className='object-cover rounded-lg'
                />
              </div>

              <div className='flex-1'>
                <h1 className='text-3xl font-heading text-primary-950 mb-4'>
                  {agent.full_name}
                </h1>

                {agent.agency_name && (
                  <div className='flex items-center gap-2 text-primary-600 mb-4'>
                    <BuildingOfficeIcon className='w-5 h-5' />
                    <span>{agent.agency_name}</span>
                  </div>
                )}

                <div className='flex items-center gap-2 text-primary-600 mb-4'>
                  <PhoneIcon className='w-5 h-5' />
                  <span>{agent.phone}</span>
                </div>

                <div className='flex items-center gap-2 text-primary-600 mb-6'>
                  <EnvelopeIcon className='w-5 h-5' />
                  <span>{agent.email}</span>
                </div>

                {agent.bio && (
                  <div className='prose max-w-none'>
                    <p>{agent.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h2 className='text-2xl font-heading text-primary-950 mb-8'>
            Properties Listed by {agent.full_name}
          </h2>

          <div className='grid grid-cols-1 gap-6'>
            {properties.map((property) => (
              <MainCardWild key={property.id} property={property} />
            ))}

            {properties.length === 0 && (
              <div className='text-center py-12 bg-primary-50 rounded-lg'>
                <p className='text-primary-800'>
                  No properties listed by this agent yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
