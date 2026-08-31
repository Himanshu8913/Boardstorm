export type StackOffset = {
  x: number;
  y: number;
};

/** Pixel offsets for stacked tokens (up to 4 players per tile). */
const STACK_LAYOUTS: Record<number, StackOffset[]> = {
  1: [{ x: 0, y: 0 }],
  2: [
    { x: -9, y: 0 },
    { x: 9, y: 0 },
  ],
  3: [
    { x: -9, y: 7 },
    { x: 9, y: 7 },
    { x: 0, y: -8 },
  ],
  4: [
    { x: -9, y: -7 },
    { x: 9, y: -7 },
    { x: -9, y: 7 },
    { x: 9, y: 7 },
  ],
};

export function getStackOffset(
  stackIndex: number,
  stackTotal: number,
): StackOffset {
  const layout = STACK_LAYOUTS[Math.min(stackTotal, 4)] ?? STACK_LAYOUTS[1];
  return layout[stackIndex] ?? { x: 0, y: 0 };
}
