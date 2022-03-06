import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import clsxm from '@/lib/clsxm';

import UserImage from '@/components/UserImage';
import { UserSelectPeople } from '@/components/UserSelect';

type UserCheckboxesProps = {
  users: UserSelectPeople[];
  id: string;
} & React.ComponentPropsWithoutRef<'div'>;

export default function UserCheckboxes({
  className,
  users,
  id,
  ...rest
}: UserCheckboxesProps) {
  const { register } = useFormContext();

  return (
    <div className={clsxm('', className)} {...rest}>
      <fieldset>
        <legend className='text-sm font-normal text-gray-900'>
          Pilih Penghuni
        </legend>
        <div className='mt-2 max-h-[264px] divide-y divide-gray-200 overflow-y-auto border-t border-b border-gray-200'>
          {users.map((user) => (
            <div key={user.id} className='relative flex items-start py-4'>
              <div className='min-w-0 flex-1 text-sm'>
                <label
                  htmlFor={`${id}.[${user.id}]`}
                  className='flex select-none items-center gap-2 font-medium text-gray-700'
                >
                  <UserImage size='25px' image={user.image} />
                  <span>{user.name}</span>
                </label>
              </div>
              <div className='ml-3 flex h-5 items-center'>
                <input
                  {...register(`${id}.[${user.id}]`)}
                  id={`${id}.[${user.id}]`}
                  name={`${id}.[${user.id}]`}
                  type='checkbox'
                  className='h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500'
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
