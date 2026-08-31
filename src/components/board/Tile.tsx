type TileProps = {
  number: number;
  isStart?: boolean;
};

export function Tile({ number, isStart = false }: TileProps) {
  return (
    <div
      className={`flex aspect-square items-center justify-center rounded-sm border text-[clamp(0.5rem,2.5vw,0.875rem)] font-semibold sm:rounded-md ${
        isStart
          ? 'border-boardstorm-accent bg-amber-500/20 text-amber-300 ring-2 ring-boardstorm-accent ring-offset-1 ring-offset-boardstorm-bg'
          : 'border-slate-600 bg-boardstorm-surface text-slate-300'
      }`}
      aria-label={isStart ? `Tile ${number}, start` : `Tile ${number}`}
    >
      {number}
    </div>
  );
}
