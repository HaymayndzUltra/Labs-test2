import { format, parseISO } from "date-fns";

export const formatCurrency = (value: number, currency = "USD") =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export const formatPercent = (value: number, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) =>
  new Intl.NumberFormat(undefined, {
    style: "percent",
    minimumFractionDigits: options?.minimumFractionDigits ?? 1,
    maximumFractionDigits: options?.maximumFractionDigits ?? 1,
  }).format(value);

export const formatRate = (value: number, fractionDigits = 1) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

export const formatDuration = (seconds: number) => {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const formatDateRange = (fromIso: string, toIso: string) => {
  const from = parseISO(fromIso);
  const to = parseISO(toIso);
  return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
};
