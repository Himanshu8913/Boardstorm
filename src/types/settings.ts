export type TileVisibility = 'visible' | 'fog';

export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export interface SettingsState {
  tileVisibility: TileVisibility;
  animationSpeed: AnimationSpeed;
  soundEnabled: boolean;
  musicEnabled: boolean;
  turnTimerEnabled: boolean;
  turnTimerSeconds: number;
}
