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
  default: 'bg-background-accent text-ink border-border',
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/15 text-secondary border-secondary/30',
  success: 'bg-success/15 text-green-800 border-success/30',
  danger: 'bg-danger/15 text-red-800 border-danger/30',
  mystery: 'bg-mystery/15 text-purple-800 border-mystery/30',
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
