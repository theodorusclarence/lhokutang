import clsx from 'clsx';

type TextButtonProps = {
  /** Button children element */
  children: React.ReactNode;
  /** Will be merged with button tag */
  className?: string;
} & React.ComponentPropsWithoutRef<'button'>;

export default function TextButton({
  children,
  className = '',
  type = 'button',
  ...rest
}: TextButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        'duration-250 inline-flex items-center font-medium transition-colors hover:text-primary-900',
        'focus:outline-none focus-visible:text-primary-900',
        'ring-primary-500 focus-visible:ring-2',
        className
      )}
      type={type}
    >
      {children}
    </button>
  );
}
