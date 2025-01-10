'use client';

import { useRouter } from 'next/navigation';
import {
  signUpCustomer,
  signUpPro,
  signInCustomer,
  signInPro,
} from '@/lib/auth/client-actions';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();

  const register = async (data: {
    email: string;
    password: string;
    username?: string;
    fullName?: string;
    agencyName?: string;
    phone?: string;
  }) => {
    try {
      // Determine if this is a pro or customer registration
      const isPro =
        'fullName' in data && 'agencyName' in data && 'phone' in data;

      let authData;

      if (isPro) {
        if (!data.fullName || !data.agencyName || !data.phone) {
          throw new Error('Missing required pro registration fields');
        }

        authData = await signUpPro({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          agencyName: data.agencyName,
          phone: data.phone,
        });
      } else {
        if (!data.username) {
          throw new Error('Username is required for customer registration');
        }

        authData = await signUpCustomer({
          email: data.email,
          password: data.password,
          username: data.username,
        });
      }

      if (!authData?.user?.id) {
        throw new Error('Failed to create user account');
      }

      toast.success(
        'Registration successful! Please check your email to verify your account.'
      );

      return authData;
    } catch (error: any) {
      console.error('Registration error details:', error);

      if (error.message?.includes('rate limit')) {
        throw new Error(
          'Too many registration attempts. Please try again in a few minutes.'
        );
      }

      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('An unexpected error occurred during registration');
    }
  };

  const login = async (
    email: string,
    password: string,
    accountType: 'customer' | 'pro' = 'customer'
  ) => {
    try {
      let response;

      if (accountType === 'pro') {
        response = await signInPro(email, password);
        if (!response.data?.user) {
          throw new Error('Login failed');
        }
        router.push(`/pro/${response.data.user.id}`);
      } else {
        response = await signInCustomer(email, password);
        if (!response.data?.user) {
          throw new Error('Login failed');
        }
        router.push(`/customer/${response.data.user.id}`);
      }

      return response;
    } catch (error: any) {
      console.error('Login error details:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  return { register, login };
}
