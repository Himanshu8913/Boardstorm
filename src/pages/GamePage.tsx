import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GameBoard } from '@/components/board/GameBoard';
import { PlayerDicePanel } from '@/components/dice/PlayerDicePanel';
import { BoardMoodReveal } from '@/components/game/BoardMoodReveal';
import { BoardstormOverlay } from '@/components/game/BoardstormOverlay';
import type { PowerAction } from '@/components/game/PowerUsePanel';
import { TileResolutionBanner } from '@/components/game/TileResolutionBanner';
import { TurnHud } from '@/components/game/TurnHud';
import { WinnerScreen } from '@/components/game/WinnerScreen';
import type { BoardMood } from '@/types/boardMood';
import type { GameMode } from '@/types/gameMode';
import type {
  ActiveTileEffect,
} from '@/types/animation';
import { createPlayers, INITIAL_PLAYERS, type Player } from '@/types/player';
import type { BoardTile } from '@/types/tile';
import type { TileType } from '@/types/tile';
import type { DieType } from '@/types/dice';
import { pickRandomBoardMood } from '@/utils/boardMood';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';
import { playDiceRollAnimation } from '@/utils/diceRollAnimation';
import { rollDie } from '@/utils/dice';
import {
  formatPeekMessage,
  getPeekTiles,
  getSabotagePosition,
} from '@/utils/powerEffects';
import {
  animateAlongPath,
  animatePlayerToPosition,
  getForwardMovementPath,
  isWinningPosition,
} from '@/utils/playerMovement';
import {
  appendMessage,
  formatCollisionMessage,
  getCollisionBumps,
} from '@/utils/playerCollision';
import { generateBoard } from '@/utils/tileGeneration';
import {
  applyBoardstorm,
  BOARDSTORM_ANIMATION,
  boardstormDelay,
  shouldTriggerBoardstorm,
} from '@/utils/boardstorm';
import { resolveTileLanding } from '@/utils/tileResolution';
import { scheduleAnimationClear } from '@/utils/gameAnimations';
import {
  GHOST_END_TURN_DELAY_MS,
  GHOST_TURN_DELAY_MS,
  pickGhostDie,
} from '@/utils/ghostAI';
import {
  advanceTurn,
  createInitialTurnState,
  getCurrentPlayerId,
  isPlayersTurn,
} from '@/utils/turnManager';

type GamePhase = 'mood-reveal' | 'playing';

const DEFAULT_DICE: Record<number, DieType> = {
  1: 'safe',
  2: 'safe',
  3: 'safe',
  4: 'safe',
};

const INITIAL_TURN_STATE = createInitialTurnState(
  INITIAL_PLAYERS.map((player) => player.id),
);

