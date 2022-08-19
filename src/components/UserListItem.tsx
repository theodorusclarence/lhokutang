import { User } from '@prisma/client';
import * as React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';

import clsxm from '@/lib/clsxm';
import { numberWithCommas } from '@/lib/helper';

import ButtonLink from '@/components/links/ButtonLink';
import NextImage from '@/components/NextImage';

type UserListItemProps = {
  user: { amount: number } & User;
} & React.ComponentPropsWithoutRef<'div'>;

export default function UserListItem({
  className,
  user,
  ...rest
}: UserListItemProps) {
  return (
    <div {...rest}>
      <div className={clsxm('flex items-center gap-3', className)}>
        {user.image ? (
          <NextImage
            className='h-[48px] w-[48px] overflow-hidden rounded-full border-2 border-gray-300'
            src={user.image}
            width={250}
            height={250}
            alt='Google Icon'
          />
        ) : (
          <div className='h-[48px] w-[48px] overflow-hidden rounded-full border-2 border-gray-300 bg-gray-100' />
        )}
        <div>
          <h2 className='h4'>{user.name}</h2>
          <p className='flex items-center gap-1 text-sm text-gray-700'>
            {user.amount ? (
              <span
                className={clsxm('font-medium text-green-600', {
                  'text-green-600': user.amount > 0,
                  'text-red-600': user.amount < 0,
                })}
              >
                {user.amount > 0 ? '🤑' : '😭'}{' '}
                {user.amount > 0
                  ? numberWithCommas(user.amount)
                  : numberWithCommas(-user.amount) ?? 0}
              </span>
            ) : (
              '👍 Lunas'
            )}
          </p>
        </div>
        <ButtonLink
          href={`/trx/${user.id}`}
          variant='outline'
          className='ml-auto h-10 w-10  justify-center p-0 text-right'
        >
          <FaMoneyBillWave />
        </ButtonLink>
      </div>
    </div>
  );
}
