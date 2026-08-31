import type { ReactNode } from 'react';
import { MAX_VOLUME, MIN_VOLUME } from '@/constants/settings';
import { useGameStore } from '@/hooks/useGameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/components/ui/cn';
import type { AnimationSpeed } from '@/types/settings';

type SettingRowProps = {
  label: string;
  description?: string;
  children: ReactNode;
};

function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-8 w-14 rounded-full transition-colors duration-fast',
        checked ? 'bg-primary' : 'bg-border-strong',
      )}
    >
      <span
        className={cn(
          'absolute top-1 h-6 w-6 rounded-full bg-surface shadow-sm transition-transform duration-fast',
          checked ? 'translate-x-7' : 'translate-x-1',
        )}
      />
    </button>
  );
}

type VolumeSliderProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  id: string;
  label: string;
};

function VolumeSlider({
  value,
  onChange,
  disabled = false,
  id,
  label,
}: VolumeSliderProps) {
  return (
    <div className="flex w-full min-w-[12rem] items-center gap-3 sm:w-56">
      <input
        id={id}
        type="range"
        min={MIN_VOLUME}
        max={MAX_VOLUME}
        step={1}
        value={value}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-primary disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span className="w-10 text-right text-xs font-semibold tabular-nums text-ink-muted">
        {value}%
      </span>
    </div>
  );
}

const animationOptions: { value: AnimationSpeed; label: string }[] = [
  { value: 'slow', label: 'Slow' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast' },
];

export function SettingsPage() {
  const settings = useGameStore((state) => state.settings);
  const patchSettings = useGameStore((state) => state.patchSettings);

  const audioDisabled = !settings.soundEnabled;

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 py-4 sm:py-8">
      <div>
        <h1 className="text-page-title text-ink">Settings</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Changes apply immediately and are saved on this device.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Board</CardTitle>
        </CardHeader>
        <CardContent className="text-ink">
          <SettingRow
            label="Show tile types"
            description="Turn off to hide trap, boost, and mystery tiles (fog mode)."
          >
            <Toggle
              label="Show tile types on board"
              checked={settings.tileVisibility === 'visible'}
              onChange={(checked) =>
                patchSettings({
                  tileVisibility: checked ? 'visible' : 'fog',
                })
              }
            />
          </SettingRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Motion</CardTitle>
        </CardHeader>
        <CardContent className="text-ink">
          <SettingRow
            label="Animation speed"
            description="Affects dice rolls, tile effects, and boardstorm timing."
          >
            <div
              className="inline-flex rounded-lg border border-border bg-background-accent p-1"
              role="radiogroup"
              aria-label="Animation speed"
            >
              {animationOptions.map((option) => {
                const selected = settings.animationSpeed === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() =>
                      patchSettings({ animationSpeed: option.value })
                    }
                    className={cn(
                      'rounded-md px-3 py-2 text-xs font-semibold transition-colors duration-fast',
                      selected
                        ? 'bg-primary text-ink-inverse shadow-sm'
                        : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </SettingRow>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audio</CardTitle>
        </CardHeader>
        <CardContent className="text-ink">
          <SettingRow
            label="Master mute"
            description="Disables all game sounds and music."
          >
            <Toggle
              label="Master mute"
              checked={!settings.soundEnabled}
              onChange={(muted) => patchSettings({ soundEnabled: !muted })}
            />
          </SettingRow>

          <SettingRow
            label="SFX volume"
            description="Sound effects volume for Phase 12 audio."
          >
            <VolumeSlider
              id="sfx-volume"
              label="SFX volume"
              value={settings.sfxVolume}
              disabled={audioDisabled}
              onChange={(sfxVolume) => patchSettings({ sfxVolume })}
            />
          </SettingRow>

          <SettingRow
            label="Music volume"
            description="Background music volume when music is added."
          >
            <VolumeSlider
              id="music-volume"
              label="Music volume"
              value={settings.musicVolume}
              disabled={audioDisabled || !settings.musicEnabled}
              onChange={(musicVolume) => patchSettings({ musicVolume })}
            />
          </SettingRow>

          <SettingRow
            label="Music enabled"
            description="Toggle background music independently of SFX."
          >
            <Toggle
              label="Music enabled"
              checked={settings.musicEnabled}
              onChange={(musicEnabled) => patchSettings({ musicEnabled })}
            />
          </SettingRow>
        </CardContent>
      </Card>
    </section>
  );
}
