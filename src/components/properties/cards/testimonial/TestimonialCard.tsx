import Image from 'next/image';

interface TestimonialCardProps {
  testimonial: string;
  authorName: string;
  authorTitle: string;
  authorImage: string;
}

export default function TestimonialCard({
  testimonial,
  authorName,
  authorTitle,
  authorImage,
}: TestimonialCardProps) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='bg-white rounded-lg p-4'>
        <p className='text-primary-950 font-italic'>{testimonial}</p>
      </div>
      <div className='flex flex-row items-center gap-4'>
        <Image
          src={authorImage}
          alt={authorName}
          width={50}
          height={50}
          className='rounded-full'
        />
        <div className='flex flex-col gap-2'>
          <p className='text-primary-950 font-heading text-lg'>{authorName}</p>
          <p className='text-primary-600 text-sm'>{authorTitle}</p>
        </div>
      </div>
    </div>
  );
}
