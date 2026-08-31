import {
  DEFAULT_PLAYER_COLORS,
  DEFAULT_PLAYER_NAMES,
  GHOST_PLAYER_NAMES,
} from '@/constants/players';
import { MAX_PLAYERS } from '@/constants/game';
import type { GameMode } from '@/types/match';
import type { PlayerId } from '@/types/playerId';
import type { PlayersState } from '@/types/player';
import { START_TILE } from '@/constants/board';

export function createPlayersForMode(mode: GameMode): PlayersState {
  const count = MAX_PLAYERS;
  const names = mode === 'solo' ? GHOST_PLAYER_NAMES : DEFAULT_PLAYER_NAMES;
  const players: PlayersState = {};

  for (let index = 0; index < count; index++) {
    const id = (index + 1) as PlayerId;
    players[id] = {
      id,
      name: names[index] ?? `Player ${id}`,
      color: DEFAULT_PLAYER_COLORS[index] ?? DEFAULT_PLAYER_COLORS[0],
      position: START_TILE,
      activePower: null,
      lastMysteryTile: null,
      isGhost: mode === 'solo' && id !== 1,
    };
  }

  return players;
}

export function updatePlayerPosition(
  players: PlayersState,
  playerId: PlayerId,
  position: number,
): PlayersState {
  const player = players[playerId];
  if (!player) {
    return players;
  }

  return {
    ...players,
    [playerId]: { ...player, position },
  };
}
