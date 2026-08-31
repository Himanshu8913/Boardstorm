export type PlayerSetupEntry = {
  name: string;
  color: string;
};

export type MatchSetupConfig = {
  playerCount: number;
  players: PlayerSetupEntry[];
};
