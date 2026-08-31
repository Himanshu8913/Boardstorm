import { Link } from 'react-router-dom';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export function VictoryModal() {
  const controller = useGameController();
  const isOpen = useGameStore((state) => state.ui.activeModal === 'victory');
  const winnerId = useGameStore((state) => state.match.winnerId);
  const winner = useGameStore((state) =>
    winnerId ? state.players[winnerId] : undefined,
  );

  if (!isOpen || !winner) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="Victory!"
      hideClose
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          className="inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-ink-inverse"
          style={{ backgroundColor: winner.color }}
          aria-hidden
        >
          {winner.name.charAt(0)}
        </span>
        <p className="text-lg font-semibold text-ink">{winner.name} wins!</p>
        <p className="text-sm text-ink-muted">
          Landed exactly on tile 100. Ready for another storm?
        </p>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
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
    </Modal>
  );
}
