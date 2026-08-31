import type { TileType } from '@/types/tile';

/** Visual effect currently playing on a board tile. */
export type ActiveTileEffect = {
  tileNumber: number;
  effect: TileType;
};

/** Motion effect applied to a player token during tile resolution. */
export type PlayerMotionEffect = 'boost' | 'trap' | 'mystery';

export type ActivePlayerMotion = {
  playerId: number;
  motion: PlayerMotionEffect;
};
