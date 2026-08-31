import type { BoardMood } from '@/types/match';
import type { MysteryPower } from '@/types/power';
import type { BoostEffect, TrapEffect } from '@/types/tile';

export const BOARD_MOODS: readonly BoardMood[] = [
  'kind',
  'cruel',
  'chaotic',
  'balanced',
] as const;

export const MYSTERY_POWERS: readonly MysteryPower[] = [
  'shield',
  'luckyRoll',
  'teleport',
  'sabotage',
  'peek',
  'doubleBoost',
  'phaseWalk',
] as const;

export const PASSIVE_POWERS: readonly MysteryPower[] = [
  'shield',
  'doubleBoost',
  'phaseWalk',
] as const;

export const POWER_LABELS: Record<MysteryPower, string> = {
  shield: 'Shield',
  luckyRoll: 'Lucky Roll',
  teleport: 'Teleport',
  sabotage: 'Sabotage',
  peek: 'Peek',
  doubleBoost: 'Double Boost',
  phaseWalk: 'Phase Walk',
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

/** Base backward steps before mood modifiers */
export const TRAP_BACK_STEPS: Record<TrapEffect, number> = {
  mud: 3,
  spike: 5,
  collapse: 0,
  gust: 0,
};

/** Base forward steps before mood modifiers */
export const BOOST_FORWARD_STEPS: Record<BoostEffect, number> = {
  spring: 3,
  rocket: 6,
  vine: 0,
  wind: 0,
};

export const MOOD_LABELS: Record<BoardMood, string> = {
  kind: 'Kind',
  cruel: 'Cruel',
  chaotic: 'Chaotic',
  balanced: 'Balanced',
};

export const MOOD_EMOJI: Record<BoardMood, string> = {
  kind: '🌤️',
  cruel: '⛈️',
  chaotic: '🌀',
  balanced: '⚖️',
};
