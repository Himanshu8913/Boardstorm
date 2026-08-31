import type { ReactNode } from 'react';

export function MultiplayerModeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="mode-card__icon-svg" aria-hidden>
      <path
        fill="currentColor"
        d="M32 20c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm-16 0c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm0 3c-4.4 0-13 2.2-13 6.5V34h13v-4.5c0-1.4.4-2.7 1-3.8 1.2-2.2 3.5-3.7 6.2-3.7h.8zm16 0c-.6 0-1.2.1-1.8.2 2.5 1.2 4.2 3.6 4.2 6.5V34h13v-4.5C37 25.2 28.4 23 24 23z"
      />
    </svg>
  );
}

export function SoloModeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="mode-card__icon-svg" aria-hidden>
      <path
        fill="currentColor"
        d="M24 6c-4.2 0-7.5 3.5-7.5 7.8 0 2.1.9 4 2.4 5.3L16 40l8-3.2L32 40l-2.9-20.9C30.6 17.8 31.5 16 31.5 13.8 31.5 9.5 28.2 6 24 6zm0 3.5c2.4 0 4.2 2 4.2 4.3S26.4 18 24 18s-4.2-2-4.2-4.2S21.6 9.5 24 9.5zM14 42l2-14.5c1.4 1 3.2 1.6 5.1 1.6h5.8c1.9 0 3.7-.6 5.1-1.6L34 42H14z"
      />
      <circle cx="19" cy="14" r="1.5" fill="currentColor" />
      <circle cx="29" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function OnlineModeIcon() {
  return (
    <svg viewBox="0 0 48 48" className="mode-card__icon-svg" aria-hidden>
      <path
        fill="currentColor"
        d="M24 4C12.4 4 3 13.4 3 25s9.4 21 21 21 21-9.4 21-21S35.6 4 24 4zm0 4c9.4 0 17 7.6 17 17 0 3.1-.8 6-2.3 8.5-2.4-7.8-9.5-13.5-17.7-13.5S8.7 26.7 6.3 34.5 4.8 30.1 4.8 27c0-9.4 7.6-17 17-17zm-8.5 14c4.1 0 7.5 3.4 7.5 7.5S19.6 37 15.5 37 8 33.6 8 29.5 11.4 22 15.5 22zm17 0c4.1 0 7.5 3.4 7.5 7.5S36.6 37 32.5 37 25 33.6 25 29.5 28.4 22 32.5 22z"
      />
    </svg>
  );
}

const MODE_ICONS: Record<string, () => ReactNode> = {
  multiplayer: MultiplayerModeIcon,
  solo: SoloModeIcon,
  online: OnlineModeIcon,
};

export function ModeOptionIcon({ id }: { id: string }) {
  const Icon = MODE_ICONS[id];
  return Icon ? <Icon /> : null;
}
