import { DIE_CONFIG, type DieType } from '@/types/dice';

type DiceSelectorProps = {
  selected: DieType;
  onSelect: (dieType: DieType) => void;
  disabled?: boolean;
};

export function DiceSelector({
  selected,
  onSelect,
  disabled = false,
}: DiceSelectorProps) {
  const dieTypes: DieType[] = ['safe', 'risk'];

  return (
    <div className="flex gap-1" role="group" aria-label="Choose die">
      {dieTypes.map((dieType) => {
        const config = DIE_CONFIG[dieType];
        const isSelected = selected === dieType;

        return (
          <button
            key={dieType}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(dieType)}
            title={config.description}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
              isSelected
                ? dieType === 'safe'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-orange-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {config.label} ({config.rangeLabel})
          </button>
        );
      })}
    </div>
  );
}
