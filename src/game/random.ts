/** Injectable RNG — defaults to Math.random for v1. */
export type RandomSource = () => number;

let randomSource: RandomSource = Math.random;

export function setRandomSource(source: RandomSource): void {
  randomSource = source;
}

export function resetRandomSource(): void {
  randomSource = Math.random;
}

export function random(): number {
  return randomSource();
}

/** Uniform integer in [min, max] inclusive. */
export function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

/** Pick random element from a non-empty array. */
export function randomPick<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

/** Fisher–Yates shuffle (returns new array). */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swapIndex = randomInt(0, index);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}
