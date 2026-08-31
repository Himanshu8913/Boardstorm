import { BOARDSTORM_ROUND_INTERVAL } from '@/constants/boardstorm';
import type { PlayerId } from '@/types/playerId';
import type { TurnState } from '@/types/turn';
import { shuffle } from '@/game/random';

export function createPlayerOrder(playerIds: PlayerId[]): PlayerId[] {
  return shuffle(playerIds);
}

export function getCurrentPlayerId(turn: TurnState): PlayerId | null {
  if (turn.playerOrder.length === 0) {
    return null;
  }

  return turn.playerOrder[turn.currentPlayerIndex] ?? null;
}

export function createInitialTurnState(playerIds: PlayerId[]): TurnState {
  return {
    currentPlayerIndex: 0,
    round: 1,
    playerOrder: createPlayerOrder(playerIds),
  };
}

export type AdvanceTurnResult = {
  turn: TurnState;
  roundCompleted: boolean;
  shouldBoardstorm: boolean;
};

/**
 * Advances to the next player. Increments round when wrapping to first player.
 * Boardstorm triggers when a round boundary completes every 5 rounds.
 */
export function advanceTurn(turn: TurnState): AdvanceTurnResult {
  if (turn.playerOrder.length === 0) {
    return { turn, roundCompleted: false, shouldBoardstorm: false };
  }

  const nextIndex = (turn.currentPlayerIndex + 1) % turn.playerOrder.length;
  const roundCompleted = nextIndex === 0;
  const nextRound = roundCompleted ? turn.round + 1 : turn.round;
  const shouldBoardstorm =
    roundCompleted &&
    turn.round > 0 &&
    turn.round % BOARDSTORM_ROUND_INTERVAL === 0;

  return {
    turn: {
      ...turn,
      currentPlayerIndex: nextIndex,
      round: nextRound,
    },
    roundCompleted,
    shouldBoardstorm,
  };
}

export function getRoundsUntilBoardstorm(round: number): number {
  const remainder = round % BOARDSTORM_ROUND_INTERVAL;
  return remainder === 0
    ? BOARDSTORM_ROUND_INTERVAL
    : BOARDSTORM_ROUND_INTERVAL - remainder;
}
