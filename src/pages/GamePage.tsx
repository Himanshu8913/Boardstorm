import { useCallback, useMemo, useState } from 'react';
import { GameBoard } from '@/components/board/GameBoard';
import { PlayerDicePanel } from '@/components/dice/PlayerDicePanel';
import { TurnHud } from '@/components/game/TurnHud';
import { DEFAULT_BOARD_MOOD } from '@/types/boardMood';
import { INITIAL_PLAYERS, type Player } from '@/types/player';
import type { DieType } from '@/types/dice';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';
import { playDiceRollAnimation } from '@/utils/diceRollAnimation';
import { rollDie } from '@/utils/dice';
import {
  animatePlayerToPosition,
  calculateTargetPosition,
} from '@/utils/playerMovement';
import { generateBoard } from '@/utils/tileGeneration';
import {
  advanceTurn,
  createInitialTurnState,
  getCurrentPlayerId,
  isPlayersTurn,
} from '@/utils/turnManager';

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
  const [boardTiles] = useState(() => generateBoard(DEFAULT_BOARD_MOOD));
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

  const isBusy = activePlayerId !== null;
  const currentPlayerId = getCurrentPlayerId(turnState);

  const currentPlayer = useMemo(
    () => players.find((player) => player.id === currentPlayerId)!,
    [players, currentPlayerId],
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

  /**
   * Rolls the chosen die for the current player, plays the roll animation,
   * then moves the token forward by the rolled amount.
   */
  const handleRoll = useCallback(
    async (playerId: number) => {
      if (isBusy || !isPlayersTurn(turnState, playerId)) {
        return;
      }

      const player = players.find((entry) => entry.id === playerId);
      if (!player) {
        return;
      }

      const dieType = selectedDice[playerId] ?? 'safe';
      const rollResult = rollDie(dieType);
      const target = calculateTargetPosition(
        player.position,
        rollResult,
        BOARD_TILE_COUNT,
      );

      setActivePlayerId(playerId);
      setCanEndTurn(false);
      setDisplayValues((current) => ({ ...current, [playerId]: null }));

      await playDiceRollAnimation(dieType, rollResult, (value) => {
        setDisplayValues((current) => ({ ...current, [playerId]: value }));
      });

      setLastRolls((current) => ({ ...current, [playerId]: rollResult }));

      if (target !== player.position) {
        await animatePlayerToPosition(
          player.position,
          target,
          (position) => updatePlayerPosition(playerId, position),
        );
      }

      setActivePlayerId(null);
      setCanEndTurn(true);
    },
    [isBusy, players, selectedDice, turnState, updatePlayerPosition],
  );

  /** Ends the current player's turn and passes play to the next player. */
  const handleEndTurn = useCallback(() => {
    if (!canEndTurn || isBusy) {
      return;
    }

    setCanEndTurn(false);
    setTurnState((current) => advanceTurn(current));
  }, [canEndTurn, isBusy]);

  return (
    <section className="flex flex-col items-center gap-6 py-4">
      <h1 className="text-2xl font-bold sm:text-3xl">Game Board</h1>
      <TurnHud round={turnState.round} currentPlayer={currentPlayer} />
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
