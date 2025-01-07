'use client';

import { useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AccountCustomer } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { PhotoIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface FormData {
  username: string;
  email: string;
  profile_image_url?: string;
}

type SettingsFormProps = {
  initialData: AccountCustomer;
};

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: initialData.username || '',
    email: initialData.email || '',
    profile_image_url: initialData.profile_image_url || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('account_customer')
        .update({
          username: formData.username,
          updated_at: new Date().toISOString(),
        })
        .eq('id', initialData.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create a preview URL first
      const previewUrl = URL.createObjectURL(file);

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${initialData.id}-${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-image-customer')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type, // Add content type
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage
        .from('profile-image-customer')
        .getPublicUrl(fileName);

      // Delete old image if exists
      if (formData.profile_image_url) {
        const oldFileName = formData.profile_image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('profile-image-customer')
            .remove([oldFileName]);
        }
      }

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('account_customer')
        .update({
          profile_image_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', initialData.id);

      if (updateError) throw updateError;

      // Update local state
      setFormData((prev) => ({
        ...prev,
        profile_image_url: publicUrl,
      }));

      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);

      toast.success('Profile image updated successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Rest of the component remains the same until the profile image section
  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-2xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-sm'
    >
      {/* Profile Image */}
      <div className='flex items-center gap-8'>
        <div className='relative h-24 w-24 rounded-full bg-primary-100 overflow-hidden flex-shrink-0'>
          {formData.profile_image_url ? (
            <Image
              src={formData.profile_image_url}
              alt='Profile'
              fill
              className='object-cover'
            />
          ) : (
            <div className='h-full w-full flex items-center justify-center'>
              <PhotoIcon className='h-12 w-12 text-primary-400' />
            </div>
          )}
          {isUploading && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
            </div>
          )}
        </div>
        <div className='flex flex-col space-y-3'>
          <h2 className='text-xl font-heading text-primary-950'>
            Profile Photo
          </h2>
          <input
            ref={fileInputRef}
            type='file'
            id='profile_image'
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
          />
          <label
            htmlFor='profile_image'
            className='inline-flex px-4 py-2 bg-primary-100 text-primary-600 rounded-lg 
            hover:bg-primary-200 transition-colors cursor-pointer w-fit disabled:opacity-50'
          >
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </label>
          <p className='text-sm text-primary-500'>
            Maximum file size: 5MB (JPG, PNG)
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-heading text-primary-950'>
          Basic Information
        </h2>

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='username'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Username
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              value={formData.email}
              disabled
              className='w-full px-4 py-2 border border-primary-200 rounded-lg bg-primary-50 cursor-not-allowed'
            />
            <button
              type='button'
              onClick={() => {
                toast.info('Email update feature coming soon');
              }}
              className='mt-2 text-sm text-secondary-500 hover:text-secondary-600 transition-colors'
            >
              Update Email
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={isLoading}
          className='px-6 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
