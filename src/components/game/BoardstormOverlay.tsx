type BoardstormOverlayProps = {
  active: boolean;
};

/** Full-board overlay shown during a Boardstorm event. */
export function BoardstormOverlay({ active }: BoardstormOverlayProps) {
  if (!active) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-slate-900/40 animate-boardstorm-flash"
      aria-hidden="true"
    >
      <span className="animate-boardstorm-text text-2xl font-black tracking-widest text-yellow-300 drop-shadow-lg sm:text-3xl">
        ⚡ BOARDSTORM ⚡
      </span>
    </div>
  );
}
