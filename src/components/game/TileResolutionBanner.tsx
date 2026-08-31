type TileResolutionBannerProps = {
  message: string | null;
};

/** Displays feedback after a player lands on and resolves a tile. */
export function TileResolutionBanner({ message }: TileResolutionBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="w-full max-w-3xl rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-3 text-center text-sm text-slate-200"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
