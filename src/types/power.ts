/** Mystery powers granted when landing on a Mystery tile. */
export type MysteryPower =
  | 'shield'
  | 'luckyRoll'
  | 'teleport'
  | 'sabotage'
  | 'peek'
  | 'doubleBoost'
  | 'phaseWalk';

export const MYSTERY_POWERS: readonly MysteryPower[] = [
  'shield',
  'luckyRoll',
  'teleport',
  'sabotage',
  'peek',
  'doubleBoost',
  'phaseWalk',
] as const;

/** Human-readable labels for mystery powers. */
export const POWER_LABELS: Record<MysteryPower, string> = {
  shield: 'Shield',
  luckyRoll: 'Lucky Roll',
  teleport: 'Teleport',
  sabotage: 'Sabotage',
  peek: 'Peek',
  doubleBoost: 'Double Boost',
  phaseWalk: 'Phase Walk',
};
