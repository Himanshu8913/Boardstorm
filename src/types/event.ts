export type EventType =
  | 'match_started'
  | 'dice_rolled'
  | 'player_moved'
  | 'trap_triggered'
  | 'boost_triggered'
  | 'power_granted'
  | 'power_used'
  | 'player_collision'
  | 'boardstorm_started'
  | 'boardstorm_finished'
  | 'turn_ended'
  | 'round_completed'
  | 'winner_found'
  | 'match_finished';

export interface GameEvent {
  id: string;
  type: EventType;
  timestamp: number;
  payload: unknown;
}

export interface EventState {
  events: GameEvent[];
}
