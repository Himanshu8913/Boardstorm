import type { EventType, GameEvent } from '@/types/event';

let eventCounter = 0;

export function createGameEvent(
  type: EventType,
  payload: unknown,
): GameEvent {
  eventCounter += 1;
  return {
    id: `evt-${Date.now()}-${eventCounter}`,
    type,
    timestamp: Date.now(),
    payload,
  };
}

export function resetEventCounter(): void {
  eventCounter = 0;
}
