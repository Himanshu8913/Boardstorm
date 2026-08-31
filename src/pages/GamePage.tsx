import { GameBoard } from '@/components/board/GameBoard';

export function GamePage() {
  return (
    <section className="flex flex-col items-center gap-6 py-4">
      <h1 className="text-2xl font-bold sm:text-3xl">Game Board</h1>
      <GameBoard />
    </section>
  );
}
