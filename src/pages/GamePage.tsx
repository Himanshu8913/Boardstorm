import { GameBoard } from '@/components/board';
import {
  BoardMoodReveal,
  BoardstormOverlay,
  MatchSetup,
  MobileGameControls,
  PlayerDicePanel,
  PlayerList,
  TileResolutionBanner,
  TurnHud,
  WinnerScreen,
  useGhostTurn,
} from '@/components/game';
import { useAnimationQueue } from '@/hooks/useAnimationQueue';
import { useGameStore } from '@/hooks/useGameStore';

export function GamePage() {
  useGhostTurn();
  useAnimationQueue();

  const status = useGameStore((state) => state.match.status);

  if (status === 'idle') {
    return <MatchSetup />;
  }

  if (status === 'moodReveal') {
    return <BoardMoodReveal />;
  }

  return (
    <section className="game-screen flex flex-col gap-3 pb-[min(58vh,30rem)] sm:gap-4 lg:pb-8">
      <TurnHud />
      <TileResolutionBanner />

      <div className="game-screen__layout flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <div className="game-screen__board relative min-w-0 flex-1 lg:max-w-[70%]">
          <GameBoard className="w-full max-w-none" />
          <BoardstormOverlay />
        </div>

        <aside className="game-screen__sidebar hidden w-full flex-col gap-4 lg:flex lg:w-80 lg:shrink-0">
          <PlayerList />
          <PlayerDicePanel />
        </aside>
      </div>

      <MobileGameControls />
      <WinnerScreen />
    </section>
  );
}
