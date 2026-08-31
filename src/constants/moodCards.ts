import type { BoardMood } from '@/types/match';

export type MoodCardConfig = {
  mood: BoardMood;
  emoji: string;
  label: string;
  tagline: string;
  description: string;
  accentVar: string;
};

export const MOOD_CARDS: readonly MoodCardConfig[] = [
  {
    mood: 'kind',
    emoji: '😇',
    label: 'Kind',
    tagline: 'Boost heavy',
    description: 'More boost tiles and stronger forward jumps.',
    accentVar: 'var(--color-mood-kind)',
  },
  {
    mood: 'cruel',
    emoji: '💀',
    label: 'Cruel',
    tagline: 'Trap heavy',
    description: 'Traps lurk everywhere. Tread carefully.',
    accentVar: 'var(--color-mood-cruel)',
  },
  {
    mood: 'chaotic',
    emoji: '🌀',
    label: 'Chaotic',
    tagline: 'Mystery heavy',
    description: 'Unpredictable mystery tiles and wild swings.',
    accentVar: 'var(--color-mood-chaotic)',
  },
  {
    mood: 'balanced',
    emoji: '⚖️',
    label: 'Balanced',
    tagline: 'Even mix',
    description: 'Equal tile distribution. Great for beginners.',
    accentVar: 'var(--color-mood-balanced)',
  },
] as const;
