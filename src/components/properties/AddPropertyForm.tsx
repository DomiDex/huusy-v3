'use client';

import { useState, useEffect } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';
import type {
  City,
  PropertyType,
  SaleType,
  Property,
} from '@/lib/supabase/types';
import { toast } from 'sonner';

interface FormData {
  property_name: string;
  excerpt: string;
  property_details: string;
  bathrooms: number;
  bedrooms: number;
  property_size: number;
  price: number;
  address: string;
  property_type_id: string;
  city_id: string;
  sale_type_id: string;
  meta_title: string;
  meta_description: string;
}

const initialFormData: FormData = {
  property_name: '',
  excerpt: '',
  property_details: '',
  bathrooms: 0,
  bedrooms: 0,
  property_size: 0,
  price: 0,
  address: '',
  property_type_id: '',
  city_id: '',
  sale_type_id: '',
  meta_title: '',
  meta_description: '',
};

export default function AddPropertyForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [saleTypes, setSaleTypes] = useState<SaleType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      // Fetch cities
      const { data: citiesData, error: citiesError } = await supabase
        .from('cities')
        .select('id, title')
        .order('title', { ascending: true });

      if (!citiesError && citiesData) {
        setCities(citiesData);
      }

      // Fetch property types
      const { data: propertyTypesData, error: propertyTypesError } =
        await supabase
          .from('property_types')
          .select('id, title')
          .order('title', { ascending: true });

      if (!propertyTypesError && propertyTypesData) {
        setPropertyTypes(propertyTypesData);
      }

      // Fetch sale types
      const { data: saleTypesData, error: saleTypesError } = await supabase
        .from('sale_types')
        .select('id, title')
        .order('title', { ascending: true });

      if (!saleTypesError && saleTypesData) {
        setSaleTypes(saleTypesData);
      }
    }

    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);

      // Create preview URLs for the new images
      const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Upload images to storage
      const uploadedImageUrls = await Promise.all(
        selectedImages.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from('property-images').getPublicUrl(fileName);

          return publicUrl;
        })
      );

      // 2. Create property record
      const { error: insertError } = await supabase.from('properties').insert({
        ...formData,
        images: uploadedImageUrls,
        agent_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (insertError) throw insertError;

      toast.success('Property added successfully');
      // Clear form
      setFormData(initialFormData);
      setSelectedImages([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Failed to add property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-4xl mx-auto space-y-8 bg-white p-8 rounded-lg shadow-sm'
    >
      {/* Basic Information */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-heading text-primary-950'>
          Basic Information
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label
              htmlFor='property_name'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Property Name
            </label>
            <input
              type='text'
              id='property_name'
              name='property_name'
              className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              placeholder='Enter property name'
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor='price'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Price
            </label>
            <input
              type='number'
              id='price'
              name='price'
              className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              placeholder='Enter price'
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='excerpt'
            className='block text-sm font-medium text-primary-950 mb-2'
          >
            Short Description
          </label>
          <input
            type='text'
            id='excerpt'
            name='excerpt'
            className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            placeholder='Brief description of the property'
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor='property_details'
            className='block text-sm font-medium text-primary-950 mb-2'
          >
            Detailed Description
          </label>
          <textarea
            id='property_details'
            name='property_details'
            rows={4}
            className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
            placeholder='Detailed description of the property'
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Property Details */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-heading text-primary-950'>
          Property Details
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <label
              htmlFor='bedrooms'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Bedrooms
            </label>
            <input
              type='number'
              id='bedrooms'
              name='bedrooms'
              className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              placeholder='Number of bedrooms'
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor='bathrooms'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Bathrooms
            </label>
            <input
              type='number'
              id='bathrooms'
              name='bathrooms'
              step='0.5'
              className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              placeholder='Number of bathrooms'
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor='property_size'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Property Size (sqm)
            </label>
            <input
              type='number'
              id='property_size'
              name='property_size'
              className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              placeholder='Size in square meters'
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-heading text-primary-950'>Location</h2>

        <div className='grid grid-cols-1 gap-6'>
          <div>
            <label
              htmlFor='address'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Address
            </label>
            <input
              type='text'
              id='address'
              name='address'
              className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              placeholder='Full property address'
              onChange={handleChange}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div>
              <label
                htmlFor='city'
                className='block text-sm font-medium text-primary-950 mb-2'
              >
                City
              </label>
              <select
                id='city'
                name='city_id'
                className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                onChange={handleChange}
              >
                <option value=''>Select a city</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor='property_type'
                className='block text-sm font-medium text-primary-950 mb-2'
              >
                Property Type
              </label>
              <select
                id='property_type'
                name='property_type_id'
                className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                onChange={handleChange}
              >
                <option value=''>Select property type</option>
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor='sale_type'
                className='block text-sm font-medium text-primary-950 mb-2'
              >
                Sale Type
              </label>
              <select
                id='sale_type'
                name='sale_type_id'
                className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                onChange={handleChange}
              >
                <option value=''>Select sale type</option>
                {saleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-heading text-primary-950'>
          Property Images
        </h2>

        <div className='border-2 border-dashed border-primary-200 rounded-lg p-6'>
          <div className='flex flex-col items-center'>
            <PhotoIcon className='h-12 w-12 text-primary-400' />
            <p className='mt-2 text-sm text-primary-600'>
              Drag and drop images here, or click to select files
            </p>
            <input
              type='file'
              multiple
              accept='image/*'
              onChange={handleImageChange}
              className='hidden'
              id='images'
            />
            <label
              htmlFor='images'
              className='mt-4 px-4 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors cursor-pointer'
            >
              Select Images
            </label>
          </div>

          {previewUrls.length > 0 && (
            <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-4'>
              {previewUrls.map((url, index) => (
                <div key={url} className='relative group'>
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className='w-full h-32 object-cover rounded-lg'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(index)}
                    className='absolute top-2 right-2 p-1 bg-primary-950/50 rounded-full text-primary-50 opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <XMarkIcon className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO */}
      <div className='space-y-6'>
        <h2 className='text-2xl font-heading text-primary-950'>
          SEO Information
        </h2>

        <div className='space-y-4'>
          <div>
            <label
              htmlFor='meta_title'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Meta Title
            </label>
            <input
              type='text'
              id='meta_title'
              name='meta_title'
              className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              placeholder='SEO title'
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor='meta_description'
              className='block text-sm font-medium text-primary-950 mb-2'
            >
              Meta Description
            </label>
            <textarea
              id='meta_description'
              name='meta_description'
              rows={2}
              className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              placeholder='SEO description'
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='px-6 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Adding Property...' : 'Add Property'}
        </button>
      </div>
    </form>
  );
}
