import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/components/ui/cn';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: 'sm' | 'md';
};

const sizeClasses = {
  sm: 'h-9 w-9',
  md: 'h-11 w-11',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { label, size = 'md', className, disabled, type = 'button', children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center rounded-lg',
          'bg-surface text-ink shadow-sm border border-border',
          'transition-all duration-fast',
          'hover:bg-background-accent hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
