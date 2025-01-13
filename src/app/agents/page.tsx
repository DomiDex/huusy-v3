import { createClient } from '@/lib/supabase/server';
import MainHeader from '@/components/layout/headers/MainHeader';
import Image from 'next/image';
import Link from 'next/link';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

export default async function AgentsPage() {
  const supabase = createClient();

  const { data: agents } = await supabase
    .from('account_pro')
    .select('*')
    .order('created_at', { ascending: false });

  const transformedAgents =
    agents?.map((agent) => ({
      id: agent.id,
      full_name: agent.full_name,
      email: agent.email,
      agency_name: agent.agency_name || '',
      phone: agent.phone,
      profile_image_url: agent.profile_image_url,
      description: agent.description,
      account_type: 'pro' as const,
      created_at: agent.created_at,
      updated_at: agent.updated_at,
    })) || [];

  return (
    <>
      <MainHeader variant='light' />
      <section className='min-h-screen pt-32 pb-8 px-4 md:px-8'>
        <div className='w-full max-w-[1400px] mx-auto'>
          <h1 className='text-3xl font-heading text-primary-950 mb-8'>
            Our Real Estate Agents
          </h1>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {transformedAgents.map((agent) => (
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
