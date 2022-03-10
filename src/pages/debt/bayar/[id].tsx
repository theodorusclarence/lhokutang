import { useRouter } from 'next/router';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import axiosClient from '@/lib/axios';
import { numberWithCommas } from '@/lib/helper';
import useWithToast from '@/hooks/toast/useSWRWithToast';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import UserImage from '@/components/UserImage';

import { DEFAULT_TOAST_MESSAGE } from '@/constant/toast';
import { GetTransactionsApi } from '@/pages/api/trx/[id]';

type BayarData = {
  amount: number;
};

BayarPage.auth = true;

export default function BayarPage() {
  //#region  //*=========== Get Route Param ===========
  const router = useRouter();
  const userId = router.query.id;
  //#endregion  //*======== Get Route Param ===========

  const { data: session } = useSession();

  const { data: destinationUser } = useSWR<User>(`/api/user/${userId}`);

  const { data: transactionData } = useWithToast(
    useSWR<GetTransactionsApi>(
      `/api/trx/${session?.user.id}?destinationUserId=${destinationUser?.id}`
    )
  );

  const _total = transactionData?.total ?? 0;
  const total = {
    amount: _total ?? 0,
    status: _total === 0 ? 'aman' : _total > 0 ? 'bayar' : 'minta',
  };

  //#region  //*=========== Form ===========
  const methods = useForm<BayarData>({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<BayarData> = (data) => {
    const postData = {
      amount: data.amount,
      destinationUserId: destinationUser?.id,
      description: 'Pelunasan',
      date: new Date().toISOString(),
    };
    toast
      .promise(axiosClient.post('/api/trx/create', postData), {
        ...DEFAULT_TOAST_MESSAGE,
        loading: 'Mengirim pembayaran...',
        success: 'Pembayaran berhasil dicatat',
      })
      .then(() => {
        router.push(`/trx/${destinationUser?.id}`);
      });
  };
  //#endregion  //*======== Form Submit ===========

  return (
    <Layout>
      <Seo templateTitle='Bayar' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <p>Transaksi dengan: </p>
            <header className='mt-2 flex items-center gap-3'>
              <UserImage size='48px' image={destinationUser?.image} />
              <div>
                <h2 className='h4'>{destinationUser?.name ?? 'Loading...'}</h2>
                <p>{destinationUser?.email ?? ''}</p>
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

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='mt-4 max-w-sm space-y-3'
              >
                <Input
                  id='amount'
                  label='Bayar berapa?'
                  pattern='[0-9]*'
                  defaultValue={total.amount}
                  validation={{
                    required: 'Nominal harus diisi',
                    min: {
                      value: 0,
                      message: 'Nominal tidak boleh negatif',
                    },
                    max: {
                      value: total.amount,
                      message: 'Nominal tidak boleh melebihi utang',
                    },
                    valueAsNumber: true,
                  }}
                />
                <div className='flex flex-wrap gap-4'>
                  <Button type='submit'>Submit</Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </section>
      </main>
    </Layout>
  );
}
