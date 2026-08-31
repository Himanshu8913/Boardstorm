export type MysteryPower =
  | 'shield'
  | 'luckyRoll'
  | 'teleport'
  | 'sabotage'
  | 'peek'
  | 'doubleBoost'
  | 'phaseWalk';

export type PowerAction =
  | { type: 'luckyRoll' }
  | { type: 'peek' }
  | { type: 'teleport'; targetTile: number }
  | { type: 'sabotage'; targetPlayerId: number };

export interface ActivePowerMeta {
  type: MysteryPower;
  acquiredRound: number;
  consumed: boolean;
}

export interface PowerState {
  meta: Record<number, ActivePowerMeta | null>;
}
