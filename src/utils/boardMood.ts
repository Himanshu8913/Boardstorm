import {
  BOARD_MOODS,
  MOOD_CONFIG,
  type BoardMood,
  type BoardMoodConfig,
} from '@/types/boardMood';

/**
 * Randomly selects a board mood for a new match.
 * Each mood has equal probability.
 */
export function pickRandomBoardMood(): BoardMood {
  return BOARD_MOODS[Math.floor(Math.random() * BOARD_MOODS.length)];
}

/**
 * Returns display metadata for a given board mood.
 *
 * @param mood - Board mood to look up
 */
export function getMoodConfig(mood: BoardMood): BoardMoodConfig {
  return MOOD_CONFIG[mood];
}

/**
 * Builds the pre-game reveal message for a mood.
 *
 * @param mood - Board mood assigned to the match
 */
export function getMoodRevealMessage(mood: BoardMood): string {
  const config = getMoodConfig(mood);
  return `${config.tagline} ${config.emoji}`;
}
