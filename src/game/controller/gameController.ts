import { BOARD_MOODS, POWER_LABELS } from '@/constants/gameplay';
import type { GameMode } from '@/types/match';
import type { DieType } from '@/types/dice';
import type { PowerAction } from '@/types/power';
import type { PlayerId } from '@/types/playerId';
import type { PlayerState } from '@/types/player';
import type { GameStoreState } from '@/store/gameStore';
import { useGameStore } from '@/store/gameStore';
import { generateBoard, pickRandomBoardMood } from '@/game/engines/boardEngine';
import { applyBoardstorm } from '@/game/engines/boardstormEngine';
import { resolveCollision } from '@/game/engines/collisionEngine';
import { rollDie } from '@/game/engines/diceEngine';
import {
  getForwardMovementPath,
  isWinningPosition,
} from '@/game/engines/playerEngine';
import { createPlayersForMode } from '@/game/engines/playerSpawn';
import {
  canActivatePower,
  createPowerMeta,
  isPassivePower,
} from '@/game/engines/powerEngine';
import {
  clampTeleportTarget,
  getPeekTiles,
  getSabotagePosition,
  resolveTileLanding,
} from '@/game/engines/tileEngine';
import {
  advanceTurn,
  createInitialTurnState,
  getCurrentPlayerId,
} from '@/game/engines/turnEngine';
import { createGameEvent } from '@/game/events/createEvent';
import type {
  BoardstormPayload,
  CollisionPayload,
  DiceRolledPayload,
  MatchStartedPayload,
  PlayerMovedPayload,
  PowerGrantedPayload,
  PowerUsedPayload,
  RoundCompletedPayload,
  TileResolvedPayload,
  TurnEndedPayload,
  WinnerPayload,
} from '@/game/events/payloads';
import {
  validateCanRoll,
  validatePlayerTurn,
} from '@/game/controller/validation';

function getStore(): GameStoreState {
  return useGameStore.getState();
}

function emit(type: Parameters<typeof createGameEvent>[0], payload: unknown) {
  getStore().appendEvent(createGameEvent(type, payload));
}

function defaultDiceSelection(playerIds: PlayerId[]): Record<PlayerId, DieType> {
  return Object.fromEntries(playerIds.map((id) => [id, 'safe' as DieType]));
}

function applyPlayerUpdate(playerId: PlayerId, patch: Partial<PlayerState>) {
  const store = getStore();
  const player = store.players[playerId];
  if (!player) {
    return;
  }
  store.setPlayer(playerId, { ...player, ...patch });
}

function declareWinner(playerId: PlayerId) {
  const store = getStore();
  const now = Date.now();
  store.setMatch({
    ...store.match,
    status: 'finished',
    winnerId: playerId,
    finishedAt: now,
  });
  emit('winner_found', { playerId } satisfies WinnerPayload);
  emit('match_finished', { playerId } satisfies WinnerPayload);
  store.setUI({
    ...store.ui,
    activeModal: 'victory',
    canEndTurn: false,
    resolutionMessage: `${store.players[playerId]?.name ?? 'Player'} wins!`,
  });
}

function runBoardstorm() {
  const store = getStore();
  emit('boardstorm_started', { round: store.turn.round });

  const { tiles, mutatedTileNumbers } = applyBoardstorm(
    store.board.tiles,
    store.match.boardMood,
  );

  const boardstormCount = store.board.boardstormCount + 1;
  store.setBoard({ tiles, boardstormCount });

  emit('boardstorm_finished', {
    mutatedTileNumbers,
    boardstormCount,
  } satisfies BoardstormPayload);

  store.setUI({
    ...store.ui,
    resolutionMessage: `Boardstorm! ${mutatedTileNumbers.length} tiles changed.`,
  });
}

