export type SoundId =
  | 'diceRoll'
  | 'diceStop'
  | 'step'
  | 'trap'
  | 'boost'
  | 'mystery'
  | 'collision'
  | 'boardstorm'
  | 'victory'
  | 'uiClick'
  | 'luckyRoll'
  | 'teleport'
  | 'sabotage'
  | 'peek'
  | 'shield';

export const SOUND_CONCURRENCY_LIMITS: Partial<Record<SoundId, number>> = {
  step: 2,
  uiClick: 3,
  diceRoll: 1,
  boardstorm: 1,
  victory: 1,
};
