import { BOARDSTORM_ROUND_INTERVAL } from '@/constants/boardstorm';
import type { BoardMood } from '@/types/match';
import type { BoardTile } from '@/types/tile';
import {
  mutateBoardForBoardstorm,
  type BoardstormMutationResult,
} from '@/game/engines/boardEngine';

export function shouldTriggerBoardstormAfterRound(
  completedRound: number,
): boolean {
  return (
    completedRound > 0 && completedRound % BOARDSTORM_ROUND_INTERVAL === 0
  );
}

export function applyBoardstorm(
  tiles: BoardTile[],
  mood: BoardMood,
): BoardstormMutationResult {
  return mutateBoardForBoardstorm(tiles, mood);
}