function resolveRollForPlayer(playerId: PlayerId): void {
  const store = getStore();
  const player = store.players[playerId];
  if (!player) {
    return;
  }

  const dieType = store.dice.selected[playerId] ?? 'safe';
  const rollValue = rollDie(dieType);
  const from = player.position;
  const path = getForwardMovementPath(from, rollValue);
  const landingPosition = path.length > 0 ? path[path.length - 1] : from;

  store.setDice({
    ...store.dice,
    lastRoll: { ...store.dice.lastRoll, [playerId]: rollValue },
    rollingPlayerId: null,
  });

  emit('dice_rolled', {
    playerId,
    dieType,
    value: rollValue,
  } satisfies DiceRolledPayload);

  applyPlayerUpdate(playerId, { position: landingPosition });

  emit('player_moved', {
    playerId,
    from,
    to: landingPosition,
    path,
  } satisfies PlayerMovedPayload);

  let players = { ...store.players, [playerId]: { ...player, position: landingPosition } };

  const collision = resolveCollision(players, playerId, landingPosition);
  if (collision) {
    players = collision.players;
    store.setPlayers(players);
    emit('player_collision', {
      landingPlayerId: playerId,
      bumpedPlayerId: collision.bumpedPlayerId,
      from: collision.bumpedFrom,
      to: collision.bumpedTo,
    } satisfies CollisionPayload);
  }

  const currentPlayer = players[playerId]!;
  const tile =
    store.board.tiles.find((t) => t.number === landingPosition) ?? null;

  if (!tile) {
    store.setUI({ ...store.ui, canEndTurn: true });
    return;
  }

  const shieldDisabled = dieType === 'risk';
  const doubleBoostActive = currentPlayer.activePower === 'doubleBoost';

  const resolution = resolveTileLanding({
    tile,
    landingPosition,
    player: currentPlayer,
    boardTiles: store.board.tiles,
    boardMood: store.match.boardMood,
    shieldDisabled,
    doubleBoostActive,
  });

  let nextPower = currentPlayer.activePower;
  if (resolution.powerConsumed && nextPower) {
    nextPower = null;
  }
  if (resolution.grantedPower) {
    nextPower = resolution.grantedPower;
    emit('power_granted', {
      playerId,
      power: resolution.grantedPower,
    } satisfies PowerGrantedPayload);
    store.setPowers({
      meta: {
        ...store.powers.meta,
        [playerId]: createPowerMeta(
          resolution.grantedPower,
          store.turn.round,
        ),
      },
    });
  }

  applyPlayerUpdate(playerId, {
    position: resolution.finalPosition,
    activePower: nextPower,
    lastMysteryTile: resolution.lastMysteryTile ?? currentPlayer.lastMysteryTile,
  });

  if (resolution.finalPosition !== landingPosition) {
    emit('player_moved', {
      playerId,
      from: landingPosition,
      to: resolution.finalPosition,
      path: resolution.movementPath,
    } satisfies PlayerMovedPayload);
  }

  const tileResolved = {
    playerId,
    tileNumber: landingPosition,
    tileType: tile.type,
    message: resolution.message,
  } satisfies TileResolvedPayload;

  if (tile.type === 'trap') {
    emit('trap_triggered', tileResolved);
  } else if (tile.type === 'boost') {
    emit('boost_triggered', tileResolved);
  }

  store.setUI({
    ...store.ui,
    resolutionMessage: resolution.message,
    canEndTurn: true,
  });

  if (isWinningPosition(resolution.finalPosition)) {
    declareWinner(playerId);
  }
}

