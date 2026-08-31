import { DEFAULT_TURN_TIMER_SECONDS, DEFAULT_MUSIC_VOLUME, DEFAULT_SFX_VOLUME } from '@/constants/settings';
import type { AIState } from '@/types/ai';
import type { AnimationState } from '@/types/animation';
import type { DiceState } from '@/types/dice';
import type { EventState } from '@/types/event';
import type { MatchState } from '@/types/match';
import type { PlayersState } from '@/types/player';
import type { PowerState } from '@/types/power';
import type { SettingsState } from '@/types/settings';
import type { BoardState } from '@/types/tile';
import type { TurnState } from '@/types/turn';
import type { UIState } from '@/types/ui';

export const defaultMatchState = (): MatchState => ({
  id: '',
  status: 'idle',
  mode: 'multiplayer',
  boardMood: 'balanced',
  winnerId: null,
  createdAt: 0,
  finishedAt: null,
});

export const defaultBoardState = (): BoardState => ({
  tiles: [],
  boardstormCount: 0,
});

export const defaultPlayersState = (): PlayersState => ({});

export const defaultTurnState = (): TurnState => ({
  currentPlayerIndex: 0,
  round: 1,
  playerOrder: [],
});

export const defaultDiceState = (): DiceState => ({
  selected: {},
  lastRoll: {},
  rollingPlayerId: null,
});

export const defaultPowerState = (): PowerState => ({
  meta: {},
});

export const defaultEventState = (): EventState => ({
  events: [],
});

export const defaultUIState = (): UIState => ({
  activeModal: null,
  hoveredTile: null,
  resolutionMessage: null,
  canEndTurn: false,
});

export const defaultAnimationState = (): AnimationState => ({
  queue: [],
  current: null,
  playing: false,
  mutatingTileNumbers: [],
  activeTileEffect: null,
  playerMotions: {},
  boardRumbling: false,
  visualPositions: {},
  rollingPlayerId: null,
});

export const defaultSettingsState = (): SettingsState => ({
  tileVisibility: 'visible',
  animationSpeed: 'normal',
  soundEnabled: true,
  musicEnabled: true,
  sfxVolume: DEFAULT_SFX_VOLUME,
  musicVolume: DEFAULT_MUSIC_VOLUME,
  turnTimerEnabled: false,
  turnTimerSeconds: DEFAULT_TURN_TIMER_SECONDS,
});

export const defaultAIState = (): AIState => ({
  enabled: false,
  difficulty: 'normal',
});
