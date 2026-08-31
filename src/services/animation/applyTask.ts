import type { AnimationState, AnimationTask } from '@/types/animation';
import type { PlayerId } from '@/types/playerId';
import type {
  BoardstormTaskPayload,
  CollisionTaskPayload,
  MoveTaskPayload,
  RollTaskPayload,
  TileEffectTaskPayload,
} from '@/services/animation/payloads';
import { defaultAnimationState } from '@/store/defaults';

function withClearedMotions(animation: AnimationState): AnimationState {
  return { ...animation, playerMotions: {} };
}

export function applyAnimationTask(
  animation: AnimationState,
  task: AnimationTask,
): AnimationState {
  const base = withClearedMotions(animation);

  switch (task.type) {
    case 'roll': {
      const { playerId } = task.payload as RollTaskPayload;
      return {
        ...base,
        current: task,
        rollingPlayerId: playerId,
      };
    }

    case 'move': {
      const { playerId, tileNumber } = task.payload as MoveTaskPayload;
      return {
        ...base,
        current: task,
        visualPositions: {
          ...base.visualPositions,
          [playerId]: tileNumber,
        },
      };
    }

    case 'trap':
    case 'boost':
    case 'mystery': {
      const { playerId, tileNumber, effect } =
        task.payload as TileEffectTaskPayload;
      return {
        ...base,
        current: task,
        activeTileEffect:
          tileNumber > 0 ? { tileNumber, effect } : null,
        playerMotions: {
          ...base.playerMotions,
          [playerId]: effect === 'mystery' ? 'mystery' : effect,
        },
      };
    }

    case 'collision': {
      const { playerId, to } = task.payload as CollisionTaskPayload;
      return {
        ...base,
        current: task,
        visualPositions: {
          ...base.visualPositions,
          [playerId]: to,
        },
        playerMotions: {
          ...base.playerMotions,
          [playerId]: 'trap',
        },
      };
    }

    case 'boardstorm': {
      const { mutatedTileNumbers } = task.payload as BoardstormTaskPayload;
      return {
        ...base,
        current: task,
        boardRumbling: true,
        mutatingTileNumbers: mutatedTileNumbers,
      };
    }

    case 'victory': {
      return {
        ...base,
        current: task,
      };
    }

    case 'power': {
      return {
        ...base,
        current: task,
      };
    }

    default:
      return {
        ...base,
        current: task,
      };
  }
}

export function clearAnimationTask(
  animation: AnimationState,
  task: AnimationTask,
): AnimationState {
  const next: AnimationState = {
    ...animation,
    current: null,
    playerMotions: {},
    activeTileEffect: null,
    boardRumbling: false,
    mutatingTileNumbers: [],
    rollingPlayerId: null,
    visualPositions: { ...animation.visualPositions },
  };

  if (task.type === 'move') {
    const { playerId, clearVisualAfter } = task.payload as MoveTaskPayload;
    if (clearVisualAfter) {
      next.visualPositions[playerId] = null;
    }
  }

  if (task.type === 'collision') {
    const { playerId } = task.payload as CollisionTaskPayload;
    next.visualPositions[playerId] = null;
  }

  return next;
}

export function resetAnimationVisuals(): AnimationState {
  return defaultAnimationState();
}

export function getDisplayPosition(
  playerId: PlayerId,
  actualPosition: number,
  visualPositions: Record<PlayerId, number | null>,
): number {
  const visual = visualPositions[playerId];
  return visual ?? actualPosition;
}
