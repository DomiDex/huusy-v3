'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className='min-h-screen flex items-center justify-center bg-primary-50'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-primary-950 mb-4'>
              Something went wrong!
            </h2>
            <button
              onClick={() => reset()}
              className='bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700'
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
