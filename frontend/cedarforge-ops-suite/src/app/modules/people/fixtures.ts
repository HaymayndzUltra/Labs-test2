export const funnel = [
  { stage: "Applicants", count: 1280 },
  { stage: "Phone screen", count: 420 },
  { stage: "Onsite", count: 160 },
  { stage: "Offer", count: 52 },
  { stage: "Hire", count: 38 },
];

export const compBands = [
  { band: "L3", range: [95_000, 128_000] },
  { band: "L4", range: [120_000, 155_000] },
  { band: "L5", range: [150_000, 195_000] },
];

export const attritionCohorts = [
  { cohort: "Sales", attrition: 0.18 },
  { cohort: "Engineering", attrition: 0.09 },
  { cohort: "Support", attrition: 0.14 },
  { cohort: "Ops", attrition: 0.11 },
];

export const interviewLoad = [
  { interviewer: "Harper", interviews: 16 },
  { interviewer: "Mika", interviews: 12 },
  { interviewer: "Theo", interviews: 18 },
  { interviewer: "Lena", interviews: 14 },
];

export const feedbackQueue = [
  { candidate: "A. Rivera", stage: "Onsite", aging: "18h" },
  { candidate: "J. Chen", stage: "Panel", aging: "9h" },
  { candidate: "K. Patel", stage: "Offer", aging: "2h" },
];
