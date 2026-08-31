import type { CSSProperties } from 'react';
import '@/styles/home-brand.css';
import { SPLASH_LOADING_LABEL, SPLASH_ORBIT_ICONS, SPLASH_TAGLINE } from '@/constants/splash';
import './splash-screen.css';

export type SplashScreenProps = {
  progress: number;
  exiting?: boolean;
  onSkip: () => void;
};

export function SplashScreen({
  progress,
  exiting = false,
  onSkip,
}: SplashScreenProps) {
  return (
    <div
      className={`splash-screen${exiting ? ' splash-screen--exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="splash-logo"
      aria-describedby="splash-tagline splash-status"
    >
      <button
        type="button"
        className="splash-screen__skip focus-ring"
        onClick={onSkip}
        aria-label="Skip loading screen"
      >
        Skip
      </button>

      <div className="splash-screen__backdrop" aria-hidden />

      <div className="splash-screen__content">
        <div className="splash-screen__stage" aria-hidden>
          <div className="splash-screen__vortex-ring splash-screen__vortex-ring--outer" />
          <div className="splash-screen__vortex-ring splash-screen__vortex-ring--inner" />
          <div className="splash-screen__vortex-core" />

          <div className="splash-screen__orbit">
            {SPLASH_ORBIT_ICONS.map((icon) => (
              <span
                key={icon.id}
                className="splash-screen__orbit-item"
                style={{ '--orbit-angle': `${icon.angle}deg` } as CSSProperties}
              >
                {icon.emoji}
              </span>
            ))}
          </div>
        </div>

        <h1 id="splash-logo" className="brand-logo splash-screen__logo">
          BOARDSTORM
        </h1>

        <p id="splash-tagline" className="splash-screen__tagline">
          {SPLASH_TAGLINE}
        </p>
      </div>

      <div className="splash-screen__footer">
        <div
          className="splash-screen__progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-labelledby="splash-status"
        >
          <div
            className="splash-screen__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p id="splash-status" className="splash-screen__status">
          {SPLASH_LOADING_LABEL}
          <span className="sr-only"> {progress} percent</span>
        </p>
      </div>
    </div>
  );
}
