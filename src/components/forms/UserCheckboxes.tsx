import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import clsxm from '@/lib/clsxm';

import UserImage from '@/components/UserImage';
import { UserSelectPeople } from '@/components/UserSelect';

import { alumnusEmail } from '@/constant/email-whitelist';

type UserCheckboxesProps = {
  users: UserSelectPeople[];
  id: string;
} & React.ComponentPropsWithoutRef<'div'>;

export default function UserCheckboxes({
  className,
  users: _users,
  id,
  ...rest
}: UserCheckboxesProps) {
  const users = _users.filter(
    (user) => !alumnusEmail.includes(user.email ?? '')
  );
  const alumnus = _users.filter((user) =>
    alumnusEmail.includes(user.email ?? '')
  );

  return (
    <div className={clsxm('', className)} {...rest}>
      <fieldset>
        <legend className='text-sm font-normal text-gray-900'>
          Pilih Penghuni
        </legend>
        <div className='mt-2 max-h-[264px] divide-y divide-gray-200 overflow-y-auto border-t border-b border-gray-200'>
          {users.map((user) => (
            <UserCheckboxItem key={user.id} user={user} id={id} />
          ))}
          <div className='px-2 py-1 text-xs font-medium uppercase text-gray-500'>
            Alumni
          </div>
          {alumnus.map((user) => (
            <UserCheckboxItem key={user.id} user={user} id={id} />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function UserCheckboxItem({
  user,
  id,
}: {
  user: UserSelectPeople;
  id: string;
}) {
  const { register } = useFormContext();

  return (
    <div key={user.id} className='relative flex items-start py-4'>
      <div className='min-w-0 flex-1 text-sm'>
        <label
          htmlFor={`${id}.[${user.id}]`}
          className='flex select-none items-center gap-2 font-medium text-gray-700'
        >
          <UserImage className='h-6 w-6' image={user.image} />
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
  );
}
