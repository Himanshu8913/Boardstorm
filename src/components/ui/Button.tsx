import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/components/ui/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-secondary to-secondary-hover text-ink-inverse shadow-secondary hover:brightness-110',
  secondary:
    'border-2 border-primary/60 bg-surface-elevated text-primary hover:bg-primary/10',
  ghost:
    'bg-transparent text-ink-muted hover:bg-background-accent hover:text-ink',
  danger:
    'bg-danger text-ink-inverse shadow-md hover:brightness-95',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] px-4 py-2 text-xs',
  md: 'min-h-[44px] px-6 py-3 text-sm',
  lg: 'min-h-[48px] px-8 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
          'transition-all duration-fast',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          'disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:scale-100',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      />
    );
  },
);
