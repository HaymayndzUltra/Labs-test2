const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1
});

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const durationFormatter = new Intl.DateTimeFormat(undefined, {
  minute: "2-digit",
  second: "2-digit",
  timeZone: "UTC"
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);
export const formatNumber = (value: number) => numberFormatter.format(value);
export const formatPercent = (value: number) => percentFormatter.format(value);
export const formatDuration = (seconds: number) => {
  const baseDate = new Date(0);
  baseDate.setSeconds(seconds);
  return durationFormatter.format(baseDate);
};

export const formatTrend = (value: number) => (value > 0 ? `+${formatPercent(value)}` : formatPercent(value));
