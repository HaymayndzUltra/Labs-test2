export const deviceHealth = [
  { segment: "Core", healthy: 0.92, warning: 0.05, critical: 0.03 },
  { segment: "Edge", healthy: 0.88, warning: 0.08, critical: 0.04 },
  { segment: "Retail", healthy: 0.9, warning: 0.06, critical: 0.04 },
];

export const latencyHistogram = [
  { bucket: "<100ms", count: 1420 },
  { bucket: "100-250ms", count: 960 },
  { bucket: "250-500ms", count: 340 },
  { bucket: ">500ms", count: 120 },
];

export const maintenanceBacklog = [
  { device: "HVAC-201", issue: "Fan vibration", status: "Scheduled" },
  { device: "GEN-44", issue: "Fuel mix", status: "Investigating" },
  { device: "RDR-88", issue: "Sensor drift", status: "Assigned" },
];
