import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/Button';
import './winner-screen.css';

const CONFETTI_COUNT = 28;

type ConfettiPiece = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  color: string;
  size: string;
};

const confettiColors = [
  'var(--color-primary)',
  'var(--color-secondary)',
  'var(--color-success)',
  'var(--color-mystery)',
  'var(--color-danger)',
];

function buildConfetti(): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, index) => ({
    id: index,
    left: `${(index * 97) % 100}%`,
    delay: `${(index % 7) * 0.08}s`,
    duration: `${1.6 + (index % 5) * 0.15}s`,
    color: confettiColors[index % confettiColors.length] ?? confettiColors[0],
    size: `${8 + (index % 4) * 2}px`,
  }));
}

export function WinnerScreen() {
  const controller = useGameController();
  const isOpen = useGameStore((state) => state.ui.activeModal === 'victory');
  const winnerId = useGameStore((state) => state.match.winnerId);
  const winner = useGameStore((state) =>
    winnerId ? state.players[winnerId] : undefined,
  );
  const confetti = useMemo(() => buildConfetti(), []);

  if (!isOpen || !winner) {
    return null;
  }

  return (
    <div
      className="winner-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="winner-title"
    >
      <div className="winner-screen__backdrop" aria-hidden />

      <div className="winner-confetti" aria-hidden>
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className="winner-confetti__piece"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
            }}
          />
        ))}
      </div>

      <div className="winner-screen__panel animate-modal-in">
        <div className="winner-screen__trophy" aria-hidden>
          🏆
        </div>

        <span
          className="winner-screen__avatar"
          style={{ backgroundColor: winner.color }}
          aria-hidden
        >
          {winner.name.charAt(0).toUpperCase()}
        </span>

        <p className="winner-screen__eyebrow">Champion</p>
        <h2 id="winner-title" className="winner-screen__title">
          {winner.name} wins!
        </h2>
        <p className="winner-screen__subtitle">
          Landed exactly on tile 100. The board bows to your storm.
        </p>

        <div className="winner-screen__actions">
          <Button fullWidth onClick={() => controller.restart()}>
            Play Again
          </Button>
          <Link to="/" className="w-full">
            <Button variant="secondary" fullWidth>
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
