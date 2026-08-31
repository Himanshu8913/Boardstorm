export type TileVisibility = 'visible' | 'fog';

export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export interface SettingsState {
  tileVisibility: TileVisibility;
  animationSpeed: AnimationSpeed;
  soundEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  turnTimerEnabled: boolean;
  turnTimerSeconds: number;
}
