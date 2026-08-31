import type { GameMode } from '@/types/match';

export type ModeOptionId = 'solo' | 'multiplayer' | 'online';

export type ModeOption = {
  id: ModeOptionId;
  /** Game mode when selected; omitted for unavailable options. */
  gameMode?: GameMode;
  title: string;
  description: string;
  accentVar: string;
  available: boolean;
  badge?: string;
};

export const MODE_OPTIONS: readonly ModeOption[] = [
  {
    id: 'multiplayer',
    gameMode: 'multiplayer',
    title: 'Local Multiplayer',
    description: 'Pass-and-play with up to four friends on one screen.',
    accentVar: 'var(--color-primary)',
    available: true,
  },
  {
    id: 'solo',
    gameMode: 'solo',
    title: 'Single Player',
    description: 'Face three ghost rivals that play by the same rules as you.',
    accentVar: 'var(--color-accent-green)',
    available: true,
  },
  {
    id: 'online',
    title: 'Online',
    description: 'Challenge players around the world.',
    accentVar: 'var(--color-mystery)',
    available: false,
    badge: 'Coming Soon',
  },
] as const;
