import type { GameEvent } from '@/types/event';
import type { PowerUsedPayload } from '@/game/events/payloads';
import type { SoundId } from '@/services/audio/sounds';

export function eventToSounds(event: GameEvent): SoundId[] {
  switch (event.type) {
    case 'dice_rolled':
      return ['diceRoll'];

    case 'player_moved':
      return ['step'];

    case 'trap_triggered':
      return ['trap'];

    case 'boost_triggered':
      return ['boost'];

    case 'power_granted':
      return ['mystery'];

    case 'player_collision':
      return ['collision'];

    case 'boardstorm_finished':
      return ['boardstorm'];

    case 'winner_found':
      return ['victory'];

    case 'power_used': {
      const payload = event.payload as PowerUsedPayload;
      switch (payload.power) {
        case 'luckyRoll':
          return ['luckyRoll'];
        case 'teleport':
          return ['teleport'];
        case 'sabotage':
          return ['sabotage'];
        case 'peek':
          return ['peek'];
        default:
          return ['mystery'];
      }
    }

    default:
      return [];
  }
}
