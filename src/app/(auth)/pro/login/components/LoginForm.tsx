'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';

export default function LoginForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast.success(
        'Registration complete! Please confirm your email address to activate your account.'
      );
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password, 'pro');
      toast.success('Login successful!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-md space-y-6 mt-8'>
      <div className='space-y-4'>
        <div>
          <label
            htmlFor='email'
            className='block text-primary-50 text-sm font-main mb-2'
          >
            Email Address
          </label>
          <input
            id='email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full px-4 py-2 bg-primary-950/60 border border-secondary-500/50 
            rounded-lg focus:outline-none focus:ring-[1px] focus:ring-secondary-500 
            text-primary-50 placeholder-primary-200'
            placeholder='Enter your email'
            required
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-primary-50 text-sm font-main mb-2'
          >
            Password
          </label>
          <input
            id='password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            className='w-full px-4 py-2 bg-primary-950/60 border border-secondary-500/50 
            rounded-lg focus:outline-none focus:ring-[1px] focus:ring-secondary-500 
            text-primary-50 placeholder-primary-200'
            placeholder='Enter your password'
            required
          />
        </div>
      </div>

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
