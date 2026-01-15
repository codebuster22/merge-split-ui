import { formatAmount } from '../../utils/formatters';

interface TokenInputProps {
  value: string;
  onChange: (value: string) => void;
  max?: bigint;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  decimals?: number;
}

export function TokenInput({
  value,
  onChange,
  max,
  disabled = false,
  placeholder = '0.00',
  label,
  decimals = 6,
}: TokenInputProps) {
  const handleMaxClick = () => {
    if (max !== undefined) {
      onChange(formatAmount(max, decimals));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow empty string, numbers, and one decimal point
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className="input pr-20"
        />
        {max !== undefined && (
          <button
            type="button"
            onClick={handleMaxClick}
            disabled={disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-slate-600 rounded transition-colors disabled:opacity-50"
          >
            MAX
          </button>
        )}
      </div>
      {max !== undefined && (
        <p className="mt-1 text-xs text-slate-400">
          Max: {formatAmount(max, decimals)}
        </p>
      )}
    </div>
  );
}
