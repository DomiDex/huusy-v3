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
import { Dialog } from '@headlessui/react';

interface EditPropertyModalProps {
  property: Property & {
    property_type: { id: string; title: string };
    city: { id: string; title: string };
    sale_type: { id: string; title: string };
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function EditPropertyModal({
  property,
  isOpen,
  onClose,
}: EditPropertyModalProps) {
  const [formData, setFormData] = useState({
    property_name: property.property_name,
    excerpt: property.excerpt,
    property_details: property.property_details,
    bathrooms: property.bathrooms,
    bedrooms: property.bedrooms,
    property_size: property.property_size,
    price: property.price,
    address: property.address,
    property_type_id: property.property_type.id,
    city_id: property.city.id,
    sale_type_id: property.sale_type.id,
    meta_title: property.meta_title,
    meta_description: property.meta_description,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(property.images);
  const [cities, setCities] = useState<City[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [saleTypes, setSaleTypes] = useState<SaleType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const [citiesData, propertyTypesData, saleTypesData] = await Promise.all([
        supabase.from('cities').select('id, title').order('title'),
        supabase.from('property_types').select('id, title').order('title'),
        supabase.from('sale_types').select('id, title').order('title'),
      ]);

      if (citiesData.data) setCities(citiesData.data);
      if (propertyTypesData.data) setPropertyTypes(propertyTypesData.data);
      if (saleTypesData.data) setSaleTypes(saleTypesData.data);
    }

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update property data
      const { error: updateError } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', property.id);

      if (updateError) throw updateError;

      // Handle image uploads if any new images were selected
      if (selectedImages.length > 0) {
        const newImageUrls = await Promise.all(
          selectedImages.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${
              property.id
            }-${Date.now()}-${Math.random()}.${fileExt}`;
            const { error: uploadError, data } = await supabase.storage
              .from('property-images')
              .upload(fileName, file);

            if (uploadError) throw uploadError;
            return data.path;
          })
        );

        // Update property with new image URLs
        const { error: imageUpdateError } = await supabase
          .from('properties')
          .update({
            images: [...property.images, ...newImageUrls],
          })
          .eq('id', property.id);

        if (imageUpdateError) throw imageUpdateError;
      }

      toast.success('Property updated successfully');
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />

      <div className='fixed inset-0 overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <Dialog.Panel className='mx-auto max-w-4xl w-full bg-white rounded-2xl p-6'>
            <div className='flex justify-between items-center mb-6'>
              <Dialog.Title className='text-2xl font-heading text-primary-950'>
                Edit Property
              </Dialog.Title>
              <button
                onClick={onClose}
                className='p-2 hover:bg-primary-50 rounded-lg transition-colors'
              >
                <XMarkIcon className='w-6 h-6' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-8'>
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
                      value={formData.property_name}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
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
                      value={formData.excerpt}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label
                      htmlFor='property_details'
                      className='block text-sm font-medium text-primary-950 mb-2'
                    >
                      Full Description
                    </label>
                    <textarea
                      id='property_details'
                      name='property_details'
                      value={formData.property_details}
                      onChange={handleChange}
                      rows={4}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
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
                      value={formData.bedrooms}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
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
                      value={formData.bathrooms}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
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
                      value={formData.property_size}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                </div>
              </div>

              {/* Location and Type */}
              <div className='space-y-6'>
                <h2 className='text-2xl font-heading text-primary-950'>
                  Location and Type
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                      value={formData.price}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>

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
                      value={formData.address}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>

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
                      value={formData.city_id}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
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
                      value={formData.property_type_id}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
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
                      value={formData.sale_type_id}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
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
                      value={formData.meta_title}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
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
                      value={formData.meta_description}
                      rows={2}
                      onChange={handleChange}
                      className='w-full px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='px-4 py-2 text-sm text-primary-950 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='px-4 py-2 text-sm text-white bg-secondary-500 rounded-lg hover:bg-secondary-600 transition-colors disabled:opacity-50'
                >
                  {isSubmitting ? 'Updating...' : 'Update Property'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
