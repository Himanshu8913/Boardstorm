import type { PlayerId } from '@/types/playerId';
import type { TileType } from '@/types/tile';

export type RollTaskPayload = {
  playerId: PlayerId;
};

export type MoveTaskPayload = {
  playerId: PlayerId;
  tileNumber: number;
  stepIndex: number;
  totalSteps: number;
  clearVisualAfter: boolean;
};

export type TileEffectTaskPayload = {
  playerId: PlayerId;
  tileNumber: number;
  effect: Extract<TileType, 'trap' | 'boost' | 'mystery'>;
};

export type CollisionTaskPayload = {
  playerId: PlayerId;
  from: number;
  to: number;
};

export type BoardstormTaskPayload = {
  mutatedTileNumbers: number[];
};

export type VictoryTaskPayload = {
  playerId: PlayerId;
};

export type PowerTaskPayload = {
  playerId: PlayerId;
  power: string;
};
