import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import useSWR from 'swr';

import clsxm from '@/lib/clsxm';
import { numberWithCommas } from '@/lib/helper';
import useWithToast from '@/hooks/toast/useSWRWithToast';

import Layout from '@/components/layout/Layout';
import PrimaryLink from '@/components/links/PrimaryLink';
import Seo from '@/components/Seo';
import UserListItem from '@/components/UserListItem';

import { alumnusEmail } from '@/constant/email-whitelist';

ListPage.auth = true;

export default function ListPage() {
  const { data: sessionData } = useSession();
  const { data: summaryData } = useWithToast(
    useSWR<{ summary: ({ amount: number } & User)[] }>('/api/trx/summary'),
    {
      loading: 'Menghitung utang-piutang anda...',
    }
  );
  const _users =
    summaryData?.summary.filter((user) => user.id !== sessionData?.user?.id) ??
    [];

  const users = _users.filter(
    (user) => !alumnusEmail.includes(user.email ?? '')
  );
  const alumnus = _users.filter((user) =>
    alumnusEmail.includes(user.email ?? '')
  );

  const currentUser = summaryData?.summary.find(
    (user) => user.id === sessionData?.user.id
  );

  const totalDebt = users.reduce((total, u) => total + u.amount, 0);

  return (
    <Layout>
      <Seo templateTitle='List' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <div className='text-center'>
              <h1 className='h3'>Kondisi Perutangan Anda</h1>
              <p
                className={clsxm('text-lg font-medium text-green-600', {
                  'text-green-600': totalDebt > 0,
                  'text-red-600': totalDebt < 0,
                })}
              >
                {totalDebt ? (
                  <span>
                    {totalDebt > 0 ? '🤑' : '😭'}{' '}
                    {totalDebt > 0
                      ? numberWithCommas(totalDebt)
                      : numberWithCommas(-totalDebt) ?? 0}
                  </span>
                ) : (
                  '👍 0'
                )}
              </p>
            </div>
            <h2 className='h4 mt-8'>Penghuni</h2>
            {currentUser?.phoneNumber === null && (
              <div className='mt-1 text-gray-700'>
                <p>
                  Anda masih belum memasukkan nomor telepon, silakan menambahkan
                  pada <PrimaryLink href='/profile'>link ini</PrimaryLink>
                </p>
              </div>
            )}
            {users.map((user) => (
              <UserListItem className='mt-4' key={user.id} user={user} />
            ))}

            <h2 className='h4 mt-8'>Alumni</h2>
            {alumnus.map((user) => (
              <UserListItem className='mt-4' key={user.id} user={user} />
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
