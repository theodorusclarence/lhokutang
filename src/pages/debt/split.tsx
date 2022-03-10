import { useRouter } from 'next/router';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import axiosClient from '@/lib/axios';
import { cleanNumber, numberWithCommas } from '@/lib/helper';
import useLoadingToast from '@/hooks/toast/useLoadingToast';
import useWithToast from '@/hooks/toast/useSWRWithToast';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import UserCheckboxes from '@/components/forms/UserCheckboxes';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { UserSelectPeople } from '@/components/UserSelect';

import { descriptions } from '@/constant/descriptionList';
import { DEFAULT_TOAST_MESSAGE } from '@/constant/toast';
import { CreateManyBody } from '@/pages/api/trx/create-many';

type RequestData = {
  destinationUserId: Record<string, boolean>;
  amount: string;
  description: string;
};

DebtSplit.auth = true;

export default function DebtSplit() {
  const { status, data: sessionData } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.replace('/');
  }

  const isLoading = useLoadingToast();

  //#region  //*=========== Form ===========
  const methods = useForm<RequestData>({
    mode: 'onTouched',
  });
  const { handleSubmit, watch, setValue } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== User Select ============
  const { data: userData } = useWithToast(
    useSWR<{ users: User[] }>('/api/user'),
    {
      loading: 'getting user data',
    }
  );
  const users: UserSelectPeople[] = userData?.users
    ? userData.users
        .map((user) => ({
          id: user.id,
          name: user.name ? user.name : (user.email as string),
          image: user.image,
        }))
        .filter((user) => user.id !== sessionData?.user?.id)
    : [];
  //#endregion  //*======== User Select ===========

  //#region  //*=========== Split Bill Logic ===========
  const { destinationUserId: destinationUserIdObject } = watch();
  const totalPerson = destinationUserIdObject
    ? Object.values(destinationUserIdObject).filter((bool) => bool).length
    : 0;

  const amount = cleanNumber(watch('amount'));

  const amountPerPerson = Math.floor(amount / (totalPerson + 1));
  //#endregion  //*======== Split Bill Logic ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<RequestData> = (data) => {
    // If no one checked
    if (totalPerson === 0) {
      return toast.error('Silakan pilih minimal 1 orang');
    }

    const parsedData: CreateManyBody = {
      amountPerPerson,
      destinationUserIdList: Object.entries(destinationUserIdObject)
        .filter(([, bool]) => bool)
        .map(([user]) => user),
      description: data.description,
      date: new Date(),
    };
    toast
      .promise(axiosClient.post('/api/trx/create-many', parsedData), {
        ...DEFAULT_TOAST_MESSAGE,
        loading: 'Mengirim request uang...',
        success: 'Request uang berhasil dikirim',
      })
      .then(() => {
        router.push(`/trx/${parsedData.destinationUserIdList[0]}`);
      });
  };
  //#endregion  //*======== Form Submit ===========

  return (
    <Layout>
      <Seo templateTitle='Add Debt' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <h1>Split Bill</h1>
            <p className='mt-1 text-gray-700'>Bagi" pesanan dengan mudah</p>

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='mt-4 max-w-sm space-y-3'
              >
                <Input
                  id='amount'
                  label='Nominal'
                  pattern='[,0-9]*'
                  inputMode='decimal'
                  onChange={(e) => {
                    setValue(
                      'amount',
                      cleanNumber(e.target.value).toLocaleString()
                    );
                  }}
                  validation={{
                    required: 'Nominal harus diisi',
                  }}
                  helperText='Total akan dibagi dengan jumlah orang dan kamu'
                />
                <UserCheckboxes users={users} id='destinationUserId' />
                <Input
                  id='description'
                  label='Keterangan'
                  placeholder='Utang apa?'
                  validation={{ required: 'Keterangan harus diisi' }}
                  list='description-list'
                />
                <datalist id='description-list'>
                  {descriptions?.map((description) => (
                    <option value={description} key={description} />
                  ))}
                </datalist>

                <div className='!mt-8'>
                  <h3>Rincian</h3>
                  <p>Pembagian: Kamu + {totalPerson} orang</p>
                  <p>
                    Per orangnya jadi{' '}
                    <strong>
                      Rp{' '}
                      {!isNaN(amountPerPerson)
                        ? numberWithCommas(amountPerPerson)
                        : 0}
                    </strong>
                  </p>
                </div>

                <div className='flex flex-wrap gap-4'>
                  <Button isLoading={isLoading} type='submit'>
                    Submit
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </section>
      </main>
    </Layout>
  );
}
