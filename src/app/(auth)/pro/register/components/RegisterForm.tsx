'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
    phone: '',
  });
  const router = useRouter();

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
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        agencyName: formData.agencyName,
        phone: formData.phone,
      });

      // Clear form data
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        agencyName: '',
        phone: '',
      });

      // Show verification toast and redirect to login after a delay
      toast.success('Please check your email to verify your account');
      setTimeout(() => {
        router.push('/pro/login');
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Registration failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='w-full max-w-2xl space-y-6 mt-8'>
      <div className='grid grid-cols-2 gap-4'>
        {/* First Row */}
        <div>
          <label
            htmlFor='fullName'
            className='block text-primary-50 text-sm font-main mb-2'
          >
            Full Name
          </label>
          <input
            id='fullName'
            name='fullName'
            type='text'
            value={formData.fullName}
            onChange={handleChange}
            className='w-full px-4 py-2 bg-primary-950/60 border border-secondary-500/50 
            rounded-lg focus:outline-none focus:ring-[1px] focus:ring-secondary-500 
            text-primary-50 placeholder-primary-200'
            placeholder='John Doe'
            required
          />
        </div>

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
            placeholder='john@doe.com'
            required
          />
        </div>

        {/* Second Row */}
        <div>
          <label
            htmlFor='agencyName'
            className='block text-primary-50 text-sm font-main mb-2'
          >
            Agency Name
          </label>
          <input
            id='agencyName'
            name='agencyName'
            type='text'
            value={formData.agencyName}
            onChange={handleChange}
            className='w-full px-4 py-2 bg-primary-950/60 border border-secondary-500/50 
            rounded-lg focus:outline-none focus:ring-[1px] focus:ring-secondary-500 
            text-primary-50 placeholder-primary-200'
            placeholder='Enter your agency name'
            required
          />
        </div>

        <div>
          <label
            htmlFor='phone'
            className='block text-primary-50 text-sm font-main mb-2'
          >
            Phone Number
          </label>
          <input
            id='phone'
            name='phone'
            type='tel'
            value={formData.phone}
            onChange={handleChange}
            className='w-full px-4 py-2 bg-primary-950/60 border border-secondary-500/50 
            rounded-lg focus:outline-none focus:ring-[1px] focus:ring-secondary-500 
            text-primary-50 placeholder-primary-200'
            placeholder='+66 812345678'
            required
          />
        </div>

        {/* Password Row */}
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

        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-primary-50 text-sm font-main mb-2'
          >
            Confirm Password
          </label>
          <input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            value={formData.confirmPassword}
            onChange={handleChange}
            className='w-full px-4 py-2 bg-primary-950/60 border border-secondary-500/50 
            rounded-lg focus:outline-none focus:ring-[1px] focus:ring-secondary-500 
            text-primary-50 placeholder-primary-200'
            placeholder='Confirm your password'
            required
          />
        </div>
      </div>

      <div className='flex items-center justify-between text-sm'>
        <Link
          href='/pro/login'
          className='text-secondary-400 hover:text-secondary-300 font-main'
        >
          Already have an account?
        </Link>
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
