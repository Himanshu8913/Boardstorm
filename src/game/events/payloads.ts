import type { PlayerId } from '@/types/playerId';
import type { DieType } from '@/types/dice';
import type { MysteryPower } from '@/types/power';
import type { BoardMood, GameMode } from '@/types/match';
import type { TileType } from '@/types/tile';

export type MatchStartedPayload = {
  matchId: string;
  mode: GameMode;
  boardMood: BoardMood;
};

export type DiceRolledPayload = {
  playerId: PlayerId;
  dieType: DieType;
  value: number;
};

export type PlayerMovedPayload = {
  playerId: PlayerId;
  from: number;
  to: number;
  path: number[];
};

export type TileResolvedPayload = {
  playerId: PlayerId;
  tileNumber: number;
  tileType: TileType;
  message: string;
};

export type PowerGrantedPayload = {
  playerId: PlayerId;
  power: MysteryPower;
};

export type PowerUsedPayload = {
  playerId: PlayerId;
  power: MysteryPower;
  targetPlayerId?: PlayerId;
  targetTile?: number;
};

export type CollisionPayload = {
  landingPlayerId: PlayerId;
  bumpedPlayerId: PlayerId;
  from: number;
  to: number;
};

export type BoardstormPayload = {
  mutatedTileNumbers: number[];
  boardstormCount: number;
};

export type WinnerPayload = {
  playerId: PlayerId;
};

export type TurnEndedPayload = {
  playerId: PlayerId;
  nextPlayerId: PlayerId | null;
};

export type RoundCompletedPayload = {
  round: number;
};
