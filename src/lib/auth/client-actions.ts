'use server';

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              // Ensure proper cookie options
              path: options.path ?? '/',
              sameSite: options.sameSite ?? 'lax',
              httpOnly: options.httpOnly ?? true,
            });
          } catch (err) {
            console.error('Error setting cookie:', err);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({
              name,
              path: options.path ?? '/',
              sameSite: options.sameSite ?? 'lax',
            });
          } catch (err) {
            console.error('Error removing cookie:', err);
          }
        },
      },
    }
  );
};

export async function signInCustomer(email: string, password: string) {
  const supabase = await createClient();

  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return response;
}

export async function signInPro(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  if (!data.user) {
    throw new Error('Login failed');
  }

  // Check if user exists in account_pro table
  const { data: proAccount, error: profileError } = await supabase
    .from('account_pro')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError || !proAccount) {
    // If login succeeds but pro profile doesn't exist, sign them out
    await supabase.auth.signOut();
    throw new Error('This account is not registered as a pro user');
  }

  return { data, proAccount };
}

export async function signUpCustomer({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) {
  const supabase = await createClient();

  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        role: 'customer',
      },
    },
  });

  return response;
}

export async function signUpPro({
  email,
  password,
  fullName,
  agencyName,
  phone,
}: {
  email: string;
  password: string;
  fullName: string;
  agencyName: string;
  phone: string;
}) {
  const supabase = await createClient();

  // First create the user account
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'pro',
      },
    },
  });

  if (signUpError) throw signUpError;

  if (!authData.user) {
    throw new Error('Failed to create user account');
  }

  // Then create the pro profile
  const { error: profileError } = await supabase.from('account_pro').insert({
    id: authData.user.id,
    full_name: fullName,
    agency_name: agencyName,
    phone: phone,
    email: email,
    description: '', // Add default empty description
    profile_image_url: null, // Add default null profile image
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    console.error('Profile creation error:', profileError);
    // If profile creation fails, we should clean up the auth user
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error('Failed to create pro profile');
  }

  return authData;
}
