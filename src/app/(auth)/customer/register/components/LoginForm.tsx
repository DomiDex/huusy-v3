'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginForm({
  type = 'customer',
}: {
  type?: 'customer' | 'pro';
}) {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(formData.email, formData.password, type);

      if (!response?.user?.id) {
        throw new Error('Login failed');
      }

      // Clear form data
      setFormData({
        email: '',
        password: '',
      });

      // Show success message
      toast.success('Login successful!');

      // Let the router handle the redirect based on user type
      if (type === 'pro') {
        router.push(`/pro/${response.user.id}`);
      } else {
        router.push(`/customer/${response.user.id}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <button
        type='button'
        className='w-full flex items-center justify-center gap-2 py-3 px-4 
        bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-50 
        transition-colors duration-200'
      >
        <Image
          src='/icons/google.svg'
          alt='Google'
          width={20}
          height={20}
          className='w-5 h-5'
        />
        Continue with Google
      </button>

      <div className='relative'>
        <div className='relative flex justify-center items-center text-sm'>
          <span className='h-[1px] w-1/3 bg-primary-50/20'></span>
          <span className='px-2 text-primary-50'>Or continue with</span>
          <span className='h-[1px] w-1/3 bg-primary-50/20'></span>
        </div>
      </div>

      <div className='space-y-4'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-primary-50'
          >
            Email
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='mt-1 block w-full px-3 py-2 bg-primary-900/50 border 
            border-secondary-500/50 rounded-lg text-primary-50 
            placeholder:text-primary-50/50 focus:outline-none 
            focus:ring-2 focus:ring-secondary-500'
            placeholder='Enter your email'
            required
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-primary-50'
          >
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            className='mt-1 block w-full px-3 py-2 bg-primary-900/50 border 
            border-secondary-500/50 rounded-lg text-primary-50 
            placeholder:text-primary-50/50 focus:outline-none 
            focus:ring-2 focus:ring-secondary-500'
            placeholder='Enter your password'
            required
          />
        </div>
      </div>

      {type === 'pro' && (
        <div className='flex items-center justify-between text-sm'>
          <Link
            href='/pro/register'
            className='text-secondary-400 hover:text-secondary-300 font-main'
          >
            Create an account
          </Link>
          <Link
            href='/pro/forgot-password'
            className='text-secondary-400 hover:text-secondary-300 font-main'
          >
            Forgot password?
          </Link>
        </div>
      )}

      <button
        type='submit'
        disabled={isLoading}
        className='w-full py-3 px-4 bg-secondary-500 text-primary-950 font-medium
        rounded-lg hover:bg-secondary-600 transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
