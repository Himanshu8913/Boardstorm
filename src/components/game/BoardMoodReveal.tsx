import type { BoardMood } from '@/types/boardMood';
import { getMoodConfig } from '@/utils/boardMood';

type BoardMoodRevealProps = {
  mood: BoardMood;
  onStart: () => void;
};

/** Pre-game screen that reveals the randomly assigned board mood. */
export function BoardMoodReveal({ mood, onStart }: BoardMoodRevealProps) {
  const config = getMoodConfig(mood);

  return (
    <section className="flex flex-col items-center gap-8 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-6xl" role="img" aria-hidden="true">
          {config.emoji}
        </span>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {config.tagline} {config.emoji}
        </h1>
        <p className="max-w-md text-lg text-boardstorm-muted">
          {config.description}
        </p>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="rounded-xl bg-boardstorm-accent px-10 py-3 text-lg font-semibold text-boardstorm-bg transition-opacity hover:opacity-90"
      >
        Start Game
      </button>
    </section>
  );
}
