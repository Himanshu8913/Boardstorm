import { useCallback, useState } from 'react';
import { GameBoard } from '@/components/board/GameBoard';
import { PlayerDicePanel } from '@/components/dice/PlayerDicePanel';
import { INITIAL_PLAYERS, type Player } from '@/types/player';
import type { DieType } from '@/types/dice';
import { BOARD_TILE_COUNT } from '@/utils/boardLayout';
import { playDiceRollAnimation } from '@/utils/diceRollAnimation';
import { rollDie } from '@/utils/dice';
import {
  animatePlayerToPosition,
  calculateTargetPosition,
} from '@/utils/playerMovement';

const DEFAULT_DICE: Record<number, DieType> = {
  1: 'safe',
  2: 'safe',
  3: 'safe',
  4: 'safe',
};

export function GamePage() {
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [selectedDice, setSelectedDice] =
    useState<Record<number, DieType>>(DEFAULT_DICE);
  const [displayValues, setDisplayValues] = useState<
    Record<number, number | null>
  >({});
  const [lastRolls, setLastRolls] = useState<Record<number, number | null>>({});
  const [activePlayerId, setActivePlayerId] = useState<number | null>(null);

  const isBusy = activePlayerId !== null;

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
   * Rolls the chosen die for a player, plays the roll animation,
   * then moves the token forward by the rolled amount.
   */
  const handleRoll = useCallback(
    async (playerId: number) => {
      if (isBusy) {
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
    },
    [isBusy, players, selectedDice, updatePlayerPosition],
  );

  return (
    <section className="flex flex-col items-center gap-6 py-4">
      <h1 className="text-2xl font-bold sm:text-3xl">Game Board</h1>
      <GameBoard players={players} />
      <div className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {players.map((player) => (
          <PlayerDicePanel
            key={player.id}
            player={player}
            selectedDie={selectedDice[player.id] ?? 'safe'}
            displayValue={displayValues[player.id] ?? null}
            lastRoll={lastRolls[player.id] ?? null}
            isRolling={activePlayerId === player.id}
            isDisabled={isBusy}
            onSelectDie={(dieType) =>
              setSelectedDice((current) => ({
                ...current,
                [player.id]: dieType,
              }))
            }
            onRoll={() => handleRoll(player.id)}
          />
        ))}
      </div>
    </section>
  );
}
