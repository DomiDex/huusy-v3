import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function Footer() {
  console.log('Footer: Attempting to load logo from /logo/dark-logo.svg');

  return (
    <footer className='bg-primary-950 text-white py-12 mt-auto relative z-10'>
      <div className='w-full max-w-[1400px] mx-auto px-4 md:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Company Info */}
          <div>
            <Image
              className='mb-4'
              src='/logo/dark-logo.svg'
              alt='Logo'
              width={170}
              height={34}
              priority
              onError={(e) => {
                console.error('Footer: Error loading logo:', e);
              }}
              onLoad={() => {
                console.log('Footer: Logo loaded successfully');
              }}
            />
            <p className='text-primary-200 mb-4'>
              Your trusted partner in finding the perfect property. We make real
              estate simple and accessible.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='font-heading text-xl mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/for-rent'
                  className='text-primary-200 hover:text-secondary-500 transition-colors'
                >
                  For Rent
                </Link>
              </li>
              <li>
                <Link
                  href='/for-sale'
                  className='text-primary-200 hover:text-secondary-500 transition-colors'
                >
                  For Sale
                </Link>
              </li>
              <li>
                <Link
                  href='/properties'
                  className='text-primary-200 hover:text-secondary-500 transition-colors'
                >
                  Properties
                </Link>
              </li>
              <li>
                <Link
                  href='/agents'
                  className='text-primary-200 hover:text-secondary-500 transition-colors'
                >
                  Agents
                </Link>
              </li>
              <li>
                <Link
                  href='/pro/register   '
                  className='text-primary-200 hover:text-secondary-500 transition-colors'
                >
                  For Professionals
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='font-heading text-xl mb-4'>Contact Us</h3>
            <ul className='space-y-2'>
              <li className='flex items-center gap-2 text-primary-200'>
                <PhoneIcon className='w-5 h-5' />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className='flex items-center gap-2 text-primary-200'>
                <EnvelopeIcon className='w-5 h-5' />
                <span>info@huusy.com</span>
              </li>
              <li className='flex items-center gap-2 text-primary-200'>
                <MapPinIcon className='w-5 h-5' />
                <span>123 Real Estate St, City, State</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='border-t border-primary-800 mt-8 pt-8 text-center text-primary-200 flex justify-between items-center'>
          <p className='text-sm'>
            &copy; {new Date().getFullYear()} Huusy. All rights reserved.
          </p>
          <p className='text-sm flex gap-4'>
            <Link href='/privacy-policy'>Privacy Policy</Link>
            <Link href='/terms-of-service'>Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
