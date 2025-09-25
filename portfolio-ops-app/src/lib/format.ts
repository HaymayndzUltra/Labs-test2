const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0
});

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  maximumFractionDigits: 2,
  minimumFractionDigits: 1
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);
export const formatNumber = (value: number) => numberFormatter.format(value);
export const formatPercent = (value: number) => percentFormatter.format(value);

export const formatDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours) {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  return `00:${minutes.toString().padStart(2, '0')}`;
};
