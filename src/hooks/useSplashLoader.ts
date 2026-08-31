import { useCallback, useEffect, useRef, useState } from 'react';
import {
  SPLASH_FADE_OUT_MS,
  SPLASH_MIN_DURATION_MS,
  SPLASH_PROGRESS_INTERVAL_MS,
} from '@/constants/splash';

export type SplashPhase = 'loading' | 'exiting' | 'done';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

async function waitForReadyAssets(): Promise<void> {
  const tasks: Promise<unknown>[] = [];

  if (document.fonts?.ready) {
    tasks.push(document.fonts.ready);
  }

  await Promise.all(tasks);
}

export function useSplashLoader() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<SplashPhase>('loading');
  const dismissedRef = useRef(false);
  const reducedMotion = useRef(prefersReducedMotion());

  const dismiss = useCallback(() => {
    if (dismissedRef.current) {
      return;
    }

    dismissedRef.current = true;
    setProgress(100);
    setPhase('exiting');

    const fadeMs = reducedMotion.current ? 0 : SPLASH_FADE_OUT_MS;
    window.setTimeout(() => setPhase('done'), fadeMs);
  }, []);

  const skip = useCallback(() => {
    dismiss();
  }, [dismiss]);

  useEffect(() => {
    if (reducedMotion.current) {
      void waitForReadyAssets().then(() => dismiss());
      return;
    }

    const startedAt = Date.now();
    let currentProgress = 0;

    const intervalId = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const timeProgress = Math.min(92, (elapsed / SPLASH_MIN_DURATION_MS) * 92);
      currentProgress = Math.max(currentProgress, timeProgress);
      setProgress(Math.round(currentProgress));
    }, SPLASH_PROGRESS_INTERVAL_MS);

    void waitForReadyAssets().then(() => {
      const remaining = Math.max(0, SPLASH_MIN_DURATION_MS - (Date.now() - startedAt));

      window.setTimeout(() => {
        window.clearInterval(intervalId);
        dismiss();
      }, remaining);
    });

    return () => {
      window.clearInterval(intervalId);
    };
  }, [dismiss]);

  return {
    progress,
    phase,
    isVisible: phase !== 'done',
    skip,
  };
}
