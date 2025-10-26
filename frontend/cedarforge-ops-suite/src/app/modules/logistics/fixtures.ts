export const laneHealth = [
  { lane: "LAX → ORD", onTime: 0.87, delayed: 0.11, exceptions: 0.02 },
  { lane: "DFW → JFK", onTime: 0.82, delayed: 0.14, exceptions: 0.04 },
  { lane: "SEA → ATL", onTime: 0.9, delayed: 0.08, exceptions: 0.02 },
  { lane: "PDX → DEN", onTime: 0.88, delayed: 0.1, exceptions: 0.02 },
];

export const hubThroughput = [
  { hub: "LAX", hourly: [420, 480, 520, 610, 580, 540] },
  { hub: "ORD", hourly: [320, 340, 410, 430, 450, 470] },
  { hub: "ATL", hourly: [360, 380, 420, 460, 480, 500] },
];

export const carrierScorecard = [
  { carrier: "SwiftFreight", otif: 0.91, costPerStop: 38.4, exceptions: 6 },
  { carrier: "Northline", otif: 0.88, costPerStop: 36.1, exceptions: 11 },
  { carrier: "BlueSky", otif: 0.93, costPerStop: 40.3, exceptions: 4 },
  { carrier: "Velocity", otif: 0.86, costPerStop: 32.9, exceptions: 13 },
];

export const exceptionFeed = [
  { id: "exc-1201", type: "Delay", severity: "High", message: "Storm closure on I-80", etaImpact: "4h" },
  { id: "exc-1204", type: "Damage", severity: "Medium", message: "Pallet tilt sensor triggered", etaImpact: "Investigate" },
  { id: "exc-1207", type: "Stockout", severity: "High", message: "Hub ORD < 2h safety stock", etaImpact: "Re-slot" },
];

export const logisticsAutomations = [
  {
    id: "log-auto-1",
    name: "Dynamic re-slotting",
    trigger: "Anomaly",
    cadence: "Real-time",
    status: "Running",
  },
  {
    id: "log-auto-2",
    name: "Carrier auto-rebid",
    trigger: "Schedule",
    cadence: "Weekly",
    status: "Ready",
  },
  {
    id: "log-auto-3",
    name: "Cut-off breach reroute",
    trigger: "Threshold",
    cadence: "5 min",
    status: "Running",
  },
];
