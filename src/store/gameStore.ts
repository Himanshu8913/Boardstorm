import { create } from 'zustand';
import { MAX_EVENT_LOG } from '@/constants/events';
import type { GameStore } from '@/types/gameStore';
import type { GameEvent } from '@/types/event';
import type { PlayerId } from '@/types/playerId';
import type { PlayerState } from '@/types/player';
import {
  createGameplayResetState,
  createInitialState,
} from '@/store/createInitialState';

type SliceKey = keyof GameStore;

type GameStoreActions = {
  /** Replace entire store (e.g. dev tools). */
  replaceStore: (state: GameStore) => void;

  /** Replace one top-level slice. */
  setSlice: <K extends SliceKey>(key: K, value: GameStore[K]) => void;

  /** Shallow-merge into a slice. */
  patchSlice: <K extends SliceKey>(
    key: K,
    patch: Partial<GameStore[K]>,
  ) => void;

  setMatch: (match: GameStore['match']) => void;
  setBoard: (board: GameStore['board']) => void;
  setPlayers: (players: GameStore['players']) => void;
  setPlayer: (playerId: PlayerId, player: PlayerState) => void;
  setTurn: (turn: GameStore['turn']) => void;
  setDice: (dice: GameStore['dice']) => void;
  setPowers: (powers: GameStore['powers']) => void;
  setEvents: (events: GameStore['events']) => void;
  appendEvent: (event: GameEvent) => void;
  setUI: (ui: GameStore['ui']) => void;
  setAnimation: (animation: GameStore['animation']) => void;
  setSettings: (settings: GameStore['settings']) => void;
  setAI: (ai: GameStore['ai']) => void;

  /** Resets gameplay slices; preserves settings. */
  resetMatch: () => void;

  /** Full factory reset including settings. */
  resetStore: () => void;
};

export type GameStoreState = GameStore & GameStoreActions;

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...createInitialState(),

  replaceStore: (state) => set(state),

  setSlice: (key, value) => set({ [key]: value } as Pick<GameStore, typeof key>),

  patchSlice: (key, patch) =>
    set((state) => ({
      [key]: { ...state[key], ...patch },
    })),

  setMatch: (match) => set({ match }),
  setBoard: (board) => set({ board }),
  setPlayers: (players) => set({ players }),
  setPlayer: (playerId, player) =>
    set((state) => ({
      players: { ...state.players, [playerId]: player },
    })),
  setTurn: (turn) => set({ turn }),
  setDice: (dice) => set({ dice }),
  setPowers: (powers) => set({ powers }),
  setEvents: (events) => set({ events }),
  appendEvent: (event) =>
    set((state) => {
      const events = [...state.events.events, event];
      const trimmed =
        events.length > MAX_EVENT_LOG
          ? events.slice(events.length - MAX_EVENT_LOG)
          : events;

      return {
        events: { events: trimmed },
      };
    }),
  setUI: (ui) => set({ ui }),
  setAnimation: (animation) => set({ animation }),
  setSettings: (settings) => set({ settings }),
  setAI: (ai) => set({ ai }),

  resetMatch: () => {
    const { settings } = get();
    set({ ...createGameplayResetState(), settings });
  },

  resetStore: () => set(createInitialState()),
}));
