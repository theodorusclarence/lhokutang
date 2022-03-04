import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { signIn, useSession } from 'next-auth/react';
import { Fragment } from 'react';
import { FcGoogle } from 'react-icons/fc';

import Button from '@/components/buttons/Button';
import UnstyledLink from '@/components/links/UnstyledLink';
import NextImage from '@/components/NextImage';

/* This example requires Tailwind CSS v2.0+ */
const navigation = [
  { name: 'Solutions', href: '#' },
  { name: 'Pricing', href: '#' },
  { name: 'Docs', href: '#' },
  { name: 'Company', href: '#' },
];

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className='bg-primary-600'>
      <nav className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8' aria-label='Top'>
        <div className='flex w-full items-center justify-between border-b border-primary-500 py-4 lg:border-none'>
          <div className='flex items-center'>
            <UnstyledLink href='/' className='text-lg font-semibold text-white'>
              LhokUtang
            </UnstyledLink>
            <div className='ml-10 hidden space-x-8 lg:block'>
              {navigation.map((link) => (
                <UnstyledLink
                  key={link.name}
                  href={link.href}
                  className='text-base font-medium text-white hover:text-primary-50'
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
              className='text-base font-medium text-white hover:text-primary-50'
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
                  className='h-[35px] w-[35px] overflow-hidden rounded-full border-2 border-white'
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
                  <button
                    className={clsx(
                      active ? 'bg-gray-100' : '',
                      'block w-full px-4 py-2 text-left text-sm text-gray-700'
                    )}
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
