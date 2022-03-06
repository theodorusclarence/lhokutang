import * as React from 'react';

import NextImage from '@/components/NextImage';

export default function UserImage({
  image,
  size,
}: {
  image?: string | null;
  size: string;
}) {
  return (
    <>
      {image ? (
        <NextImage
          className='overflow-hidden rounded-full border-2 border-gray-300'
          style={{ width: size, height: size }}
          src={image}
          width={250}
          height={250}
          alt='Google Icon'
        />
      ) : (
        <div
          style={{ width: size, height: size }}
          className='h-[48px] w-[48px] overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100'
        />
      )}
    </>
  );
}
