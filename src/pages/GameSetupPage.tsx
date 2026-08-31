import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { MIN_PLAYERS, MAX_PLAYERS } from '@/constants/game';
import { DEFAULT_PLAYER_COLORS } from '@/constants/players';
import { createDefaultSetupConfig } from '@/constants/setupDefaults';
import { Button } from '@/components/ui/Button';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/hooks/useGameStore';
import type { MatchSetupConfig, PlayerSetupEntry } from '@/types/setup';
import '@/components/setup/game-setup.css';

function PlayerCountSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (count: number) => void;
}) {
  const options = Array.from(
    { length: MAX_PLAYERS - MIN_PLAYERS + 1 },
    (_, index) => MIN_PLAYERS + index,
  );

  return (
    <div
      className="setup-count"
      role="radiogroup"
      aria-label="Number of players"
    >
      {options.map((count) => (
        <button
          key={count}
          type="button"
          role="radio"
          aria-checked={value === count}
          className={`setup-count__btn${value === count ? ' setup-count__btn--active' : ''}`}
          onClick={() => onChange(count)}
        >
          {count}
        </button>
      ))}
    </div>
  );
}

function ColorSwatches({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (color: string) => void;
  label: string;
}) {
  return (
    <div className="setup-colors" role="radiogroup" aria-label={label}>
      {DEFAULT_PLAYER_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color}
          aria-label={`Color ${color}`}
          className={`setup-colors__swatch${value === color ? ' setup-colors__swatch--active' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
}

function PlayerSetupRow({
  label,
  entry,
  editable,
  ghost,
  onChange,
}: {
  label: string;
  entry: PlayerSetupEntry;
  editable: boolean;
  ghost?: boolean;
  onChange: (patch: Partial<PlayerSetupEntry>) => void;
}) {
  return (
    <div className={`setup-player${ghost ? ' setup-player--ghost' : ''}`}>
      <span
        className="setup-player__avatar"
        style={{ backgroundColor: entry.color }}
        aria-hidden
      >
        {entry.name.charAt(0).toUpperCase()}
      </span>

      <div className="setup-player__fields">
        <p className="setup-player__label">{label}</p>
        {editable ? (
          <>
            <input
              type="text"
              className="setup-player__input focus-ring"
              value={entry.name}
              maxLength={16}
              aria-label={`${label} name`}
              onChange={(event) => onChange({ name: event.target.value })}
            />
            <ColorSwatches
              value={entry.color}
              label={`${label} color`}
              onChange={(color) => onChange({ color })}
            />
          </>
        ) : (
          <p className="setup-player__ghost-name">{entry.name}</p>
        )}
      </div>
    </div>
  );
}

function resizeSetupForCount(
  config: MatchSetupConfig,
  count: number,
): MatchSetupConfig {
  const draft = createDefaultSetupConfig('multiplayer', count);

  return {
    playerCount: count,
    players: draft.players.map((player, index) => ({
      name: config.players[index]?.name ?? player.name,
      color: config.players[index]?.color ?? player.color,
    })),
  };
}

function GameSetupForm() {
  const navigate = useNavigate();
  const controller = useGameController();
  const mode = useGameStore((state) => state.match.mode);
  const matchId = useGameStore((state) => state.match.id);

  const [config, setConfig] = useState<MatchSetupConfig>(() =>
    createDefaultSetupConfig(mode),
  );

  useEffect(() => {
    setConfig(createDefaultSetupConfig(mode));
  }, [matchId, mode]);

  const isSolo = mode === 'solo';
  const editableSlots = isSolo ? 1 : config.playerCount;

  const updatePlayer = (index: number, patch: Partial<PlayerSetupEntry>) => {
    setConfig((current) => ({
      ...current,
      players: current.players.map((player, playerIndex) =>
        playerIndex === index ? { ...player, ...patch } : player,
      ),
    }));
  };

  const handleCountChange = (count: number) => {
    setConfig((current) => resizeSetupForCount(current, count));
  };

  const handleStart = () => {
    controller.confirmSetup(config);
    navigate('/game', { replace: true });
  };

  const playerLabel = (index: number) => {
    if (isSolo && index === 0) {
      return 'You';
    }
    if (isSolo) {
      return `Ghost ${index + 1}`;
    }
    return `Player ${index + 1}`;
  };

  return (
    <section className="game-setup">
      <div className="game-setup__header">
        <Link to="/modes" className="game-setup__back focus-ring">
          ← Back
        </Link>
        <h1 className="game-setup__title">Game Setup</h1>
        <p className="game-setup__subtitle">
          {isSolo
            ? 'Name yourself — your ghost rivals are ready.'
            : 'Choose how many players and customize names & colors.'}
        </p>
      </div>

      {!isSolo && (
        <div className="game-setup__section">
          <p className="game-setup__section-label">Players</p>
          <PlayerCountSelect
            value={config.playerCount}
            onChange={handleCountChange}
          />
        </div>
      )}

      <div className="game-setup__roster">
        {config.players.slice(0, config.playerCount).map((entry, index) => (
          <PlayerSetupRow
            key={index}
            label={playerLabel(index)}
            entry={entry}
            editable={index < editableSlots}
            ghost={isSolo && index > 0}
            onChange={(patch) => updatePlayer(index, patch)}
          />
        ))}
      </div>

      <div className="game-setup__actions">
        <Button size="lg" fullWidth onClick={handleStart}>
          Continue to Board Mood
        </Button>
      </div>
    </section>
  );
}

export function GameSetupPage() {
  const status = useGameStore((state) => state.match.status);
  const matchId = useGameStore((state) => state.match.id);

  if (status === 'moodReveal' || status === 'playing') {
    return <Navigate to="/game" replace />;
  }

  if (status !== 'setup') {
    return <Navigate to="/modes" replace />;
  }

  return <GameSetupForm key={matchId} />;
}
