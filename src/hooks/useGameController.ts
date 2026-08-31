import { useMemo } from 'react';
import { gameController } from '@/game/controller/gameController';

/** Stable reference to controller actions for UI components. */
export function useGameController() {
  return useMemo(() => gameController, []);
}
