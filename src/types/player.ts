import type { MysteryPower } from '@/types/power';

export type Player = {
  id: number;
  name: string;
  position: number;
  color: string;
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

export const INITIAL_PLAYERS: Player[] = Array.from(
  { length: MAX_PLAYERS },
  (_, index) => ({
    id: index + 1,
    name: `Player ${index + 1}`,
    position: 1,
    color: PLAYER_COLORS[index],
    activePower: null,
    lastMysteryTile: null,
  }),
);
