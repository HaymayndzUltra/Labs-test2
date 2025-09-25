const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat(undefined, {
  style: 'decimal',
  maximumFractionDigits: 0,
});

const rateFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatInteger(value: number) {
  return integerFormatter.format(value);
}

export function formatRate(value: number) {
  return rateFormatter.format(value);
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatChange(value: number) {
  const sign = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${sign}${Math.abs(value).toFixed(1)}%`;
}
