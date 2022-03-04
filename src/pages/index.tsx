import { signIn, useSession } from 'next-auth/react';
import * as React from 'react';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import UnderlineLink from '@/components/links/UnderlineLink';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout flex flex-col items-start py-12'>
            {!session ? (
              <Button onClick={() => signIn('google')}>
                Login with Google
              </Button>
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
