/** Board mood affects tile type distribution during generation (Phase 7 UI). */
export type BoardMood = 'kind' | 'balanced' | 'cruel' | 'chaotic';

export const DEFAULT_BOARD_MOOD: BoardMood = 'balanced';
