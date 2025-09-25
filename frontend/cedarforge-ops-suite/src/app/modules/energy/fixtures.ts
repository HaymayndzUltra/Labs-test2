export const loadCurve = Array.from({ length: 24 }).map((_, hour) => ({
  hour,
  load: 420 + Math.sin((hour / 24) * Math.PI * 2) * 120,
  forecast: 400 + Math.sin((hour / 24) * Math.PI * 2) * 110,
}));

export const derOutput = [
  { label: "Solar", value: 320 },
  { label: "Wind", value: 210 },
  { label: "Storage", value: 140 },
  { label: "Hydro", value: 80 },
];

export const outageMap = [
  { region: "North", outages: 6, crews: 4 },
  { region: "Central", outages: 2, crews: 3 },
  { region: "South", outages: 8, crews: 6 },
];

export const workOrders = [
  { id: "WO-3012", crew: "Crew A", status: "Dispatched", duration: "1:40" },
  { id: "WO-3019", crew: "Crew B", status: "On site", duration: "0:55" },
  { id: "WO-3024", crew: "Crew D", status: "Queued", duration: "—" },
];
