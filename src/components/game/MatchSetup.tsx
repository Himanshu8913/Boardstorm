import { useGameController } from '@/hooks/useGameController';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import type { GameMode } from '@/types/match';

export function MatchSetup() {
  const controller = useGameController();

  const start = (mode: GameMode) => {
    controller.startMatch(mode);
  };

  return (
    <section className="mx-auto flex max-w-lg flex-col gap-6 py-8">
      <div className="text-center">
        <h1 className="text-page-title text-ink">Start a Match</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Choose a mode to reveal the board mood and begin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Solo vs Ghosts</CardTitle>
          </CardHeader>
          <CardContent>
            Play against three ghost opponents. Ghosts pick safe or risk dice
            automatically.
          </CardContent>
          <Button className="mt-auto" fullWidth onClick={() => start('solo')}>
            Play Solo
          </Button>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Local Multiplayer</CardTitle>
          </CardHeader>
          <CardContent>
            Pass-and-play with up to four players on one device.
          </CardContent>
          <Button
            variant="secondary"
            className="mt-auto"
            fullWidth
            onClick={() => start('multiplayer')}
          >
            Play Local MP
          </Button>
        </Card>
      </div>
    </section>
  );
}
