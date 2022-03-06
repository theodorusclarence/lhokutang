/* This example requires Tailwind CSS v2.0+ */
import { Listbox, Transition } from '@headlessui/react';
import clsx from 'clsx';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { HiCheck, HiSelector } from 'react-icons/hi';

import clsxm from '@/lib/clsxm';

import NextImage from '@/components/NextImage';

import Input from './forms/Input';

export type UserSelectPeople = {
  id: string;
  name: string;
  image?: string | null;
};

type UserSelectProps = {
  selected: UserSelectPeople;
  setSelected: React.Dispatch<React.SetStateAction<UserSelectPeople>>;
  people: UserSelectPeople[];
  label?: string;
};

export default function UserSelect({
  selected,
  people,
  setSelected,
  label = 'User',
}: UserSelectProps) {
  const {
    formState: { errors },
    setValue,
  } = useFormContext();

  return (
    <Listbox
      value={selected}
      onChange={(e: UserSelectPeople) => {
        setSelected(e);
        setValue('destinationUserId', e.id, { shouldValidate: true });
      }}
    >
      {({ open }) => (
        <div>
          <div className='hidden'>
            <Input
              id='destinationUserId'
              label='Minta uang ke'
              validation={{ required: `Field ${label} harus diisi` }}
            />
          </div>
          <Listbox.Label className='block text-sm font-normal text-gray-700'>
            {label}
          </Listbox.Label>
          <div className='relative mt-1'>
            <Listbox.Button
              className={clsxm(
                'relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm',
                errors.destinationUserId &&
                  'border-red-500 focus:border-red-500 focus:ring-red-500'
              )}
            >
              <span className='flex items-center'>
                {selected?.image ? (
                  <NextImage
                    className='h-6 w-6 flex-shrink-0 overflow-hidden rounded-full'
                    src={selected.image}
                    width={250}
                    height={250}
                    alt='Google Icon'
                  />
                ) : (
                  <div className='h-6 w-6 flex-shrink-0 rounded-full bg-gray-100' />
                )}
                <span className='ml-3 block truncate'>{selected.name}</span>
              </span>
              <span className='pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2'>
                <HiSelector
                  className='h-5 w-5 text-gray-400'
                  aria-hidden='true'
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={React.Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                {people.map((person) => (
                  <Listbox.Option
                    key={person.id}
                    className={({ active }) =>
                      clsx(
                        active ? 'bg-primary-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className='flex items-center'>
                          {person?.image ? (
                            <NextImage
                              className='h-6 w-6 flex-shrink-0 overflow-hidden rounded-full'
                              src={person.image}
                              width={250}
                              height={250}
                              alt='Google Icon'
                            />
                          ) : (
                            <div className='h-6 w-6 flex-shrink-0 rounded-full bg-gray-100' />
                          )}
                          <span
                            className={clsx(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {person.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? 'text-white' : 'text-primary-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <HiCheck className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>

            <div className='mt-1'>
              {errors['destinationUserId'] && (
                <span className='text-sm text-red-500'>
                  {errors['destinationUserId'].message}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Listbox>
  );
}
