import type { ReactNode } from 'react';
import { cn } from '@/components/ui/cn';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'mystery';

export type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-elevated text-ink border-border',
  primary: 'bg-primary/20 text-blue-200 border-primary/40',
  secondary: 'bg-secondary/20 text-orange-200 border-secondary/40',
  success: 'bg-success/20 text-green-200 border-success/40',
  danger: 'bg-danger/20 text-red-200 border-danger/40',
  mystery: 'bg-mystery/20 text-purple-200 border-mystery/40',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5',
        'text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
