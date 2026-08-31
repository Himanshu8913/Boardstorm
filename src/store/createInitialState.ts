import type { GameStore } from '@/types/gameStore';
import {
  defaultAIState,
  defaultAnimationState,
  defaultBoardState,
  defaultDiceState,
  defaultEventState,
  defaultMatchState,
  defaultPlayersState,
  defaultPowerState,
  defaultSettingsState,
  defaultTurnState,
  defaultUIState,
} from '@/store/defaults';

/** Full store snapshot with explicit defaults — no undefined fields. */
export function createInitialState(
  settingsOverride?: Partial<GameStore['settings']>,
): GameStore {
  return {
    match: defaultMatchState(),
    board: defaultBoardState(),
    players: defaultPlayersState(),
    turn: defaultTurnState(),
    dice: defaultDiceState(),
    powers: defaultPowerState(),
    events: defaultEventState(),
    ui: defaultUIState(),
    animation: defaultAnimationState(),
    settings: {
      ...defaultSettingsState(),
      ...settingsOverride,
    },
    ai: defaultAIState(),
  };
}

type GameplaySlices = Pick<
  GameStore,
  | 'match'
  | 'board'
  | 'players'
  | 'turn'
  | 'dice'
  | 'powers'
  | 'events'
  | 'ui'
  | 'animation'
  | 'ai'
>;

/** Resets all slices except settings (preserved by caller). */
export function createGameplayResetState(): GameplaySlices {
  return {
    match: defaultMatchState(),
    board: defaultBoardState(),
    players: defaultPlayersState(),
    turn: defaultTurnState(),
    dice: defaultDiceState(),
    powers: defaultPowerState(),
    events: defaultEventState(),
    ui: defaultUIState(),
    animation: defaultAnimationState(),
    ai: defaultAIState(),
  };
}
