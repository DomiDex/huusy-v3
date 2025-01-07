'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';
import Image from 'next/image';

const COOLDOWN_DURATION = 60000; // 1 minute cooldown

export default function RegisterForm() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime((time) => Math.max(0, time - 1000));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldownTime > 0) {
      toast.error(
        `Please wait ${Math.ceil(
          cooldownTime / 1000
        )} seconds before trying again`
      );
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      });

      // Clear form data
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // Show verification toast and reload page after a delay
      toast.success('Please check your email to verify your account');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      if (error instanceof Error && error.message.includes('rate limit')) {
        setCooldownTime(COOLDOWN_DURATION);
      }
      toast.error(
        error instanceof Error ? error.message : 'Registration failed'
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

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label
            htmlFor='username'
            className='block text-sm font-medium text-primary-50'
          >
            Username
          </label>
          <input
            type='text'
            id='username'
            name='username'
            value={formData.username}
            onChange={handleChange}
            className='mt-1 block w-full px-3 py-2 bg-primary-900/50 border 
            border-secondary-500/50 rounded-lg text-primary-50 
            placeholder:text-primary-50/50 focus:outline-none 
            focus:ring-2 focus:ring-secondary-500'
            placeholder='Enter your username'
            required
          />
        </div>

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
            placeholder='Create a password'
            required
          />
        </div>

        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-primary-50'
          >
            Confirm Password
          </label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            className='mt-1 block w-full px-3 py-2 bg-primary-900/50 border 
            border-secondary-500/50 rounded-lg text-primary-50 
            placeholder:text-primary-50/50 focus:outline-none 
            focus:ring-2 focus:ring-secondary-500'
            placeholder='Confirm your password'
            required
          />
        </div>
      </div>

      <button
        type='submit'
        disabled={isLoading}
        className='w-full py-3 px-4 bg-secondary-500 text-primary-950 font-medium
        rounded-lg hover:bg-secondary-600 transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}
