'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import MainHeader from '@/components/layout/headers/MainHeader';
import Image from 'next/image';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import type { AccountPro } from '@/lib/supabase/types';

// Loading skeleton component
function LoadingState() {
  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          {/* Title skeleton */}
          <div className='w-64 h-8 bg-primary-100 animate-pulse rounded-lg mb-8' />

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300'
              >
                {/* Image skeleton */}
                <div className='relative w-full h-48 md:h-64'>
                  <div className='w-full h-full bg-primary-100 animate-pulse rounded-t-lg' />
                </div>
                {/* Content skeleton */}
                <div className='p-6 space-y-4'>
                  {/* Name skeleton */}
                  <div className='w-48 h-6 bg-primary-100 animate-pulse rounded' />
                  {/* Agency skeleton */}
                  <div className='flex items-center gap-2'>
                    <div className='w-5 h-5 bg-primary-100 animate-pulse rounded' />
                    <div className='w-32 h-4 bg-primary-100 animate-pulse rounded' />
                  </div>
                  {/* Contact info skeletons */}
                  <div className='flex items-center gap-2'>
                    <div className='w-5 h-5 bg-primary-100 animate-pulse rounded' />
                    <div className='w-28 h-4 bg-primary-100 animate-pulse rounded' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AccountPro[]>([]);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function fetchAgents() {
      try {
        const { data, error } = await supabase
          .from('account_pro')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted) {
          setAgents(data || []);
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAgents();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          <h1 className='text-3xl font-heading text-primary-950 mb-8'>
            Our Real Estate Agents
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {agents.map((agent) => (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className='bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300'
              >
                <div className='relative w-full h-48 md:h-64'>
                  <Image
                    src={
                      agent.profile_image_url || '/images/placeholder-agent.jpg'
                    }
                    alt={agent.full_name}
                    fill
                    className='object-cover rounded-t-lg'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    priority
                  />
                </div>
                <div className='p-6'>
                  <h2 className='text-xl font-heading text-primary-950 mb-2'>
                    {agent.full_name}
                  </h2>
                  {agent.agency_name && (
                    <div className='flex items-center gap-2 text-primary-600 mb-2'>
                      <BuildingOfficeIcon className='w-5 h-5' />
                      <span>{agent.agency_name}</span>
                    </div>
                  )}
                  <div className='flex items-center gap-2 text-primary-600 mb-2'>
                    <PhoneIcon className='w-5 h-5' />
                    <span>{agent.phone}</span>
                  </div>
                  <div className='flex items-center gap-2 text-primary-600'>
                    <EnvelopeIcon className='w-5 h-5' />
                    <span>{agent.email}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
