import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/components/ui/cn';
import { IconButton } from '@/components/ui/IconButton';

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Hide the close button (e.g. victory screen with explicit actions only) */
  hideClose?: boolean;
  className?: string;
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  hideClose = false,
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !hideClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, hideClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={hideClose ? undefined : onClose}
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-md animate-modal-in',
          'rounded-xl border border-border bg-surface p-6 shadow-lg',
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-section text-ink">
            {title}
          </h2>
          {!hideClose && (
            <IconButton label="Close" size="sm" onClick={onClose}>
              <span aria-hidden="true">✕</span>
            </IconButton>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
