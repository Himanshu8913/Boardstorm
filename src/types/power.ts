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

/** Short descriptions shown in the power use panel. */
export const POWER_DESCRIPTIONS: Record<MysteryPower, string> = {
  shield: 'Blocks the next Trap you land on. Disabled if you use the Risk Die.',
  luckyRoll: 'Roll again immediately on your turn.',
  teleport: 'Move to any tile within ±10 spaces.',
  sabotage: 'Move another player back 5 tiles.',
  peek: 'Reveal the next 5 tiles ahead.',
  doubleBoost: 'Doubles your next Spring or Rocket boost.',
  phaseWalk: 'Ignore the next Trap you land on.',
};

/** Powers that activate automatically on landing — no Use button. */
export const PASSIVE_POWERS: readonly MysteryPower[] = [
  'shield',
  'doubleBoost',
  'phaseWalk',
] as const;

export function isPassivePower(power: MysteryPower): boolean {
  return (PASSIVE_POWERS as readonly string[]).includes(power);
}
