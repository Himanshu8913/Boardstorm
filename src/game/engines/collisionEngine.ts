import { COLLISION_BUMP_TILES } from '@/constants/game';
import type { PlayerId } from '@/types/playerId';
import type { PlayerState, PlayersState } from '@/types/player';
import { clampTileNumber } from '@/game/engines/playerEngine';

export type CollisionResult = {
  players: PlayersState;
  bumpedPlayerId: PlayerId;
  bumpedFrom: number;
  bumpedTo: number;
};

/**
 * If another player occupies the landing tile, bump them back 2 tiles.
 * Only one collision resolved per landing.
 */
export function resolveCollision(
  players: PlayersState,
  landingPlayerId: PlayerId,
  landingTile: number,
): CollisionResult | null {
  const occupant = Object.values(players).find(
    (player) =>
      player.id !== landingPlayerId && player.position === landingTile,
  );

  if (!occupant) {
    return null;
  }

  const bumpedTo = clampTileNumber(occupant.position - COLLISION_BUMP_TILES);

  return {
    players: {
      ...players,
      [occupant.id]: { ...occupant, position: bumpedTo },
    },
    bumpedPlayerId: occupant.id,
    bumpedFrom: occupant.position,
    bumpedTo,
  };
}

export function getPlayersOnTile(
  players: PlayersState,
  tileNumber: number,
): PlayerState[] {
  return Object.values(players).filter(
    (player) => player.position === tileNumber,
  );
}
