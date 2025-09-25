export const cohortRetention = [
  { cohort: "Week 1", d1: 0.36, d7: 0.18 },
  { cohort: "Week 2", d1: 0.34, d7: 0.16 },
  { cohort: "Week 3", d1: 0.32, d7: 0.15 },
];

export const offerExperiments = [
  { variant: "A", uplift: 0.08 },
  { variant: "B", uplift: 0.12 },
  { variant: "C", uplift: -0.02 },
];

export const crashHeat = [
  { slot: "Android · Mid", crashes: 42 },
  { slot: "Android · High", crashes: 21 },
  { slot: "iOS · Mid", crashes: 18 },
  { slot: "iOS · High", crashes: 9 },
];

export const eventStream = [
  { id: "evt-9001", type: "Purchase", message: "Starter pack", timestamp: "09:32" },
  { id: "evt-9005", type: "Crash", message: "v5.2.1 - shader", timestamp: "09:34" },
  { id: "evt-9011", type: "Promo", message: "Guild boost", timestamp: "09:37" },
];
