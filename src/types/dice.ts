/** Die choice available to a player on their turn. */
export type DieType = 'safe' | 'risk';

export type DieConfig = {
  min: number;
  max: number;
  label: string;
  rangeLabel: string;
  description: string;
};

/** Configuration for each die type per game design. */
export const DIE_CONFIG: Record<DieType, DieConfig> = {
  safe: {
    min: 1,
    max: 4,
    label: 'Safe Die',
    rangeLabel: '1–4',
    description: 'Predictable movement with lower variance.',
  },
  risk: {
    min: 1,
    max: 8,
    label: 'Risk Die',
    rangeLabel: '1–8',
    description: 'Faster movement with higher variance.',
  },
};
