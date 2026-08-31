import { GameBoard } from '@/components/board';
import {
  BoardMoodReveal,
  MatchSetup,
  PlayerDicePanel,
  PlayerList,
  TileResolutionBanner,
  TurnHud,
  VictoryModal,
  useGhostTurn,
} from '@/components/game';
import { useGameStore } from '@/hooks/useGameStore';

export function GamePage() {
  useGhostTurn();

  const status = useGameStore((state) => state.match.status);

  if (status === 'idle') {
    return <MatchSetup />;
  }

  if (status === 'moodReveal') {
    return <BoardMoodReveal />;
  }

  return (
    <section className="flex flex-col gap-4 pb-8">
      <TurnHud />
      <TileResolutionBanner />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex flex-1 justify-center lg:min-w-0">
          <GameBoard className="w-full" />
        </div>

        <aside className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
          <PlayerList />
          <PlayerDicePanel />
        </aside>
      </div>

      <VictoryModal />
    </section>
  );
}
