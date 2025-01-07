import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = createClient();

  const { data: agent } = await supabase
    .from('account_pro')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!agent) {
    return {
      title: 'Agent Not Found - Real Estate Marketplace',
      description: 'The requested real estate agent could not be found.',
    };
  }

  return {
    title: `${agent.full_name} - Real Estate Agent Profile`,
    description:
      agent.description ||
      `View ${agent.full_name}'s profile and property listings. ${
        agent.agency_name ? `Associated with ${agent.agency_name}.` : ''
      } Contact for real estate assistance.`,
  };
}

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
