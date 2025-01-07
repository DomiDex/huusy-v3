export default function MainCardSkeleton() {
  return (
    <div className='block bg-white rounded-lg shadow-sm'>
      <div className='flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden'>
        <div className='flex flex-col md:flex-row p-3'>
          {/* Image Section Skeleton */}
          <div className='relative w-full md:w-[400px] h-[300px]'>
            <div className='w-full h-full bg-primary-100 animate-pulse rounded-lg' />
            {/* Sale Type Badge Skeleton */}
            <div className='absolute top-4 left-4 z-10'>
              <div className='w-20 h-7 bg-primary-200 animate-pulse rounded-md' />
            </div>
          </div>

          {/* Content Section Skeleton */}
          <div className='flex-1 p-6 flex flex-col'>
            {/* Header with Price Skeleton */}
            <div className='flex items-start justify-between mb-4'>
              <div className='space-y-2'>
                {/* Property Type Skeleton */}
                <div className='w-24 h-4 bg-primary-100 animate-pulse rounded' />
                {/* Title Skeleton */}
                <div className='w-64 h-8 bg-primary-100 animate-pulse rounded' />
                {/* Location Skeleton */}
                <div className='w-32 h-4 bg-primary-100 animate-pulse rounded' />
              </div>
              {/* Price Skeleton */}
              <div className='w-28 h-8 bg-primary-100 animate-pulse rounded-lg' />
            </div>

            {/* Description Skeleton */}
            <div className='space-y-2 mb-6'>
              <div className='w-full h-4 bg-primary-100 animate-pulse rounded' />
              <div className='w-3/4 h-4 bg-primary-100 animate-pulse rounded' />
            </div>

            {/* Property Details Skeleton */}
            <div className='flex items-center gap-4'>
              {/* Bedrooms */}
              <div className='w-16 h-6 bg-primary-100 animate-pulse rounded' />
              {/* Bathrooms */}
              <div className='w-16 h-6 bg-primary-100 animate-pulse rounded' />
              {/* Size */}
              <div className='w-20 h-6 bg-primary-100 animate-pulse rounded' />
            </div>
          </div>
        </div>
      </div>

      {/* Agent Info Section Skeleton */}
      <div className='flex items-center justify-between p-4 border-t border-primary-100 bg-primary-50/50'>
        <div className='flex items-center gap-3'>
          {/* Agent Avatar Skeleton */}
          <div className='w-12 h-12 bg-primary-100 animate-pulse rounded-full' />
          <div className='space-y-2'>
            {/* Agent Name Skeleton */}
            <div className='w-32 h-4 bg-primary-100 animate-pulse rounded' />
            {/* Agency Name Skeleton */}
            <div className='w-24 h-4 bg-primary-100 animate-pulse rounded' />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-primary-100 animate-pulse rounded-lg' />
          <div className='w-10 h-10 bg-primary-100 animate-pulse rounded-lg' />
        </div>
      </div>
    </div>
  );
}
