import type { BoardMood } from '@/types/match';

export type BoardThemeConfig = {
  mood: BoardMood;
  label: string;
  frameClass: string;
  /** CSS-safe safe-tile hue indices 0–3 */
  safeVariants: readonly [string, string, string, string];
};

export const BOARD_THEMES: Record<BoardMood, BoardThemeConfig> = {
  kind: {
    mood: 'kind',
    label: 'Kind Mood',
    frameClass: 'board-frame--kind',
    safeVariants: ['#84cc16', '#38bdf8', '#fbbf24', '#c084fc'],
  },
  cruel: {
    mood: 'cruel',
    label: 'Cruel Mood',
    frameClass: 'board-frame--cruel',
    safeVariants: ['#7f1d1d', '#4c1d95', '#1e3a8a', '#831843'],
  },
  chaotic: {
    mood: 'chaotic',
    label: 'Chaotic Mood',
    frameClass: 'board-frame--chaotic',
    safeVariants: ['#991b1b', '#312e81', '#581c87', '#1e40af'],
  },
  balanced: {
    mood: 'balanced',
    label: 'Balanced Mood',
    frameClass: 'board-frame--balanced',
    safeVariants: ['#64748b', '#0ea5e9', '#f59e0b', '#a855f7'],
  },
};

export function getSafeTileVariant(tileNumber: number): number {
  return (tileNumber - 1) % 4;
}
