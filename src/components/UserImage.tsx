import * as React from 'react';

import clsxm from '@/lib/clsxm';

import NextImage from '@/components/NextImage';

export default function UserImage({
  image,
  className,
}: {
  image?: string | null;
  className?: string;
}) {
  return (
    <>
      {image ? (
        <NextImage
          className={clsxm(
            'overflow-hidden rounded-full border-2 border-gray-300',
            className
          )}
          src={image}
          width={250}
          height={250}
          alt='Google Icon'
        />
      ) : (
        <div
          className={clsxm(
            'h-[48px] w-[48px] overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100',
            className
          )}
        />
      )}
    </>
  );
}
