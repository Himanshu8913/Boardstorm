import type { GameMode } from '@/types/gameMode';
import type { MysteryPower } from '@/types/power';

export type Player = {
  id: number;
  name: string;
  position: number;
  color: string;
  /** AI-controlled opponent in solo mode. */
  isGhost: boolean;
  /** One stored mystery power; replaced when landing on a new Mystery tile. */
  activePower: MysteryPower | null;
  /** Last Mystery tile visited; used by the Collapse trap effect. */
  lastMysteryTile: number | null;
};

export const MAX_PLAYERS = 4;

export const PLAYER_COLORS = [
  '#ef4444',
  '#3b82f6',
  '#22c55e',
  '#a855f7',
] as const;

/**
 * Creates the player roster for the selected game mode.
 * Solo mode: Player 1 is human, players 2–4 are ghosts.
 *
 * @param mode - Solo vs local multiplayer
 */
export function createPlayers(mode: GameMode): Player[] {
  return Array.from({ length: MAX_PLAYERS }, (_, index) => {
    const id = index + 1;
    const isGhost = mode === 'solo' && index > 0;

    return {
      id,
      name: isGhost ? `Ghost ${id}` : `Player ${id}`,
      position: 1,
      color: PLAYER_COLORS[index],
      isGhost,
      activePower: null,
      lastMysteryTile: null,
    };
  });
}

export const INITIAL_PLAYERS = createPlayers('multiplayer');
