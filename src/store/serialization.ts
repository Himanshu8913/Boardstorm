import type { GameStore, GameplaySavePayload } from '@/types/gameStore';
import { createInitialState } from '@/store/createInitialState';
import { selectGameplayPayload } from '@/store/selectors';

/** Builds JSON-serializable gameplay snapshot (excludes ui, animation, settings). */
export function serializeGameplay(state: GameStore): string {
  return JSON.stringify(selectGameplayPayload(state));
}

/** Restores gameplay slices from a save payload. */
export function deserializeGameplay(
  payload: GameplaySavePayload,
  current: GameStore,
): GameStore {
  if (payload.version !== 1) {
    throw new Error(`Unsupported save version: ${payload.version}`);
  }

  return {
    ...current,
    match: payload.match,
    board: payload.board,
    players: payload.players,
    turn: payload.turn,
    powers: payload.powers,
    events: { events: payload.events },
  };
}

/** Round-trip helper for validation. */
export function roundTripGameplay(state: GameStore): GameStore {
  const json = serializeGameplay(state);
  const payload = JSON.parse(json) as GameplaySavePayload;
  return deserializeGameplay(payload, createInitialState(state.settings));
}
