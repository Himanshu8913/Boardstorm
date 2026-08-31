export type TileType = 'safe' | 'trap' | 'boost' | 'mystery';

export type TrapEffect = 'mud' | 'spike' | 'collapse' | 'gust';

export type BoostEffect = 'spring' | 'rocket' | 'vine' | 'wind';

export interface BoardTile {
  number: number;
  type: TileType;
  trapEffect?: TrapEffect;
  boostEffect?: BoostEffect;
}

export interface BoardState {
  tiles: BoardTile[];
  boardstormCount: number;
}
