import type { PlayerId } from '@/types/playerId';

export type DieType = 'safe' | 'risk';

export interface DiceState {
  selected: Record<PlayerId, DieType>;
  lastRoll: Record<PlayerId, number | null>;
  rollingPlayerId: PlayerId | null;
}
