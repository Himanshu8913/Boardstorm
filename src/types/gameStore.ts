import type { AIState } from '@/types/ai';
import type { AnimationState } from '@/types/animation';
import type { DiceState } from '@/types/dice';
import type { EventState, GameEvent } from '@/types/event';
import type { MatchState } from '@/types/match';
import type { PlayersState } from '@/types/player';
import type { PowerState } from '@/types/power';
import type { SettingsState } from '@/types/settings';
import type { BoardState } from '@/types/tile';
import type { TurnState } from '@/types/turn';
import type { UIState } from '@/types/ui';

/** Root Zustand store shape per 04_GAME_STATE.md */
export interface GameStore {
  match: MatchState;
  board: BoardState;
  players: PlayersState;
  turn: TurnState;
  dice: DiceState;
  powers: PowerState;
  events: EventState;
  ui: UIState;
  animation: AnimationState;
  settings: SettingsState;
  ai: AIState;
}

/** Serializable gameplay snapshot (excludes ui, animation, settings). */
export interface GameplaySavePayload {
  version: 1;
  match: MatchState;
  board: BoardState;
  players: PlayersState;
  turn: TurnState;
  powers: PowerState;
  events: GameEvent[];
}

export type {
  AIState,
  AIDifficulty,
} from '@/types/ai';
export type {
  ActiveTileEffect,
  AnimationState,
  AnimationTask,
  AnimationType,
  PlayerMotionEffect,
} from '@/types/animation';
export type {
  BoardState,
  BoardTile,
  BoostEffect,
  TileType,
  TrapEffect,
} from '@/types/tile';
export type { DiceState, DieType } from '@/types/dice';
export type { EventState, EventType, GameEvent } from '@/types/event';
export type {
  BoardMood,
  GameMode,
  MatchState,
  MatchStatus,
} from '@/types/match';
export type { PlayerState, PlayersState } from '@/types/player';
export type { PlayerId } from '@/types/playerId';
export type {
  ActivePowerMeta,
  MysteryPower,
  PowerAction,
  PowerState,
} from '@/types/power';
export type {
  AnimationSpeed,
  SettingsState,
  TileVisibility,
} from '@/types/settings';
export type { TurnState } from '@/types/turn';
export type { ModalType, UIState } from '@/types/ui';
