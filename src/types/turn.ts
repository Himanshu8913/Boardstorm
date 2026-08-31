import type { PlayerId } from '@/types/playerId';

export interface TurnState {
  currentPlayerIndex: number;
  round: number;
  playerOrder: PlayerId[];
}
