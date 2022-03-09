import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getSession, signIn } from 'next-auth/react';
import * as React from 'react';

import Layout from '@/components/layout/Layout';
import UnderlineLink from '@/components/links/UnderlineLink';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

export default function HomePage({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout flex flex-col items-start py-12'>
            {!session ? (
              <div className='w-full'>
                <main className='mx-auto mt-16 px-4 sm:mt-24'>
                  <div className='text-center'>
                    <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl'>
                      <span className='block xl:inline'>Selamat datang di</span>{' '}
                      <span className='block text-primary-600 xl:inline'>
                        LhokUtang
                      </span>
                    </h1>
                    <p className='mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl'>
                      Solusi untuk perutangan duniawi di kos lhoktuan.
                    </p>
                    <div className='mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8'>
                      <div className='rounded-md shadow'>
                        <button
                          onClick={() => signIn('google')}
                          className='flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-3 text-base font-medium text-white hover:bg-primary-700 md:py-4 md:px-10 md:text-lg'
                        >
                          Login
                        </button>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            ) : (
              <div>
                <p>Welcome,</p>
                <div className='mt-2 flex items-center gap-3'>
                  {session.user?.image && (
                    <NextImage
                      className='h-[35px] w-[35px] overflow-hidden rounded-full'
                      src={session.user?.image}
                      width={250}
                      height={250}
                      alt='Google Icon'
                    />
                  )}
                  <p className='text-lg font-medium'>{session.user?.name}</p>
                </div>
              </div>
            )}

            <footer className='absolute bottom-2 self-center text-gray-700'>
              © {new Date().getFullYear()} By{' '}
              <UnderlineLink href='https://theodorusclarence.com?ref=tsnextstarter'>
                Theodorus Clarence
              </UnderlineLink>
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/list',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
