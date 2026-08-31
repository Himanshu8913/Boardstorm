const STEP_DELAY_MS = 120;

export async function animatePlayerToPosition(
  from: number,
  to: number,
  onStep: (position: number) => void,
): Promise<void> {
  if (to === from) {
    return;
  }

  const direction = to > from ? 1 : -1;
  let current = from;

  while (current !== to) {
    current += direction;
    onStep(current);
    await new Promise((resolve) => setTimeout(resolve, STEP_DELAY_MS));
  }
}
