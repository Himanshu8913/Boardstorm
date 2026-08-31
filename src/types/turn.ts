/** Tracks whose turn it is and how many full rounds have been played. */
export type TurnState = {
  /** Index into `playerOrder` for the active player. */
  currentPlayerIndex: number;
  /** Full rounds completed. Starts at 1 on a new game. */
  round: number;
  /** Player IDs in turn order. */
  playerOrder: number[];
};
