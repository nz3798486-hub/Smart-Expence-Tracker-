import { CurrencyConfig } from '../types';

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimals: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 2 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', decimals: 2 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimals: 2 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2 },
];

export function getCurrency(code: string): CurrencyConfig {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

export function formatCurrency(
  amount: number,
  currencyCode = 'USD',
  compact = false
): string {
  const config = getCurrency(currencyCode);
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);

  if (compact && absVal >= 1000000) {
    return `${isNegative ? '-' : ''}${config.symbol}${(absVal / 1000000).toFixed(1)}M`;
  }
  if (compact && absVal >= 10000) {
    return `${isNegative ? '-' : ''}${config.symbol}${(absVal / 1000).toFixed(1)}k`;
  }

  const formattedNum = absVal.toLocaleString(undefined, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  return `${isNegative ? '-' : ''}${config.symbol}${formattedNum}`;
}
