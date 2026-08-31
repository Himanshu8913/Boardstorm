import type { TileType } from '@/types/tile';
import type { PlayerId } from '@/types/playerId';

export type AnimationType =
  | 'roll'
  | 'move'
  | 'trap'
  | 'boost'
  | 'mystery'
  | 'power'
  | 'boardstorm'
  | 'collision'
  | 'victory';

export type PlayerMotionEffect = 'boost' | 'trap' | 'mystery';

export interface AnimationTask {
  id: string;
  type: AnimationType;
  durationMs: number;
  payload: unknown;
}

export interface ActiveTileEffect {
  tileNumber: number;
  effect: TileType;
}

export interface AnimationState {
  queue: AnimationTask[];
  current: AnimationTask | null;
  playing: boolean;
  mutatingTileNumbers: number[];
  activeTileEffect: ActiveTileEffect | null;
  playerMotions: Record<PlayerId, PlayerMotionEffect>;
  boardRumbling: boolean;
  /** Visual-only token positions during hop animations. */
  visualPositions: Record<PlayerId, number | null>;
  /** Visual dice roll in progress (does not block gameplay). */
  rollingPlayerId: PlayerId | null;
}
