import { useRouter } from 'next/router';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import axiosClient from '@/lib/axios';
import { cleanNumber, numberWithCommas } from '@/lib/helper';
import logger from '@/lib/logger';
import { trackEvent } from '@/lib/umami';
import useLoadingToast from '@/hooks/toast/useLoadingToast';
import useWithToast from '@/hooks/toast/useSWRWithToast';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import UserCheckboxes from '@/components/forms/UserCheckboxes';
import Layout from '@/components/layout/Layout';
import PrimaryLink from '@/components/links/PrimaryLink';
import Seo from '@/components/Seo';
import UserImage from '@/components/UserImage';
import { UserSelectPeople } from '@/components/UserSelect';

import { FOOD_LISTS } from '@/constant/food-lists';
import { DEFAULT_TOAST_MESSAGE } from '@/constant/toast';
import { CreateManyByIDBody } from '@/pages/api/trx/create-many-by-id';

type RequestData = {
  destinationUserId: Record<string, boolean>;
  amount: Array<string>;
  ownAmount: string;
  description: string;
  discount: string;
  others: string;
};

SplitDiscount.auth = true;

export default function SplitDiscount() {
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
  const { handleSubmit, watch, setValue, resetField } = methods;
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
          email: user.email,
        }))
        .filter((user) => user.id !== sessionData?.user?.id)
    : [];
  //#endregion  //*======== User Select ===========

  //#region  //*=========== Split Bill Logic ===========
  const { destinationUserId: destinationUserIdObject } = watch();
  const totalPerson = destinationUserIdObject
    ? Object.values(destinationUserIdObject).filter((bool) => bool).length
    : 0;
  const selectedUserIds =
    destinationUserIdObject &&
    Object.entries(destinationUserIdObject)
      .filter(([, bool]) => bool)
      .map(([user]) => user);

  React.useEffect(() => {
    resetField(`amount`);
    [...Array(totalPerson)].forEach((_, i) => {
      resetField(`amount.${i}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selectedUserIds)]);

  const amounts = watch('amount');
  const ownAmount = watch('ownAmount');
  const discount = watch('discount');
  const others = watch('others');
  const disc = calculateDiscount({ ownAmount, amounts, discount, others });
  logger({ disc }, 'split-discount.tsx line 110');
  //#endregion  //*======== Split Bill Logic ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<RequestData> = (data) => {
    // If no one checked
    if (totalPerson === 0) {
      return toast.error('Silakan pilih minimal 1 orang');
    }

    logger({ data }, 'split-discount.tsx line 82');
    const transactionData = selectedUserIds.map((id, index) => ({
      id,
      amount: disc.discountAmount[index],
    }));
    const parsedData: CreateManyByIDBody = {
      transactionData,
      date: new Date(),
      description: data.description,
    };
    toast
      .promise(axiosClient.post('/api/trx/create-many-by-id', parsedData), {
        ...DEFAULT_TOAST_MESSAGE,
        loading: 'Mengirim request uang...',
        success: 'Request uang berhasil dikirim',
      })
      .then(() => {
        trackEvent('Split Bill', {
          type: 'click',
          user: sessionData?.user.name ?? '',
          to: selectedUserIds
            .map(
              (id) => userData?.users.find((user) => user.id === id)?.name ?? ''
            )
            .join(', '),
        });
        router.replace(`/trx/${parsedData.transactionData[0].id}`);
      });
  };
  //#endregion  //*======== Form Submit ===========

  return (
    <Layout>
      <Seo templateTitle='Add Debt' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <h1>Complex Split Bill</h1>
            <p className='mt-1 text-gray-700'>
              Bagi" diskon dengan mudah dijamin ampuh
            </p>
            <p className='mt-1 text-sm text-gray-700'>
              Bingung cara pakai?{' '}
              <PrimaryLink href='/images/split-discount.png' openNewTab>
                Lihat contoh
              </PrimaryLink>
            </p>

            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className='mt-4 max-w-sm'>
                <UserCheckboxes users={users} id='destinationUserId' />

                <h3 className='mt-8'>Detail Transaksi per Penghuni</h3>

                <div className='space-y-3 py-2'>
                  <header className='mt-2 flex items-center gap-3'>
                    <UserImage
                      className='h-6 w-6'
                      image={sessionData?.user?.image}
                    />
                    <div>
                      <p className='text-sm'>
                        {sessionData?.user?.name ?? 'Loading...'}
                      </p>
                    </div>
                  </header>

                  <Input
                    id='ownAmount'
                    label='Total'
                    pattern='[,0-9]*'
                    inputMode='decimal'
                    onChange={(e) => {
                      setValue(
                        'ownAmount',
                        cleanNumber(e.target.value).toLocaleString()
                      );
                    }}
                    validation={{
                      required: 'Total harus diisi',
                    }}
                    helperText='Harga sebelum diskon dan ongkir'
                  />
                </div>

                {selectedUserIds?.length > 0 &&
                  selectedUserIds.map((id, index) => {
                    const user = users.find((user) => user.id === id);
                    return (
                      <div key={id} className='space-y-3 border-t py-2'>
                        <header className='mt-2 flex items-center gap-3'>
                          <UserImage className='h-6 w-6' image={user?.image} />
                          <div>
                            <p className='text-sm'>
                              {user?.name ?? 'Loading...'}
                            </p>
                          </div>
                        </header>

                        <Input
                          id={`amount.${index}`}
                          label='Total'
                          pattern='[,0-9]*'
                          inputMode='decimal'
                          defaultValue={0}
                          onChange={(e) => {
                            setValue(
                              `amount.${index}`,
                              cleanNumber(e.target.value).toLocaleString()
                            );
                          }}
                          validation={{
                            required: 'Total harus diisi',
                          }}
                          helperText='Harga sebelum diskon dan ongkir'
                        />
                      </div>
                    );
                  })}

                <datalist id='description-list'>
                  {FOOD_LISTS?.map((description) => (
                    <option value={description} key={description} />
                  ))}
                </datalist>
                <hr />
                <div className='mt-3 space-y-3'>
                  <Input
                    id='discount'
                    label='Total Diskon Makanan'
                    pattern='[,0-9]*'
                    inputMode='decimal'
                    onChange={(e) => {
                      setValue(
                        'discount',
                        cleanNumber(e.target.value).toLocaleString()
                      );
                    }}
                    validation={{
                      required: 'Total Diskon Makanan harus diisi',
                    }}
                  />
                  <Input
                    id='others'
                    label='Total Ongkir & Biaya Lain'
                    pattern='[,0-9]*'
                    inputMode='decimal'
                    onChange={(e) => {
                      setValue(
                        'others',
                        cleanNumber(e.target.value).toLocaleString()
                      );
                    }}
                    validation={{
                      required: 'Total Ongkir harus diisi',
                    }}
                  />
                  <Input
                    id='description'
                    label='Keterangan'
                    placeholder='Utang apa?'
                    validation={{ required: 'Keterangan harus diisi' }}
                    list='description-list'
                  />
                </div>

                <div className='!mt-8'>
                  <h3>Rincian</h3>
                  <p>Discount Rate: {disc.discountRate}%</p>
                  <p>Total Setelah Diskon: Rp {numberWithCommas(disc.total)}</p>
                  <div className='mt-3'>
                    <p>
                      {sessionData?.user?.name ?? 'Kamu'}: Rp{' '}
                      {numberWithCommas(disc.ownDiscount)}
                    </p>
                    {selectedUserIds?.length > 0 &&
                      selectedUserIds.map((id, index) => {
                        const user = users.find((user) => user.id === id);
                        return (
                          <p key={id}>
                            {user?.name ?? 'Loading...'}: Rp{' '}
                            {!isNaN(disc.discountAmount[index])
                              ? numberWithCommas(disc.discountAmount[index])
                              : 0}
                          </p>
                        );
                      })}
                  </div>
                </div>

                <div className='mt-3 flex flex-wrap gap-4'>
                  <Button isLoading={isLoading} type='submit'>
                    Tagih Utang
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

function calculateDiscount({
  ownAmount,
  amounts,
  discount,
  others,
}: {
  ownAmount: string;
  amounts: string[];
  discount: string;
  others: string;
}) {
  if (
    !ownAmount ||
    !amounts ||
    !discount ||
    !others ||
    amounts.findIndex((a) => !a) > -1
  ) {
    return {
      ownDiscount: 0,
      discountAmount: [],
      discountRate: 0,
      total: 0,
    };
  }

  const totalFoodPrice =
    cleanNumber(ownAmount) +
    amounts.reduce((sum, amount) => sum + cleanNumber(amount), 0);
  const discountRate = 1 - cleanNumber(discount) / totalFoodPrice;
  discountRate;

  const othersSplitted = cleanNumber(others) / (amounts.length + 1);

  const ownDiscount = cleanNumber(ownAmount) * discountRate + othersSplitted;

  const discountAmount = amounts.map(
    (amount) => cleanNumber(amount) * discountRate + othersSplitted
  );

  const total = ownDiscount + discountAmount.reduce((a, b) => a + b);

  return {
    ownDiscount: Math.round(ownDiscount),
    discountAmount: discountAmount.map((amount) => Math.round(amount)),
    total: Math.round(total),
    discountRate: ((1 - discountRate) * 100).toFixed(2),
  };
}
