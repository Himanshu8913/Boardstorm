import type { TurnState } from '@/types/turn';

/**
 * Creates the initial turn state for a new game.
 * The first player in `playerOrder` takes the opening turn on round 1.
 *
 * @param playerOrder - Player IDs in the order they will take turns
 */
export function createInitialTurnState(playerOrder: number[]): TurnState {
  return {
    currentPlayerIndex: 0,
    round: 1,
    playerOrder,
  };
}

/**
 * Returns the player ID whose turn it currently is.
 *
 * @param turnState - Current turn state
 */
export function getCurrentPlayerId(turnState: TurnState): number {
  return turnState.playerOrder[turnState.currentPlayerIndex];
}

/**
 * Advances to the next player in order. When the last player ends their
 * turn, play wraps to the first player and the round counter increments.
 *
 * @param turnState - Current turn state
 */
export function advanceTurn(turnState: TurnState): TurnState {
  const nextIndex =
    (turnState.currentPlayerIndex + 1) % turnState.playerOrder.length;
  const completedRound = nextIndex === 0;

  return {
    ...turnState,
    currentPlayerIndex: nextIndex,
    round: completedRound ? turnState.round + 1 : turnState.round,
  };
}

/**
 * Checks whether a given player is allowed to act on the current turn.
 *
 * @param turnState - Current turn state
 * @param playerId - Player to check
 */
export function isPlayersTurn(turnState: TurnState, playerId: number): boolean {
  return getCurrentPlayerId(turnState) === playerId;
}
