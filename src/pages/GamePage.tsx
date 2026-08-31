import { useCallback, useMemo, useState } from 'react';
import { GameBoard } from '@/components/board/GameBoard';
import { PlayerDicePanel } from '@/components/dice/PlayerDicePanel';
import { BoardMoodReveal } from '@/components/game/BoardMoodReveal';
import { TileResolutionBanner } from '@/components/game/TileResolutionBanner';
import { TurnHud } from '@/components/game/TurnHud';
import type { BoardMood } from '@/types/boardMood';
import { INITIAL_PLAYERS, type Player } from '@/types/player';
import type { BoardTile } from '@/types/tile';
import type { DieType } from '@/types/dice';
import { pickRandomBoardMood } from '@/utils/boardMood';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';
import { playDiceRollAnimation } from '@/utils/diceRollAnimation';
import { rollDie } from '@/utils/dice';
import {
  animatePlayerToPosition,
  calculateTargetPosition,
} from '@/utils/playerMovement';
import { generateBoard } from '@/utils/tileGeneration';
import { resolveTileLanding } from '@/utils/tileResolution';
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
  const [gamePhase, setGamePhase] = useState<GamePhase>('mood-reveal');
  const [boardMood] = useState<BoardMood>(() => pickRandomBoardMood());
  const [boardTiles, setBoardTiles] = useState<BoardTile[] | null>(null);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [turnState, setTurnState] = useState(INITIAL_TURN_STATE);
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

  const isBusy = activePlayerId !== null;
  const currentPlayerId = getCurrentPlayerId(turnState);

  const currentPlayer = useMemo(
    () => players.find((player) => player.id === currentPlayerId)!,
    [players, currentPlayerId],
  );

  /** Generates the board using the revealed mood and begins play. */
  const handleStartGame = useCallback(() => {
    setBoardTiles(generateBoard(boardMood));
    setGamePhase('playing');
  }, [boardMood]);

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

  /**
   * Applies tile resolution side-effects (power grant, mystery tracking)
   * and animates any resulting position change.
   */
  const applyTileResolution = useCallback(
    async (
      playerId: number,
      landingPosition: number,
      board: BoardTile[],
    ) => {
      const player = players.find((entry) => entry.id === playerId);
      if (!player) {
        return;
      }

      const landedTile = board.find((tile) => tile.number === landingPosition);
      if (!landedTile) {
        return;
      }

      const resolution = resolveTileLanding({
        tile: landedTile,
        landingPosition,
        player,
        boardTiles: board,
        boardMood,
      });

      setResolutionMessage(resolution.message);

      setPlayers((current) =>
        current.map((entry) => {
          if (entry.id !== playerId) {
            return entry;
          }

          return {
            ...entry,
            activePower: resolution.grantedPower ?? entry.activePower,
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
    },
    [boardMood, players, updatePlayerPosition],
  );

  /**
   * Rolls the chosen die for the current player, plays the roll animation,
   * moves the token, then resolves the landed tile effect.
   */
  const handleRoll = useCallback(
    async (playerId: number) => {
      if (isBusy || !isPlayersTurn(turnState, playerId) || !boardTiles) {
        return;
      }

      const player = players.find((entry) => entry.id === playerId);
      if (!player) {
        return;
      }

      const dieType = selectedDice[playerId] ?? 'safe';
      const rollResult = rollDie(dieType);
      const landingPosition = calculateTargetPosition(
        player.position,
        rollResult,
        BOARD_TILE_COUNT,
      );

      setActivePlayerId(playerId);
      setCanEndTurn(false);
      setResolutionMessage(null);
      setDisplayValues((current) => ({ ...current, [playerId]: null }));

      await playDiceRollAnimation(dieType, rollResult, (value) => {
        setDisplayValues((current) => ({ ...current, [playerId]: value }));
      });

      setLastRolls((current) => ({ ...current, [playerId]: rollResult }));

      if (landingPosition !== player.position) {
        await animatePlayerToPosition(
          player.position,
          landingPosition,
          (position) => updatePlayerPosition(playerId, position),
        );
      }

      await applyTileResolution(playerId, landingPosition, boardTiles);

      setActivePlayerId(null);
      setCanEndTurn(true);
    },
    [
      applyTileResolution,
      boardTiles,
      isBusy,
      players,
      selectedDice,
      turnState,
      updatePlayerPosition,
    ],
  );

  /** Ends the current player's turn and passes play to the next player. */
  const handleEndTurn = useCallback(() => {
    if (!canEndTurn || isBusy) {
      return;
    }

    setCanEndTurn(false);
    setResolutionMessage(null);
    setTurnState((current) => advanceTurn(current));
  }, [canEndTurn, isBusy]);

  if (gamePhase === 'mood-reveal') {
    return <BoardMoodReveal mood={boardMood} onStart={handleStartGame} />;
  }

  if (!boardTiles) {
    return null;
  }

  return (
    <section className="flex flex-col items-center gap-6 py-4">
      <h1 className="text-2xl font-bold sm:text-3xl">Game Board</h1>
      <TurnHud
        round={turnState.round}
        currentPlayer={currentPlayer}
        boardMood={boardMood}
      />
      <TileResolutionBanner message={resolutionMessage} />
      <GameBoard players={players} tiles={boardTiles} />
      <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {players.map((player) => (
          <PlayerDicePanel
            key={player.id}
            player={player}
            selectedDie={selectedDice[player.id] ?? 'safe'}
            displayValue={displayValues[player.id] ?? null}
            lastRoll={lastRolls[player.id] ?? null}
            isRolling={activePlayerId === player.id}
            isCurrentTurn={player.id === currentPlayerId}
            canEndTurn={canEndTurn && player.id === currentPlayerId}
            isDisabled={isBusy}
            onSelectDie={(dieType) =>
              setSelectedDice((current) => ({
                ...current,
                [player.id]: dieType,
              }))
            }
            onRoll={() => handleRoll(player.id)}
            onEndTurn={handleEndTurn}
          />
        ))}
      </div>
    </section>
  );
}
