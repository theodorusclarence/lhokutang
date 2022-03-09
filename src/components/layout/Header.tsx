import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Fragment } from 'react';
import { FcGoogle } from 'react-icons/fc';

import clsxm from '@/lib/clsxm';

import Button from '@/components/buttons/Button';
import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';

/* This example requires Tailwind CSS v2.0+ */
const navigation = [
  { name: 'Lihat (Pi)utang', href: '/list', role: 'authenticated' },
  { name: 'Request Uang', href: '/debt/request', role: 'authenticated' },
  { name: 'Split Bill', href: '/debt/split', role: 'authenticated' },
  // { name: 'Lihat Penghuni', href: '/list', role: 'unauthenticated' },
];

export default function Header() {
  const { data: session, status } = useSession();
  const { asPath } = useRouter();

  return (
    <header className='bg-white'>
      <nav className='layout' aria-label='Top'>
        <div className='flex w-full items-center justify-between border-b border-gray-200 py-4 lg:border-none'>
          <div className='flex items-center'>
            <UnstyledLink href='/' className='text-lg font-semibold text-black'>
              LhokUtang
            </UnstyledLink>
            <div className='ml-10 hidden space-x-8 lg:block'>
              {navigation.map((link) => (
                <UnstyledLink
                  key={link.name}
                  href={link.href}
                  className={clsxm(
                    'text-base font-medium text-gray-600 hover:text-gray-500',
                    link.href === asPath && 'text-primary-700',
                    !(link.role === status || link.role === 'public') &&
                      'hidden'
                  )}
                >
                  {link.name}
                </UnstyledLink>
              ))}
            </div>
          </div>
          <div className='ml-10 space-x-4'>
            {!session ? (
              <Button
                onClick={() => signIn('google')}
                className='items-center gap-2 font-normal'
                variant='light'
              >
                <FcGoogle className='text-[1.15em]' />
                <span>Sign in</span>
              </Button>
            ) : (
              <div>
                <ProfileDropdown />
              </div>
            )}
          </div>
        </div>
        {/* Mobile */}
        <div className='flex flex-wrap justify-center space-x-6 py-4 lg:hidden'>
          {navigation.map((link) => (
            <UnstyledLink
              key={link.name}
              href={link.href}
              className={clsxm(
                'text-base font-medium text-gray-600 hover:text-gray-500',
                link.href === asPath && 'text-primary-700',
                !(link.role === status || link.role === 'public') && 'hidden'
              )}
            >
              {link.name}
            </UnstyledLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

function ProfileDropdown() {
  const { data: session } = useSession();

  return (
    <>
      {session && (
        <Menu as='div' className='relative ml-3'>
          <div>
            <Menu.Button className='flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'>
              <span className='sr-only'>Open user menu</span>
              {session.user?.image && (
                <NextImage
                  className='h-[35px] w-[35px] overflow-hidden rounded-full border-2 border-gray-300'
                  src={session.user?.image}
                  width={250}
                  height={250}
                  alt='Google Icon'
                />
              )}
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <Menu.Item>
                {({ active }) => (
                  <UnstyledLink
                    href='/profile'
                    className={clsx(
                      active ? 'bg-gray-100' : '',
                      'block w-full px-4 py-2 text-left text-sm text-gray-700'
                    )}
                  >
                    Edit Profile
                  </UnstyledLink>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={clsx(
                      active ? 'bg-gray-100' : '',
                      'block w-full px-4 py-2 text-left text-sm text-gray-700'
                    )}
                    onClick={() => signOut()}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </>
  );
}
