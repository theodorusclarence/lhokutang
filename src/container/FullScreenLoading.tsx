import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ImSpinner6 } from 'react-icons/im';

export default function FullScreenLoading({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      toast.error('Please login first');
      push('/');
    },
  });
  const isUser = !!session?.user;

  return (
    <>
      {isUser ? (
        children
      ) : (
        <div className='flex min-h-screen flex-col items-center justify-center gap-2'>
          <h1>LhokUtang</h1>
          <span className='text-lg font-bold'>Loading...</span>
          <ImSpinner6 className='animate-spin text-2xl' />
        </div>
      )}
    </>
  );
}