export const gameController = {
  /** New match — mood reveal screen (board not generated yet). */
  startMatch(mode: GameMode) {
    const store = getStore();
    store.resetMatch();

    const boardMood = pickRandomBoardMood(BOARD_MOODS);
    const matchId = crypto.randomUUID();

    store.setMatch({
      id: matchId,
      status: 'moodReveal',
      mode,
      boardMood,
      winnerId: null,
      createdAt: Date.now(),
      finishedAt: null,
    });

    store.setAI({
      enabled: mode === 'solo',
      difficulty: 'normal',
    });
  },

  /** After mood reveal — generate board and begin play. */
  beginPlay() {
    const store = getStore();
    if (store.match.status !== 'moodReveal') {
      return;
    }

    const players = createPlayersForMode(store.match.mode);
    const playerIds = Object.keys(players).map(Number) as PlayerId[];
    const tiles = generateBoard(store.match.boardMood);
    const turn = createInitialTurnState(playerIds);

    store.setBoard({ tiles, boardstormCount: 0 });
    store.setPlayers(players);
    store.setTurn(turn);
    store.setDice({
      selected: defaultDiceSelection(playerIds),
      lastRoll: Object.fromEntries(playerIds.map((id) => [id, null])),
      rollingPlayerId: null,
    });
    store.setMatch({ ...store.match, status: 'playing' });
    store.setUI({ ...store.ui, resolutionMessage: null, canEndTurn: false });

    emit('match_started', {
      matchId: store.match.id,
      mode: store.match.mode,
      boardMood: store.match.boardMood,
    } satisfies MatchStartedPayload);
  },

  restart(mode?: GameMode) {
    const currentMode = mode ?? getStore().match.mode;
    gameController.startMatch(currentMode);
  },

  selectDie(playerId: PlayerId, dieType: DieType) {
    const store = getStore();
    const validation = validatePlayerTurn(store, playerId);
    if (!validation.ok) {
      return validation;
    }

    if (store.ui.canEndTurn) {
      return { ok: false, reason: 'Cannot change die after rolling.' };
    }

    store.setDice({
      ...store.dice,
      selected: { ...store.dice.selected, [playerId]: dieType },
    });

    return { ok: true };
  },

  roll(playerId: PlayerId) {
    const store = getStore();
    const turnCheck = validatePlayerTurn(store, playerId);
    if (!turnCheck.ok) {
      return turnCheck;
    }

    const rollCheck = validateCanRoll(store);
    if (!rollCheck.ok) {
      return rollCheck;
    }

    store.setDice({ ...store.dice, rollingPlayerId: playerId });
    resolveRollForPlayer(playerId);

    return { ok: true };
  },

  usePower(playerId: PlayerId, action: PowerAction) {
    const store = getStore();
    const validation = validatePlayerTurn(store, playerId);
    if (!validation.ok) {
      return validation;
    }

    const player = store.players[playerId];
    if (!player?.activePower) {
      return { ok: false, reason: 'No power to use.' };
    }

    if (!canActivatePower(player.activePower)) {
      return { ok: false, reason: 'This power activates automatically.' };
    }

    if (action.type !== player.activePower) {
      return { ok: false, reason: 'Invalid power action.' };
    }

    if (action.type === 'luckyRoll') {
      if (!store.ui.canEndTurn) {
        return { ok: false, reason: 'Roll first before using Lucky Roll.' };
      }

      applyPlayerUpdate(playerId, { activePower: null });
      emit('power_used', {
        playerId,
        power: 'luckyRoll',
      } satisfies PowerUsedPayload);

      store.setUI({ ...store.ui, canEndTurn: false, resolutionMessage: null });
      store.setDice({
        ...store.dice,
        lastRoll: { ...store.dice.lastRoll, [playerId]: null },
        rollingPlayerId: playerId,
      });
      resolveRollForPlayer(playerId);

      return { ok: true };
    }

    if (action.type === 'peek') {
      const peekTiles = getPeekTiles(player.position, store.board.tiles);
      const labels = peekTiles
        .map((tile) => `${tile.number} (${tile.type})`)
        .join(', ');
      store.setUI({
        ...store.ui,
        resolutionMessage: labels
          ? `Peek: ${labels}`
          : 'Peek: nothing ahead.',
      });
      applyPlayerUpdate(playerId, { activePower: null });
      emit('power_used', { playerId, power: 'peek' } satisfies PowerUsedPayload);
      return { ok: true };
    }

    if (action.type === 'teleport') {
      const target = clampTeleportTarget(player.position, action.targetTile);
      applyPlayerUpdate(playerId, {
        position: target,
        activePower: null,
      });
      emit('player_moved', {
        playerId,
        from: player.position,
        to: target,
        path: [target],
      } satisfies PlayerMovedPayload);
      emit('power_used', {
        playerId,
        power: 'teleport',
        targetTile: target,
      } satisfies PowerUsedPayload);

      if (isWinningPosition(target)) {
        declareWinner(playerId);
      }

      return { ok: true };
    }

    if (action.type === 'sabotage') {
      const target = store.players[action.targetPlayerId];
      if (!target) {
        return { ok: false, reason: 'Invalid target player.' };
      }

      const newPosition = getSabotagePosition(target.position);
      store.setPlayer(action.targetPlayerId, {
        ...target,
        position: newPosition,
      });

      applyPlayerUpdate(playerId, { activePower: null });

      emit('player_moved', {
        playerId: action.targetPlayerId,
        from: target.position,
        to: newPosition,
        path: [newPosition],
      } satisfies PlayerMovedPayload);
      emit('power_used', {
        playerId,
        power: 'sabotage',
        targetPlayerId: action.targetPlayerId,
      } satisfies PowerUsedPayload);

      return { ok: true };
    }

    return { ok: false, reason: 'Unknown power.' };
  },

  endTurn(playerId: PlayerId) {
    const store = getStore();
    const validation = validatePlayerTurn(store, playerId);
    if (!validation.ok) {
      return validation;
    }

    if (!store.ui.canEndTurn) {
      return { ok: false, reason: 'Roll before ending turn.' };
    }

    const { turn, roundCompleted, shouldBoardstorm } = advanceTurn(store.turn);

    emit('turn_ended', {
      playerId,
      nextPlayerId: getCurrentPlayerId(turn),
    } satisfies TurnEndedPayload);

    if (roundCompleted) {
      emit('round_completed', {
        round: store.turn.round,
      } satisfies RoundCompletedPayload);
    }

    store.setTurn(turn);
    store.setDice({
      ...store.dice,
      lastRoll: { ...store.dice.lastRoll, [playerId]: null },
      rollingPlayerId: null,
    });
    store.setUI({
      ...store.ui,
      canEndTurn: false,
      resolutionMessage: null,
    });

    if (shouldBoardstorm) {
      runBoardstorm();
    }

    return { ok: true };
  },

  /** Whether a power shows a Use button in UI */
  isPowerActivatable(power: PlayerState['activePower']) {
    return power !== null && !isPassivePower(power);
  },

  getPowerLabel(power: NonNullable<PlayerState['activePower']>) {
    return POWER_LABELS[power];
  },
};

export type GameController = typeof gameController;
