import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useSWR from 'swr';

import axiosClient from '@/lib/axios';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { REGEX } from '@/constant/regex';
import { DEFAULT_TOAST_MESSAGE } from '@/constant/toast';

type ProfileData = {
  phoneNumber: string;
};

ProfilePage.auth = true;

export default function ProfilePage() {
  //#region  //*=========== Get Route Param ===========
  const router = useRouter();
  //#endregion  //*======== Get Route Param ===========

  //#region  //*=========== Form ===========
  const methods = useForm<ProfileData>({
    mode: 'onTouched',
  });
  const { handleSubmit, setValue } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Load Default Values ===========
  const { data: session } = useSession();
  const { data: currentUser } = useSWR<User>(
    session?.user ? `/api/user/${session.user.id}` : undefined
  );
  React.useEffect(() => {
    setValue('phoneNumber', currentUser?.phoneNumber ?? '');
  }, [currentUser?.phoneNumber, setValue]);
  //#endregion  //*======== Load Default Values ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit: SubmitHandler<ProfileData> = (data) => {
    toast
      .promise(axiosClient.post('/api/user/phone', data), {
        ...DEFAULT_TOAST_MESSAGE,
        loading: 'Mengubah nomor telepon..',
        success: 'Nomor berhasil diubah',
      })
      .then(() => {
        router.push('/');
      });
  };
  //#endregion  //*======== Form Submit ===========

  return (
    <Layout>
      <Seo templateTitle='Profile' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='mt-4 max-w-sm space-y-3'
              >
                <Input
                  label='Nomor Telepon'
                  id='phoneNumber'
                  placeholder='Masukkan nomor telepon'
                  helperText='Gunakan format +62, contoh: +628123456789'
                  validation={{
                    required: 'Nomor telepon harus diisi',
                    pattern: REGEX.PHONE_NUMBER,
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
