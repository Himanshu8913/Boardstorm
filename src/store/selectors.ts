import type { GameStore, GameplaySavePayload } from '@/types/gameStore';
import type { PlayerId } from '@/types/playerId';
import type { BoardTile } from '@/types/tile';
import type { TurnState } from '@/types/turn';

export function getCurrentPlayerId(turn: TurnState): PlayerId | null {
  if (turn.playerOrder.length === 0) {
    return null;
  }

  return turn.playerOrder[turn.currentPlayerIndex] ?? null;
}

export function getTileMap(board: GameStore['board']): Map<number, BoardTile> {
  return new Map(board.tiles.map((tile) => [tile.number, tile]));
}

export function getPlayersOnTile(
  players: GameStore['players'],
  tileNumber: number,
): GameStore['players'][PlayerId][] {
  return Object.values(players).filter((player) => player.position === tileNumber);
}

export function isMatchActive(match: GameStore['match']): boolean {
  return match.status === 'playing' || match.status === 'moodReveal';
}

export function selectCurrentPlayer(state: GameStore) {
  const playerId = getCurrentPlayerId(state.turn);
  if (playerId === null) {
    return null;
  }

  return state.players[playerId] ?? null;
}

export function selectGameplayPayload(state: GameStore): GameplaySavePayload {
  return {
    version: 1,
    match: state.match,
    board: state.board,
    players: state.players,
    turn: state.turn,
    powers: state.powers,
    events: state.events.events,
  };
}
