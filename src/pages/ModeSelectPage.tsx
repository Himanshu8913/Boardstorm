import type { CSSProperties } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { MODE_OPTIONS } from '@/constants/modeSelect';
import { ModeOptionIcon } from '@/components/mode-select/ModeOptionIcon';
import { useGameController } from '@/hooks/useGameController';
import { useGameStore } from '@/hooks/useGameStore';
import type { GameMode } from '@/types/match';
import '@/components/mode-select/mode-select.css';

export function ModeSelectPage() {
  const navigate = useNavigate();
  const controller = useGameController();
  const status = useGameStore((state) => state.match.status);

  if (status === 'setup') {
    return <Navigate to="/setup" replace />;
  }

  if (status === 'moodReveal' || status === 'playing') {
    return <Navigate to="/game" replace />;
  }

  const startMode = (mode: GameMode) => {
    controller.prepareMatch(mode);
    navigate('/setup');
  };

  return (
    <section className="mode-select">
      <div className="mode-select__header">
        <Link to="/" className="mode-select__back focus-ring">
          ← Back
        </Link>
        <h1 className="mode-select__title">Choose Mode</h1>
        <p className="mode-select__subtitle">
          How do you want to storm the board today?
        </p>
      </div>

      <ul className="mode-select__grid">
        {MODE_OPTIONS.map((option) => {
          const cardStyle = {
            '--mode-accent': option.accentVar,
          } as CSSProperties;

          if (!option.available) {
            return (
              <li key={option.id}>
                <div
                  className="mode-card mode-card--disabled"
                  style={cardStyle}
                  aria-disabled="true"
                >
                  {option.badge && (
                    <span className="mode-card__badge">{option.badge}</span>
                  )}
                  <span className="mode-card__icon" aria-hidden>
                    <ModeOptionIcon id={option.id} />
                  </span>
                  <span className="mode-card__title">{option.title}</span>
                  <span className="mode-card__desc">{option.description}</span>
                </div>
              </li>
            );
          }

          return (
            <li key={option.id}>
              <button
                type="button"
                className="mode-card"
                style={cardStyle}
                onClick={() => startMode(option.gameMode!)}
                aria-label={`${option.title}. ${option.description}`}
              >
                <span className="mode-card__icon" aria-hidden>
                  <ModeOptionIcon id={option.id} />
                </span>
                <span className="mode-card__title">{option.title}</span>
                <span className="mode-card__desc">{option.description}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
