import { BOARD_SIZE } from '@/constants/board';
import type { GameStore } from '@/types/gameStore';
import type { PlayerId } from '@/types/playerId';
import { getCurrentPlayerId } from '@/game/engines/turnEngine';

export type ValidationResult =
  | { ok: true }
  | { ok: false; reason: string };

export function validateMatchPlaying(state: GameStore): ValidationResult {
  if (state.match.status !== 'playing') {
    return { ok: false, reason: 'Match is not in play.' };
  }

  if (state.match.winnerId !== null) {
    return { ok: false, reason: 'Match already has a winner.' };
  }

  if (state.board.tiles.length !== BOARD_SIZE) {
    return { ok: false, reason: 'Board is not ready.' };
  }

  return { ok: true };
}

export function validatePlayerTurn(
  state: GameStore,
  playerId: PlayerId,
): ValidationResult {
  const playing = validateMatchPlaying(state);
  if (!playing.ok) {
    return playing;
  }

  const currentId = getCurrentPlayerId(state.turn);
  if (currentId !== playerId) {
    return { ok: false, reason: 'Not this player\'s turn.' };
  }

  return { ok: true };
}

export function validateCanRoll(state: GameStore): ValidationResult {
  if (state.dice.rollingPlayerId !== null) {
    return { ok: false, reason: 'A roll is already in progress.' };
  }

  if (state.ui.canEndTurn) {
    return { ok: false, reason: 'End the current turn before rolling again.' };
  }

  return { ok: true };
}
