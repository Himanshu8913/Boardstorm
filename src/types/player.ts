import type { MysteryPower } from '@/types/power';
import type { PlayerId } from '@/types/playerId';

export interface PlayerState {
  id: PlayerId;
  name: string;
  color: string;
  position: number;
  activePower: MysteryPower | null;
  lastMysteryTile: number | null;
  isGhost: boolean;
}

export type PlayersState = Record<PlayerId, PlayerState>;
