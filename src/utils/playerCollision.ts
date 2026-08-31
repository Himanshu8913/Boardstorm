import type { Player } from '@/types/player';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';
import { calculateTargetPosition } from '@/utils/playerMovement';

/** How many tiles an opponent is pushed back on collision. */
export const BUMP_BACK_STEPS = 2;

export type CollisionBump = {
  playerId: number;
  name: string;
  from: number;
  to: number;
};

/**
 * Finds opponents occupying the same tile as a landing player.
 *
 * @param landingPlayerId - Player who just moved onto the tile
 * @param landingTile - Tile number they landed on
 * @param players - Current player positions
 */
export function getCollisionBumps(
  landingPlayerId: number,
  landingTile: number,
  players: Player[],
): CollisionBump[] {
  return players
    .filter(
      (player) =>
        player.id !== landingPlayerId && player.position === landingTile,
    )
    .map((player) => ({
      playerId: player.id,
      name: player.name,
      from: player.position,
      to: calculateTargetPosition(
        player.position,
        -BUMP_BACK_STEPS,
        BOARD_TILE_COUNT,
      ),
    }));
}

/**
 * Builds a status message describing who was bumped.
 *
 * @param bumps - Opponents that were pushed back
 */
export function formatCollisionMessage(bumps: CollisionBump[]): string | null {
  if (bumps.length === 0) {
    return null;
  }

  if (bumps.length === 1) {
    const [bump] = bumps;
    return `${bump.name} was bumped back to tile ${bump.to}!`;
  }

  const names = bumps.map((bump) => bump.name).join(', ');
  return `${names} were bumped back ${BUMP_BACK_STEPS} tiles!`;
}

/**
 * Appends a collision message to an existing status message.
 *
 * @param existing - Current banner message (may be null)
 * @param collision - Collision message to append
 */
export function appendMessage(
  existing: string | null,
  collision: string | null,
): string | null {
  if (!collision) {
    return existing;
  }

  if (!existing) {
    return collision;
  }

  return `${existing} ${collision}`;
}
