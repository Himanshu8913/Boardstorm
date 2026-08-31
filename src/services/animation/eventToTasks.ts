import type { GameEvent } from '@/types/event';
import type { AnimationTask } from '@/types/animation';
import type {
  BoardstormPayload,
  CollisionPayload,
  DiceRolledPayload,
  PlayerMovedPayload,
  PowerGrantedPayload,
  TileResolvedPayload,
  WinnerPayload,
} from '@/game/events/payloads';
import { ANIMATION_TIMING } from '@/services/animation/timing';

function isTeleportMove(payload: PlayerMovedPayload): boolean {
  return payload.path.length === 1 && Math.abs(payload.to - payload.from) > 1;
}

export function eventToAnimationTasks(event: GameEvent): AnimationTask[] {
  switch (event.type) {
    case 'dice_rolled': {
      const payload = event.payload as DiceRolledPayload;
      return [
        {
          id: `${event.id}-roll`,
          type: 'roll',
          durationMs: ANIMATION_TIMING.diceRoll,
          payload: { playerId: payload.playerId },
        },
      ];
    }

    case 'player_moved': {
      const payload = event.payload as PlayerMovedPayload;
      if (payload.path.length === 0) {
        return [];
      }

      const stepDuration = isTeleportMove(payload)
        ? ANIMATION_TIMING.teleportHop
        : ANIMATION_TIMING.tileStep;

      return payload.path.map((tileNumber, stepIndex) => ({
        id: `${event.id}-move-${stepIndex}`,
        type: 'move',
        durationMs: stepDuration,
        payload: {
          playerId: payload.playerId,
          tileNumber,
          stepIndex,
          totalSteps: payload.path.length,
          clearVisualAfter: stepIndex === payload.path.length - 1,
        },
      }));
    }

    case 'trap_triggered': {
      const payload = event.payload as TileResolvedPayload;
      return [
        {
          id: `${event.id}-trap`,
          type: 'trap',
          durationMs: ANIMATION_TIMING.trap,
          payload: {
            playerId: payload.playerId,
            tileNumber: payload.tileNumber,
            effect: 'trap',
          },
        },
      ];
    }

    case 'boost_triggered': {
      const payload = event.payload as TileResolvedPayload;
      return [
        {
          id: `${event.id}-boost`,
          type: 'boost',
          durationMs: ANIMATION_TIMING.boost,
          payload: {
            playerId: payload.playerId,
            tileNumber: payload.tileNumber,
            effect: 'boost',
          },
        },
      ];
    }

    case 'power_granted': {
      const payload = event.payload as PowerGrantedPayload;
      return [
        {
          id: `${event.id}-mystery`,
          type: 'mystery',
          durationMs: ANIMATION_TIMING.mystery,
          payload: {
            playerId: payload.playerId,
            tileNumber: 0,
            effect: 'mystery',
          },
        },
      ];
    }

    case 'player_collision': {
      const payload = event.payload as CollisionPayload;
      return [
        {
          id: `${event.id}-collision`,
          type: 'collision',
          durationMs: ANIMATION_TIMING.collision,
          payload: {
            playerId: payload.bumpedPlayerId,
            from: payload.from,
            to: payload.to,
          },
        },
      ];
    }

    case 'boardstorm_finished': {
      const payload = event.payload as BoardstormPayload;
      return [
        {
          id: `${event.id}-boardstorm`,
          type: 'boardstorm',
          durationMs: ANIMATION_TIMING.boardstorm,
          payload: {
            mutatedTileNumbers: payload.mutatedTileNumbers,
          },
        },
      ];
    }

    case 'winner_found': {
      const payload = event.payload as WinnerPayload;
      return [
        {
          id: `${event.id}-victory`,
          type: 'victory',
          durationMs: ANIMATION_TIMING.victory,
          payload: { playerId: payload.playerId },
        },
      ];
    }

    default:
      return [];
  }
}

export function eventsToAnimationTasks(events: GameEvent[]): AnimationTask[] {
  return events.flatMap((event) => eventToAnimationTasks(event));
}
