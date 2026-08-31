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
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-lg"
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-boardstorm-flash bg-slate-900/50" />
      <div className="absolute inset-0 animate-lightning-flash bg-gradient-to-b from-yellow-200/30 via-transparent to-purple-500/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="animate-boardstorm-text text-2xl font-black tracking-widest text-yellow-300 drop-shadow-lg sm:text-3xl">
          ⚡ BOARDSTORM ⚡
        </span>
      </div>
    </div>
  );
}
