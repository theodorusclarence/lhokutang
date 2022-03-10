import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import useSWR from 'swr';

import clsxm from '@/lib/clsxm';
import { numberWithCommas } from '@/lib/helper';
import useWithToast from '@/hooks/toast/useSWRWithToast';

import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import PrimaryLink from '@/components/links/PrimaryLink';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

ListPage.auth = true;

export default function ListPage() {
  const { data: sessionData } = useSession();
  const { data: summaryData } = useWithToast(
    useSWR<{ summary: ({ amount: number } & User)[] }>('/api/trx/summary'),
    {
      loading: 'Menghitung utang-piutang anda...',
    }
  );
  const users =
    summaryData?.summary.filter((user) => user.id !== sessionData?.user?.id) ??
    [];

  const currentUser = summaryData?.summary.find(
    (user) => user.id === sessionData?.user.id
  );

  return (
    <Layout>
      <Seo templateTitle='List' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <h1>Penghuni</h1>

            {currentUser?.phoneNumber === null && (
              <div className='mt-1 text-gray-700'>
                <p>
                  Anda masih belum memasukkan nomor telepon, silakan menambahkan
                  pada <PrimaryLink href='/profile'>link ini</PrimaryLink>
                </p>
              </div>
            )}

            {users.map((user) => (
              <div key={user.id} className='mt-4 flex items-center gap-3'>
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
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
