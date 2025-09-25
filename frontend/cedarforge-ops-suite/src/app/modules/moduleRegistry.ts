import type { ModuleKey } from "@shared/state/uiStore";
import { lazy } from "react";

export interface ModuleViewProps {
  onToast: (toast: { id: string; title: string; description?: string; tone: "success" | "danger" | "warning" | "info" }) => void;
}

export interface ModuleDefinition {
  key: ModuleKey;
  name: string;
  accentToken: string;
  description: string;
  component: React.LazyExoticComponent<(props: ModuleViewProps) => JSX.Element>;
}

export const modules: ModuleDefinition[] = [
  {
    key: "finops",
    name: "FinOps Treasury & Revenue Assurance",
    accentToken: "var(--accent-finops)",
    description: "Monitor cash position, leakage, and payment health across providers.",
    component: lazy(() => import("./finops/pages/FinOpsDashboard")),
  },
  {
    key: "logistics",
    name: "Supply Chain & Last-Mile Logistics",
    accentToken: "var(--accent-logistics)",
    description: "Track OTIF, lane health, and carrier performance with proactive automations.",
    component: lazy(() => import("./logistics/pages/LogisticsDashboard")),
  },
  {
    key: "energy",
    name: "Energy & Utilities Ops",
    accentToken: "var(--accent-energy)",
    description: "Balance grid load, DER output, and outage response.",
    component: lazy(() => import("./energy/pages/EnergyDashboard")),
  },
  {
    key: "people",
    name: "PeopleOps & Hiring Command",
    accentToken: "var(--accent-hr)",
    description: "Orchestrate hiring funnels, SLAs, and diversity guardrails.",
    component: lazy(() => import("./people/pages/PeopleDashboard")),
  },
  {
    key: "iot",
    name: "IoT Fleet & Telematics",
    accentToken: "var(--accent-iot)",
    description: "Stay ahead on device uptime, latency, and maintenance backlog.",
    component: lazy(() => import("./iot/pages/IoTDashboard")),
  },
  {
    key: "gaming",
    name: "Gaming LiveOps & Monetization",
    accentToken: "var(--accent-gaming)",
    description: "Optimize retention, monetization, and stability in real time.",
    component: lazy(() => import("./gaming/pages/GamingDashboard")),
  },
  {
    key: "hospitality",
    name: "Hospitality & Guest Experience",
    accentToken: "var(--accent-hospitality)",
    description: "Balance occupancy, service SLAs, and VIP experiences.",
    component: lazy(() => import("./hospitality/pages/HospitalityDashboard")),
  },
];

export const getModuleDefinition = (key: ModuleKey) => modules.find((module) => module.key === key)!;
