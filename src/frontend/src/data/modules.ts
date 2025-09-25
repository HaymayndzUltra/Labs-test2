export type ModuleId =
  | "saas"
  | "ecommerce"
  | "analytics"
  | "customapp"
  | "media"
  | "edtech"
  | "realestate"
  | "finance"
  | "healthcare";

export interface ModuleDefinition {
  id: ModuleId;
  name: string;
  path: string;
  description: string;
}

export const modules: ModuleDefinition[] = [
  { id: "saas", name: "SaaS Operations", path: "/saas", description: "Subscription intelligence & API ops" },
  { id: "ecommerce", name: "E-commerce", path: "/ecommerce", description: "Merchandising, orders & fulfillment" },
  { id: "analytics", name: "Corporate Analytics", path: "/analytics", description: "Growth marketing & pipeline" },
  { id: "customapp", name: "Productivity Suite", path: "/custom-app", description: "Custom web app delivery" },
  { id: "media", name: "Content & Media", path: "/media", description: "Publishing workflow & engagement" },
  { id: "edtech", name: "EdTech", path: "/edtech", description: "Learning analytics & student success" },
  { id: "realestate", name: "Real Estate", path: "/real-estate", description: "Listings & momentum" },
  { id: "finance", name: "Finance", path: "/finance", description: "Expense vs budget & ROI" },
  { id: "healthcare", name: "Healthcare", path: "/healthcare", description: "Appointments & satisfaction" }
];
