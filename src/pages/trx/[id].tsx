import { User } from '@prisma/client';
import clsx from 'clsx';
import format from 'date-fns/format';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { HiPhone } from 'react-icons/hi';
import useSWR from 'swr';

import { DATE_FORMAT } from '@/lib/date';
import { numberWithCommas } from '@/lib/helper';
import useWithToast from '@/hooks/toast/useSWRWithToast';

import Layout from '@/components/layout/Layout';
import PrimaryLink from '@/components/links/PrimaryLink';
import Seo from '@/components/Seo';
import UserImage from '@/components/UserImage';

import { GetTransactionsApi } from '@/pages/api/trx/[id]';

UserTransactionPage.auth = true;

export default function UserTransactionPage() {
  //#region  //*=========== Get Route Param ===========
  const router = useRouter();
  const userId = router.query.id;
  //#endregion  //*======== Get Route Param ===========

  const { data: session } = useSession();

  const { data: destinationUser } = useSWR<User>(
    userId ? `/api/user/${userId}` : undefined
  );

  const { data: transactionData } = useWithToast(
    useSWR<GetTransactionsApi>(
      session?.user.id && destinationUser?.id
        ? `/api/trx/${session?.user.id}?destinationUserId=${destinationUser?.id}`
        : undefined
    )
  );
  const transactions = transactionData?.transactions ?? [];

  const _total = transactionData?.total ?? 0;
  const total = {
    amount: _total ?? 0,
    status: _total === 0 ? 'aman' : _total > 0 ? 'bayar' : 'minta',
  };

  return (
    <Layout>
      <Seo templateTitle='UserTransaction' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <p>Transaksi dengan: </p>
            <header className='mt-2 flex items-center gap-3'>
              <UserImage size='48px' image={destinationUser?.image} />
              <div>
                <h2 className='h4'>{destinationUser?.name ?? 'Loading...'}</h2>
                <p className='flex items-center gap-1 text-gray-700'>
                  <HiPhone />
                  {destinationUser?.phoneNumber ?? '-'}
                </p>
              </div>
            </header>

            <h1 className='h3 mt-8 flex items-center gap-2 text-gray-800'>
              <span>
                {total.status === 'aman'
                  ? 'Kamu tidak punya utang / piutang 👍'
                  : total.status === 'bayar'
                  ? `Kamu harus membayar Rp ${numberWithCommas(total.amount)} 🥲`
                  : `Kamu bisa minta Rp ${numberWithCommas(
                      total.amount * -1
                    )} 🤑`}
              </span>
            </h1>
            {total.status === 'bayar' && (
              <PrimaryLink
                className='mt-2'
                href={`/debt/bayar/${destinationUser?.id}`}
              >
                Bayar Sekarang
              </PrimaryLink>
            )}

            <ul className='mt-6 space-y-3'>
              {transactions.map(
                ({ id, description, type, amount, date, user }) => (
                  <li key={id} className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <UserImage
                        size='35px'
                        image={
                          type === 'utang' ||
                          (type === 'payment' &&
                            user.id === destinationUser?.id)
                            ? destinationUser?.image
                            : session?.user.image
                        }
                      />
                      <div>
                        <h3 className='h4 font-medium'>{description}</h3>
                        <p className='text-sm text-gray-600'>
                          {format(
                            new Date(date),
                            DATE_FORMAT.FULL_DATE_HOUR_MINUTE
                          )}
                        </p>
                      </div>
                    </div>
                    <p
                      className={clsx(
                        'text-right',
                        type === 'utang'
                          ? 'text-red-500'
                          : type === 'payment'
                          ? 'text-yellow-600'
                          : 'text-green-500'
                      )}
                    >
                      {numberWithCommas(amount)}
                    </p>
                  </li>
                )
              )}
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}