export function GamePage() {
  const location = useLocation();
  const [gameMode] = useState<GameMode>(
    () => (location.state as { mode?: GameMode })?.mode ?? 'multiplayer',
  );
  const [gamePhase, setGamePhase] = useState<GamePhase>('mood-reveal');
  const [boardMood, setBoardMood] = useState<BoardMood>(() =>
    pickRandomBoardMood(),
  );
  const [boardTiles, setBoardTiles] = useState<BoardTile[] | null>(null);
  const [players, setPlayers] = useState<Player[]>(() => createPlayers(gameMode));
  const [turnState, setTurnState] = useState(INITIAL_TURN_STATE);
  const [winner, setWinner] = useState<Player | null>(null);
  const [selectedDice, setSelectedDice] =
    useState<Record<number, DieType>>(DEFAULT_DICE);
  const [displayValues, setDisplayValues] = useState<
    Record<number, number | null>
  >({});
  const [lastRolls, setLastRolls] = useState<Record<number, number | null>>({});
  const [activePlayerId, setActivePlayerId] = useState<number | null>(null);
  const [canEndTurn, setCanEndTurn] = useState(false);
  const [resolutionMessage, setResolutionMessage] = useState<string | null>(
    null,
  );
  const [boardstormActive, setBoardstormActive] = useState(false);
  const [mutatingTiles, setMutatingTiles] = useState<number[]>([]);
  const [activeTileEffect, setActiveTileEffect] =
    useState<ActiveTileEffect | null>(null);
  const [playerMotions, setPlayerMotions] = useState<
    Map<number, 'boost' | 'trap' | 'mystery'>
  >(new Map());

  const isBusy = activePlayerId !== null || boardstormActive;
  const isGameOver = winner !== null;
  const currentPlayerId = getCurrentPlayerId(turnState);

  const currentPlayer = useMemo(
    () => players.find((player) => player.id === currentPlayerId)!,
    [players, currentPlayerId],
  );

  /** Generates the board using the revealed mood and begins play. */
  const handleStartGame = useCallback(() => {
    setBoardTiles(generateBoard(boardMood));
    setWinner(null);
    setGamePhase('playing');
  }, [boardMood]);

  /** Resets all game state and returns to the mood reveal screen. */
  const handleRestart = useCallback(() => {
    setBoardMood(pickRandomBoardMood());
    setBoardTiles(null);
    setPlayers(createPlayers(gameMode).map((player) => ({ ...player })));
    setTurnState(INITIAL_TURN_STATE);
    setSelectedDice(DEFAULT_DICE);
    setDisplayValues({});
    setLastRolls({});
    setActivePlayerId(null);
    setCanEndTurn(false);
    setResolutionMessage(null);
    setBoardstormActive(false);
    setMutatingTiles([]);
    setActiveTileEffect(null);
    setPlayerMotions(new Map());
    setWinner(null);
    setGamePhase('mood-reveal');
  }, [gameMode]);

  /**
   * Declares a winner if the player reached tile 100.
   *
   * @returns True if the game has ended
   */
  const declareWinnerIfNeeded = useCallback(
    (playerId: number, position: number): boolean => {
      if (!isWinningPosition(position, BOARD_TILE_COUNT)) {
        return false;
      }

      const player = players.find((entry) => entry.id === playerId);
      if (player) {
        setWinner(player);
        setResolutionMessage(`🎉 ${player.name} wins the game!`);
      }

      return true;
    },
    [players],
  );

  const updatePlayerPosition = useCallback(
    (playerId: number, position: number) => {
      setPlayers((current) =>
        current.map((player) =>
          player.id === playerId ? { ...player, position } : player,
        ),
      );
    },
    [],
  );

  const clearPlayerPower = useCallback((playerId: number) => {
    setPlayers((current) =>
      current.map((player) =>
        player.id === playerId ? { ...player, activePower: null } : player,
      ),
    );
  }, []);

  /**
   * Bumps any opponents on the landing tile back 2 spaces with animation.
   *
   * @returns Collision message if any opponents were bumped
   */
  const resolveLandingCollisions = useCallback(
    async (
      landingPlayerId: number,
      landingTile: number,
    ): Promise<string | null> => {
      const bumps = getCollisionBumps(landingPlayerId, landingTile, players);

      for (const bump of bumps) {
        if (bump.to !== bump.from) {
          await animatePlayerToPosition(bump.from, bump.to, (position) =>
            updatePlayerPosition(bump.playerId, position),
          );
        }
      }

      return formatCollisionMessage(bumps);
    },
    [players, updatePlayerPosition],
  );

  /**
   * Plays a tile effect animation on the board and player token.
   *
   * @param tileNumber - Tile where the effect occurs
   * @param effect - Tile type triggering the animation
   * @param playerId - Player who landed on the tile
   */
  const triggerTileAnimation = useCallback(
    (tileNumber: number, effect: TileType, playerId: number) => {
      if (effect === 'safe') {
        return;
      }

      setActiveTileEffect({ tileNumber, effect });
      setPlayerMotions(new Map([[playerId, effect]]));

      scheduleAnimationClear(() => {
        setActiveTileEffect(null);
        setPlayerMotions(new Map());
      });
    },
    [],
  );

  /**
   * Applies tile resolution side-effects (power grant, mystery tracking)
   * and animates any resulting position change.
   *
   * @returns The player's final tile after resolution movement
   */
  const applyTileResolution = useCallback(
    async (
      playerId: number,
      landingPosition: number,
      board: BoardTile[],
      shieldDisabled: boolean,
    ): Promise<number> => {
      const player = players.find((entry) => entry.id === playerId);
      if (!player) {
        return landingPosition;
      }

      const landedTile = board.find((tile) => tile.number === landingPosition);
      if (!landedTile) {
        return landingPosition;
      }

      triggerTileAnimation(landingPosition, landedTile.type, playerId);

      const resolution = resolveTileLanding({
        tile: landedTile,
        landingPosition,
        player,
        boardTiles: board,
        boardMood,
        shieldDisabled,
      });

      setResolutionMessage(resolution.message);

      setPlayers((current) =>
        current.map((entry) => {
          if (entry.id !== playerId) {
            return entry;
          }

          let activePower = entry.activePower;
          if (resolution.grantedPower) {
            activePower = resolution.grantedPower;
          } else if (resolution.powerConsumed) {
            activePower = null;
          }

          return {
            ...entry,
            activePower,
            lastMysteryTile:
              resolution.lastMysteryTile ?? entry.lastMysteryTile,
          };
        }),
      );

      if (resolution.finalPosition !== landingPosition) {
        await animatePlayerToPosition(
          landingPosition,
          resolution.finalPosition,
          (position) => updatePlayerPosition(playerId, position),
        );
      }

      return resolution.finalPosition;
    },
    [boardMood, players, triggerTileAnimation, updatePlayerPosition],
  );

  /**
   * Executes a full dice roll: animation, movement, and tile resolution.
   *
   * @returns True if the roll ended the game with a winner
   */
  const performRoll = useCallback(
    async (playerId: number): Promise<boolean> => {
      if (!boardTiles) {
        return false;
      }

      const player = players.find((entry) => entry.id === playerId);
      if (!player) {
        return false;
      }

      const dieType = selectedDice[playerId] ?? 'safe';
      const shieldDisabled = dieType === 'risk';
      const rollResult = rollDie(dieType);
      const movementPath = getForwardMovementPath(
        player.position,
        rollResult,
        BOARD_TILE_COUNT,
      );
      const landingPosition =
        movementPath.length > 0
          ? movementPath[movementPath.length - 1]
          : player.position;
      const overshot = player.position + rollResult > BOARD_TILE_COUNT;

      setActivePlayerId(playerId);
      setCanEndTurn(false);
      setResolutionMessage(null);
      setDisplayValues((current) => ({ ...current, [playerId]: null }));

      await playDiceRollAnimation(dieType, rollResult, (value) => {
        setDisplayValues((current) => ({ ...current, [playerId]: value }));
      });

      setLastRolls((current) => ({ ...current, [playerId]: rollResult }));

      if (movementPath.length > 0) {
        await animateAlongPath(movementPath, (position) =>
          updatePlayerPosition(playerId, position),
        );
      }

      let statusMessage: string | null = null;

      if (overshot && !isWinningPosition(landingPosition, BOARD_TILE_COUNT)) {
        statusMessage = appendMessage(
          statusMessage,
          `Bounce-back! Ended on tile ${landingPosition}.`,
        );
      }

      statusMessage = appendMessage(
        statusMessage,
        await resolveLandingCollisions(playerId, landingPosition),
      );

      const finalPosition = await applyTileResolution(
        playerId,
        landingPosition,
        boardTiles,
        shieldDisabled,
      );

      statusMessage = appendMessage(
        statusMessage,
        await resolveLandingCollisions(playerId, finalPosition),
      );

      if (statusMessage) {
        setResolutionMessage((current) => appendMessage(current, statusMessage));
      }

      setActivePlayerId(null);

      if (declareWinnerIfNeeded(playerId, finalPosition)) {
        return true;
      }

      setCanEndTurn(true);
      return false;
    },
    [
      applyTileResolution,
      boardTiles,
      declareWinnerIfNeeded,
      players,
      resolveLandingCollisions,
      selectedDice,
      updatePlayerPosition,
    ],
  );

  const handleRoll = useCallback(
    async (playerId: number) => {
      if (isBusy || isGameOver || !isPlayersTurn(turnState, playerId)) {
        return;
      }

      await performRoll(playerId);
    },
    [isBusy, isGameOver, performRoll, turnState],
  );

  /**
   * Activates the player's stored mystery power.
   */
  const handleUsePower = useCallback(
    async (playerId: number, action: PowerAction) => {
      if (isBusy || isGameOver || !isPlayersTurn(turnState, playerId) || !boardTiles) {
        return;
      }

      if (action.type === 'luckyRoll' && !canEndTurn) {
        return;
      }

      const player = players.find((entry) => entry.id === playerId);
      if (!player?.activePower) {
        return;
      }

      setActivePlayerId(playerId);

      if (action.type === 'luckyRoll') {
        clearPlayerPower(playerId);
        setResolutionMessage('Lucky Roll! Rolling again…');
        await performRoll(playerId);
        setActivePlayerId(null);
        return;
      }

      if (action.type === 'peek') {
        const peeked = getPeekTiles(player.position, boardTiles);
        setResolutionMessage(formatPeekMessage(peeked));
        clearPlayerPower(playerId);
        setActivePlayerId(null);
        return;
      }

      if (action.type === 'teleport') {
        const from = player.position;
        clearPlayerPower(playerId);
        setResolutionMessage(`Teleported to tile ${action.targetTile}!`);

        if (action.targetTile !== from) {
          await animatePlayerToPosition(from, action.targetTile, (position) =>
            updatePlayerPosition(playerId, position),
          );
        }

        let collisionMessage = await resolveLandingCollisions(
          playerId,
          action.targetTile,
        );
        setResolutionMessage((current) =>
          appendMessage(current, collisionMessage),
        );

        const finalPosition = await applyTileResolution(
          playerId,
          action.targetTile,
          boardTiles,
          false,
        );

        collisionMessage = await resolveLandingCollisions(
          playerId,
          finalPosition,
        );
        setResolutionMessage((current) =>
          appendMessage(current, collisionMessage),
        );

        if (declareWinnerIfNeeded(playerId, finalPosition)) {
          setActivePlayerId(null);
          return;
        }

        setActivePlayerId(null);
        return;
      }

      if (action.type === 'sabotage') {
        const target = players.find(
          (entry) => entry.id === action.targetPlayerId,
        );
        if (!target) {
          setActivePlayerId(null);
          return;
        }

        const newPosition = getSabotagePosition(target.position);
        clearPlayerPower(playerId);
        setResolutionMessage(
          `Sabotage! ${target.name} moved back to tile ${newPosition}.`,
        );

        if (newPosition !== target.position) {
          await animatePlayerToPosition(
            target.position,
            newPosition,
            (position) => updatePlayerPosition(target.id, position),
          );
        }

        const collisionMessage = await resolveLandingCollisions(
          target.id,
          newPosition,
        );
        setResolutionMessage((current) =>
          appendMessage(current, collisionMessage),
        );

        setActivePlayerId(null);
      }
    },
    [
      applyTileResolution,
      boardTiles,
      canEndTurn,
      clearPlayerPower,
      declareWinnerIfNeeded,
      isBusy,
      isGameOver,
      performRoll,
      players,
      resolveLandingCollisions,
      turnState,
      updatePlayerPosition,
    ],
  );

  /** Runs the Boardstorm animation and mutates ~10 tiles on the board. */
  const runBoardstorm = useCallback(async () => {
    if (!boardTiles) {
      return;
    }

    setBoardstormActive(true);
    setResolutionMessage('⚡ BOARDSTORM! The board is shifting…');

    await boardstormDelay(BOARDSTORM_ANIMATION.rumble);

    const { tiles, mutatedNumbers } = applyBoardstorm(boardTiles);
    setMutatingTiles(mutatedNumbers);

    await boardstormDelay(BOARDSTORM_ANIMATION.highlight);

    setBoardTiles(tiles);

    await boardstormDelay(BOARDSTORM_ANIMATION.settle);

    setMutatingTiles([]);
    setBoardstormActive(false);
    setResolutionMessage(
      `Boardstorm complete! ${mutatedNumbers.length} tiles mutated.`,
    );
  }, [boardTiles]);

  /** Ends the current player's turn and passes play to the next player. */
  const handleEndTurn = useCallback(async () => {
    if (!canEndTurn || isBusy || isGameOver) {
      return;
    }

    setCanEndTurn(false);
    setResolutionMessage(null);

    const previousRound = turnState.round;
    const nextTurn = advanceTurn(turnState);
    setTurnState(nextTurn);

    if (shouldTriggerBoardstorm(previousRound, nextTurn.round)) {
      await runBoardstorm();
    }
  }, [canEndTurn, isBusy, isGameOver, runBoardstorm, turnState]);

  const performRollRef = useRef(performRoll);
  const handleEndTurnRef = useRef(handleEndTurn);
  performRollRef.current = performRoll;
  handleEndTurnRef.current = handleEndTurn;

  /**
   * Automatically plays ghost turns in solo mode.
   */
  useEffect(() => {
    if (gamePhase !== 'playing' || isGameOver || !boardTiles) {
      return;
    }

    const current = players.find((player) => player.id === currentPlayerId);
    if (!current?.isGhost) {
      return;
    }

    const ghostId = current.id;
    let cancelled = false;

    const runGhostTurn = async () => {
      await boardstormDelay(GHOST_TURN_DELAY_MS);
      if (cancelled) {
        return;
      }

      const dieType = pickGhostDie();
      setSelectedDice((currentDice) => ({
        ...currentDice,
        [ghostId]: dieType,
      }));

      const won = await performRollRef.current(ghostId);
      if (cancelled || won) {
        return;
      }

      await boardstormDelay(GHOST_END_TURN_DELAY_MS);
      if (cancelled) {
        return;
      }

      await handleEndTurnRef.current();
    };

    void runGhostTurn();

    return () => {
      cancelled = true;
    };
    // Only re-run when the active player changes — not on every board update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayerId, gamePhase, isGameOver, boardTiles]);

  if (gamePhase === 'mood-reveal') {
    return <BoardMoodReveal mood={boardMood} onStart={handleStartGame} />;
  }

  if (!boardTiles) {
    return null;
  }

  return (
    <section className="flex flex-col items-center gap-6 py-4">
      <h1 className="text-2xl font-bold sm:text-3xl">
        {gameMode === 'solo' ? 'Solo Game' : 'Game Board'}
      </h1>
      <TurnHud
        round={turnState.round}
        currentPlayer={currentPlayer}
        boardMood={boardMood}
      />
      <TileResolutionBanner message={resolutionMessage} />
      <div className="relative w-full max-w-3xl">
        <GameBoard
          players={players}
          tiles={boardTiles}
          mutatingTiles={mutatingTiles}
          activeTileEffect={activeTileEffect}
          playerMotions={playerMotions}
          isRumbling={boardstormActive}
        />
        <BoardstormOverlay active={boardstormActive} />
      </div>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {players.map((player) => (
          <PlayerDicePanel
            key={player.id}
            player={player}
            allPlayers={players}
            selectedDie={selectedDice[player.id] ?? 'safe'}
            displayValue={displayValues[player.id] ?? null}
            lastRoll={lastRolls[player.id] ?? null}
            isRolling={activePlayerId === player.id}
            isCurrentTurn={player.id === currentPlayerId}
            canEndTurn={canEndTurn && player.id === currentPlayerId}
            isDisabled={isBusy || isGameOver}
            onSelectDie={(dieType) =>
              setSelectedDice((current) => ({
                ...current,
                [player.id]: dieType,
              }))
            }
            onRoll={() => handleRoll(player.id)}
            onEndTurn={handleEndTurn}
            onUsePower={(action) => handleUsePower(player.id, action)}
          />
        ))}
      </div>
      {winner && <WinnerScreen winner={winner} onRestart={handleRestart} />}
    </section>
  );
}
