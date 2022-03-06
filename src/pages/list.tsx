import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import * as React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import useSWR from 'swr';

import useWithToast from '@/hooks/toast/useSWRWithToast';

import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

export default function ListPage() {
  const { data: sessionData } = useSession();
  const { data: userData } = useWithToast(
    useSWR<{ users: User[] }>('/api/users'),
    {
      loading: 'getting user data',
    }
  );
  const users =
    userData?.users.filter((user) => user.name !== sessionData?.user?.name) ??
    [];

  return (
    <Layout>
      <Seo templateTitle='List' />

      <main>
        <section className=''>
          <div className='layout min-h-screen py-4'>
            <h1>List of users</h1>

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
                  <p>{user.email}</p>
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
