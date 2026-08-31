import { MIN_PLAYERS } from '@/constants/game';
import {
  DEFAULT_PLAYER_COLORS,
  DEFAULT_PLAYER_NAMES,
  GHOST_PLAYER_NAMES,
} from '@/constants/players';
import type { GameMode } from '@/types/match';
import type { MatchSetupConfig } from '@/types/setup';

export function createDefaultSetupConfig(
  mode: GameMode,
  playerCount = MIN_PLAYERS,
): MatchSetupConfig {
  const count = mode === 'solo' ? GHOST_PLAYER_NAMES.length : playerCount;
  const names = mode === 'solo' ? GHOST_PLAYER_NAMES : DEFAULT_PLAYER_NAMES;

  return {
    playerCount: count,
    players: Array.from({ length: count }, (_, index) => ({
      name: names[index] ?? `Player ${index + 1}`,
      color:
        DEFAULT_PLAYER_COLORS[index] ?? DEFAULT_PLAYER_COLORS[0] ?? '#2563eb',
    })),
  };
}
