/** Board mood affects tile distribution and difficulty for each match. */
export type BoardMood = 'kind' | 'balanced' | 'cruel' | 'chaotic';

export type BoardMoodConfig = {
  emoji: string;
  label: string;
  /** Shown on the pre-game mood reveal screen. */
  tagline: string;
  description: string;
};

/** Display and gameplay metadata for each board mood. */
export const MOOD_CONFIG: Record<BoardMood, BoardMoodConfig> = {
  kind: {
    emoji: '😇',
    label: 'Kind',
    tagline: 'This board feels Kind today',
    description: 'More Boost tiles with stronger forward movement.',
  },
  balanced: {
    emoji: '⚖️',
    label: 'Balanced',
    tagline: 'This board feels Balanced today',
    description: 'Equal tile distribution. Recommended for beginners.',
  },
  cruel: {
    emoji: '😈',
    label: 'Cruel',
    tagline: 'This board feels Cruel today',
    description: 'More Trap tiles with punishing backward movement.',
  },
  chaotic: {
    emoji: '🎲',
    label: 'Chaotic',
    tagline: 'This board feels Chaotic today',
    description: 'More Mystery tiles. Expect wild power swings.',
  },
};

export const BOARD_MOODS: BoardMood[] = [
  'kind',
  'balanced',
  'cruel',
  'chaotic',
];

export const DEFAULT_BOARD_MOOD: BoardMood = 'balanced';
