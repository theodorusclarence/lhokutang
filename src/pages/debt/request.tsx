import { useRouter } from 'next/router';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import axiosClient from '@/lib/axios';
import useWithToast from '@/hooks/toast/useSWRWithToast';

import Button from '@/components/buttons/Button';
import DatePicker from '@/components/forms/DatePicker';
import Input from '@/components/forms/Input';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import UserSelect, { UserSelectPeople } from '@/components/UserSelect';

import { DEFAULT_TOAST_MESSAGE } from '@/constant/toast';

type RequestData = {
  debtor: string;
  amount: number;
  date: string;
  description: string;
};

export default function DebtPage() {
  const { status, data: sessionData } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.replace('/');
  }

  //#region  //*=========== Form ===========
  const methods = useForm<RequestData>({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<RequestData> = (data) => {
    toast.promise(axiosClient.post('/api/debt/create', data), {
      ...DEFAULT_TOAST_MESSAGE,
      loading: 'Mengirim request uang...',
      success: 'Request uang berhasil dikirim',
    });
  };
  //#endregion  //*======== Form Submit ===========

  //#region  //*=========== User Select ===========
  const [userSelected, setUserSelected] = React.useState<UserSelectPeople>({
    id: '',
    name: 'Pick a user',
  });
  const { data: userData } = useWithToast(
    useSWR<{ users: User[] }>('/api/users'),
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
        .filter((user) => user.name !== sessionData?.user?.name)
    : [];
  //#endregion  //*======== User Select ===========

  return (
    <Layout>
      <Seo templateTitle='Add Debt' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <h1>Request Uang</h1>
            <p className='mt-1 text-gray-700'>
              Abis dititipin sesuatu? Minta uangnya biar ga lupa
            </p>

            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='mt-4 max-w-sm space-y-3'
              >
                <UserSelect
                  label='Minta uang ke'
                  selected={userSelected}
                  setSelected={setUserSelected}
                  people={users}
                />
                <Input
                  id='amount'
                  label='Nominal'
                  pattern='[0-9]*'
                  validation={{
                    required: 'Nominal harus diisi',
                    valueAsNumber: true,
                  }}
                />
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
                <DatePicker
                  id='date'
                  label='Tanggal'
                  validation={{
                    required: 'Tanggal harus diisi',
                    valueAsDate: true,
                  }}
                  defaultValue='2022-03-05'
                  placeholder='dd/mm/yyyy'
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

const descriptions = ['Bu Lala', 'Kane', 'Kopi'];
