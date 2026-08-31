import type { CSSProperties } from 'react';
import type { PlayerMotionEffect } from '@/types/animation';
import type { PlayerState } from '@/types/player';
import { cn } from '@/components/ui/cn';
import { getStackOffset } from '@/components/board/playerTokenLayout';
import './player-token.css';

export type PlayerTokenProps = {
  player: PlayerState;
  tileNumber: number;
  stackIndex: number;
  stackTotal: number;
  motion?: PlayerMotionEffect | null;
  isHopping?: boolean;
  isCurrentTurn?: boolean;
};

const motionClasses: Record<PlayerMotionEffect, string> = {
  boost: 'player-token--motion-boost',
  trap: 'player-token--motion-trap',
  mystery: 'player-token--motion-mystery',
};

export function PlayerToken({
  player,
  tileNumber,
  stackIndex,
  stackTotal,
  motion = null,
  isHopping = false,
  isCurrentTurn = false,
}: PlayerTokenProps) {
  const offset = getStackOffset(stackIndex, stackTotal);
  const initial = player.name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'player-token',
        player.isGhost && 'player-token--ghost',
        isHopping && 'player-token--hopping',
        isCurrentTurn && 'player-token--active-turn',
        motion && motionClasses[motion],
      )}
      style={{
        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
        zIndex: 10 + stackIndex,
        '--token-color': player.color,
      } as CSSProperties}
      title={player.name}
      aria-label={`${player.name}, on tile ${tileNumber}${player.isGhost ? ', ghost' : ''}`}
    >
      <div className="player-token__shadow" aria-hidden />
      <div className="player-token__pawn" aria-hidden>
        <div className="player-token__head">
          <span className="player-token__highlight" />
          <span className="player-token__highlight player-token__highlight--small" />
          <span className="player-token__initial">{initial}</span>
        </div>
        <div className="player-token__collar" />
        <div className="player-token__neck" />
        <div className="player-token__body">
          <span className="player-token__body-shine" />
        </div>
        <div className="player-token__base">
          <span className="player-token__base-rim" />
        </div>
        <span className="player-token__gloss" />
      </div>
      {isCurrentTurn && (
        <span className="player-token__turn-ring" aria-hidden />
      )}
    </div>
  );
}
