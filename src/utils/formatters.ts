import { DefaultDecimals } from '../constants';

/**
 * Format a bigint value to a human-readable string with decimals
 */
export function formatAmount(value: bigint, decimals: number = DefaultDecimals): string {
  if (value === 0n) return '0';

  const divisor = BigInt(10 ** decimals);
  const intPart = value / divisor;
  const decPart = value % divisor;

  if (decPart === 0n) {
    return intPart.toLocaleString();
  }

  // Pad decimal part with leading zeros and remove trailing zeros
  const decStr = decPart.toString().padStart(decimals, '0').replace(/0+$/, '');
  return `${intPart.toLocaleString()}.${decStr}`;
}

/**
 * Parse a human-readable string to a bigint value
 */
export function parseAmount(value: string, decimals: number = DefaultDecimals): bigint {
  if (!value || value === '') return 0n;

  // Remove commas and whitespace
  const cleanValue = value.replace(/,/g, '').trim();

  const [intPart, decPart = ''] = cleanValue.split('.');

  // Pad or truncate decimal part to match decimals
  const paddedDec = decPart.slice(0, decimals).padEnd(decimals, '0');

  // Handle empty integer part
  const intValue = intPart || '0';

  return BigInt(intValue + paddedDec);
}

/**
 * Format an address for display (0x1234...5678)
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a large number with K, M, B suffixes
 */
export function formatCompact(value: bigint, decimals: number = DefaultDecimals): string {
  const num = Number(value) / 10 ** decimals;

  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  }

  return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
