export interface CashWaterfallPoint {
  stage: string;
  amount: number;
}

export const cashWaterfall: CashWaterfallPoint[] = [
  { stage: "Opening Balance", amount: 12_500_000 },
  { stage: "Collections", amount: 3_200_000 },
  { stage: "Payroll", amount: -1_850_000 },
  { stage: "Vendors", amount: -1_150_000 },
  { stage: "Taxes", amount: -420_000 },
  { stage: "Closing Balance", amount: 12_280_000 },
];

export interface RevenueLeakageBar {
  type: string;
  prevented: number;
  unresolved: number;
}

export const revenueLeakage: RevenueLeakageBar[] = [
  { type: "Tax mismatches", prevented: 240_000, unresolved: 80_000 },
  { type: "Shipping variance", prevented: 180_000, unresolved: 60_000 },
  { type: "FX slippage", prevented: 120_000, unresolved: 45_000 },
  { type: "Invoice errors", prevented: 90_000, unresolved: 30_000 },
];

export interface CollectionsAgingRow {
  customer: string;
  current: number;
  d30: number;
  d60: number;
  d90: number;
}

export const collectionsAging: CollectionsAgingRow[] = [
  { customer: "Northwind Retail", current: 540_000, d30: 120_000, d60: 32_000, d90: 8_000 },
  { customer: "Alta Manufacturing", current: 410_000, d30: 65_000, d60: 15_000, d90: 0 },
  { customer: "Glacier Travel", current: 280_000, d30: 54_000, d60: 18_000, d90: 5_000 },
  { customer: "Helios Cloud", current: 360_000, d30: 40_000, d60: 9_000, d90: 0 },
];

export interface ForecastPoint {
  label: string;
  actual: number;
  forecast: number;
  target: number;
}

export const forecastVsActual: ForecastPoint[] = [
  { label: "Jan", actual: 1_120_000, forecast: 1_080_000, target: 1_050_000 },
  { label: "Feb", actual: 1_180_000, forecast: 1_150_000, target: 1_100_000 },
  { label: "Mar", actual: 1_240_000, forecast: 1_210_000, target: 1_150_000 },
  { label: "Apr", actual: 1_300_000, forecast: 1_260_000, target: 1_200_000 },
];

export interface PaymentHealthRow {
  region: string;
  bin: string;
  successRate: number;
  anomalyScore: number;
}

export const paymentHealth: PaymentHealthRow[] = [
  { region: "NA", bin: "4026", successRate: 0.973, anomalyScore: 0.12 },
  { region: "EU", bin: "5353", successRate: 0.951, anomalyScore: 0.28 },
  { region: "APAC", bin: "4532", successRate: 0.962, anomalyScore: 0.18 },
  { region: "LATAM", bin: "4128", successRate: 0.944, anomalyScore: 0.31 },
];

export const finopsAutomations = [
  {
    id: "auto-finops-1",
    name: "Leakage detector EU VAT",
    trigger: "Anomaly",
    cadence: "Hourly",
    status: "Ready",
  },
  {
    id: "auto-finops-2",
    name: "Failed payment recovery ladder",
    trigger: "Threshold",
    cadence: "15 min",
    status: "Running",
  },
  {
    id: "auto-finops-3",
    name: "Net burn guardrail",
    trigger: "Schedule",
    cadence: "Daily",
    status: "Running",
  },
];
