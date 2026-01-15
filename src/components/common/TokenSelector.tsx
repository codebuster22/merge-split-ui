import type { TokenType } from '../../types';

interface TokenSelectorProps {
  value: TokenType;
  onChange: (value: TokenType) => void;
  disabled?: boolean;
  disabledOptions?: TokenType[];
}

export function TokenSelector({
  value,
  onChange,
  disabled = false,
  disabledOptions = [],
}: TokenSelectorProps) {
  const tokens: { type: TokenType; label: string; colorClass: string }[] = [
    { type: 'YES', label: 'YES', colorClass: 'bg-green-500' },
    { type: 'NO', label: 'NO', colorClass: 'bg-red-500' },
  ];

  return (
    <div className="flex gap-2">
      {tokens.map((token) => {
        const isDisabled = disabled || disabledOptions.includes(token.type);
        const isSelected = value === token.type;

        return (
          <button
            key={token.type}
            type="button"
            onClick={() => !isDisabled && onChange(token.type)}
            disabled={isDisabled}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              isSelected
                ? 'bg-slate-600 ring-2 ring-blue-500'
                : 'bg-slate-700 hover:bg-slate-600'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span className={`w-3 h-3 rounded-full ${token.colorClass}`} />
            <span className="text-white">{token.label}</span>
          </button>
        );
      })}
    </div>
  );
}
