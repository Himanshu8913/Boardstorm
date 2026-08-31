import { WIN_TILE } from '@/constants/board';

export function checkWin(position: number, winTile = WIN_TILE): boolean {
  return position === winTile;
}

export function hasWinner(winnerId: number | null): winnerId is number {
  return winnerId !== null;
}
