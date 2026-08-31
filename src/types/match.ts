import type { PlayerId } from '@/types/playerId';

export type GameMode = 'solo' | 'multiplayer';

export type MatchStatus =
  | 'idle'
  | 'moodReveal'
  | 'playing'
  | 'finished';

export type BoardMood = 'kind' | 'cruel' | 'chaotic' | 'balanced';

export interface MatchState {
  id: string;
  status: MatchStatus;
  mode: GameMode;
  boardMood: BoardMood;
  winnerId: PlayerId | null;
  createdAt: number;
  finishedAt: number | null;
}
