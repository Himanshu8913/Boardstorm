export type TileType = 'safe' | 'trap' | 'boost' | 'mystery';

export type TrapEffect = 'mud' | 'spike' | 'collapse' | 'gust';

export type BoostEffect = 'spring' | 'rocket' | 'vine' | 'wind';

/** A single tile on the generated board. */
export type BoardTile = {
  number: number;
  type: TileType;
  trapEffect?: TrapEffect;
  boostEffect?: BoostEffect;
};

export const TRAP_EFFECTS: readonly TrapEffect[] = [
  'mud',
  'spike',
  'collapse',
  'gust',
] as const;

export const BOOST_EFFECTS: readonly BoostEffect[] = [
  'spring',
  'rocket',
  'vine',
  'wind',
] as const;

/** Tailwind classes for each tile type on the board. */
export const TILE_TYPE_STYLES: Record<TileType, string> = {
  safe: 'border-emerald-700/80 bg-emerald-950/40 text-emerald-200',
  trap: 'border-red-700/80 bg-red-950/40 text-red-200',
  boost: 'border-yellow-600/80 bg-yellow-950/40 text-yellow-200',
  mystery: 'border-purple-600/80 bg-purple-950/40 text-purple-200',
};

/** Short labels shown on special tiles for quick identification. */
export const TILE_TYPE_LABELS: Record<TileType, string> = {
  safe: '',
  trap: 'T',
  boost: 'B',
  mystery: 'M',
};
