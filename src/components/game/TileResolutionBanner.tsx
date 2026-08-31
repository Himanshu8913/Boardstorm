import { useEffect } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { cn } from '@/components/ui/cn';

const AUTO_DISMISS_MS = 4500;

export function TileResolutionBanner() {
  const message = useGameStore((state) => state.ui.resolutionMessage);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => {
      const store = useGameStore.getState();
      if (store.ui.resolutionMessage === message) {
        store.setUI({ ...store.ui, resolutionMessage: null });
      }
    }, AUTO_DISMISS_MS);

    return () => window.clearTimeout(timer);
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        'animate-modal-in rounded-lg border border-border bg-surface px-4 py-3 text-center text-sm font-medium text-ink shadow-md',
      )}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
