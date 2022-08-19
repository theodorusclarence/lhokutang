import { User } from '@prisma/client';
import clsx from 'clsx';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import toast from 'react-hot-toast';
import { HiOutlineTrash, HiPhone } from 'react-icons/hi';
import useSWR from 'swr';

import axiosClient from '@/lib/axios';
import { DATE_FORMAT } from '@/lib/date';
import { numberWithCommas } from '@/lib/helper';
import useWithToast from '@/hooks/toast/useSWRWithToast';
import useDialog from '@/hooks/useDialog';

import TextButton from '@/components/buttons/TextButton';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import PrimaryLink from '@/components/links/PrimaryLink';
import Seo from '@/components/Seo';
import UserImage from '@/components/UserImage';

import { DEFAULT_TOAST_MESSAGE } from '@/constant/toast';
import { GetTransactionsApi } from '@/pages/api/trx/[id]';

UserTransactionPage.auth = true;

export default function UserTransactionPage() {
  //#region  //*=========== Get Route Param ===========
  const router = useRouter();
  const userId = router.query.id;
  //#endregion  //*======== Get Route Param ===========
  const dialog = useDialog();
  const { data: session } = useSession();

  const { data: destinationUser } = useSWR<User>(
    userId ? `/api/user/${userId}` : undefined
  );

  const { data: transactionData, mutate } = useWithToast(
    useSWR<GetTransactionsApi>(
      session?.user.id && destinationUser?.id
        ? `/api/trx/${session?.user.id}?destinationUserId=${destinationUser?.id}`
        : undefined
    )
  );
  const transactions = transactionData?.transactions ?? [];

  const collapseIndex = transactionData?.collapseIndex ?? null;
  const _total = transactionData?.total ?? 0;
  const total = {
    amount: _total ?? 0,
    status: _total === 0 ? 'aman' : _total > 0 ? 'bayar' : 'minta',
  };

  //#region  //*=========== Remove Item ===========
  const deleteTransaction = async (id: string) => {
    dialog({
      title: 'Hapus transaksi',
      description: 'Apakah anda yakin? Transaksi tidak dapat dikembalikan',
      submitText: 'Hapus',
      variant: 'danger',
    }).then(() => {
      toast
        .promise(axiosClient.delete(`/api/delete-trx/${id}`), {
          ...DEFAULT_TOAST_MESSAGE,
          loading: 'Menghapus transaksi...',
          success: 'Transaksi berhasil dihapus',
        })
        .then(() => {
          toast.dismiss();
          mutate();
        });
    });
  };
  //#endregion  //*======== Remove Item ===========

  return (
    <Layout>
      <Seo templateTitle='UserTransaction' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <p>Transaksi dengan: </p>
            <header className='mt-2 flex items-center gap-3'>
              <UserImage className='h-12 w-12' image={destinationUser?.image} />
              <div>
                <h2 className='h4'>{destinationUser?.name ?? 'Loading...'}</h2>
                <p className='flex items-center gap-1 text-gray-700'>
                  <HiPhone />
                  {destinationUser?.phoneNumber ?? '-'}
                </p>
              </div>
            </header>
            <ArrowLink
              className='mt-2'
              as={PrimaryLink}
              href={`/debt/request?to=${userId}`}
            >
              💸 Request Uang
            </ArrowLink>

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
            <div className='mt-2 space-x-4'>
              {total.status === 'bayar' && (
                <ArrowLink
                  as={PrimaryLink}
                  href={`/debt/bayar/${destinationUser?.id}`}
                >
                  💵 Bayar Sekarang
                </ArrowLink>
              )}
            </div>

            <ul className='mt-6 space-y-3'>
              {transactions.map(
                ({ id, description, type, amount, date, user }, i) => (
                  <React.Fragment key={id}>
                    {i === collapseIndex && (
                      <div className='flex items-center gap-2 text-orange-400'>
                        <div className='h-0.5 flex-grow bg-orange-300' />
                        <span className='text-xs font-medium'>LUNAS</span>
                        <div className='h-0.5 flex-grow bg-orange-300' />
                      </div>
                    )}
                    <li className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <UserImage
                          className='h-[35px] w-[35px]'
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
                      <div>
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
                        {/* check if the date is still current date */}
                        {isToday(new Date(date)) && (
                          <TextButton
                            onClick={() => deleteTransaction(id)}
                            className='text-sm text-red-500 hover:text-red-600 focus-visible:text-red-600'
                          >
                            <HiOutlineTrash className='mr-1' />
                            Hapus Transaksi
                          </TextButton>
                        )}
                      </div>
                    </li>
                  </React.Fragment>
                )
              )}
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}
