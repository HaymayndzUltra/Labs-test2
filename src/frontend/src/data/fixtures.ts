import type { ModuleId } from "./modules";

export interface Kpi {
  id: string;
  label: string;
  value: number;
  type: "currency" | "number" | "percent" | "duration";
  delta: number;
  deltaLabel: string;
  timeBasis: string;
}

export interface TableRow extends Record<string, string | number> {}

export interface ChartDatum extends Record<string, string | number> {}

export interface ModuleFixture {
  accentToken: string;
  kpis: Kpi[];
  tables: Record<string, { columns: { key: string; label: string; align?: "start" | "end" }[]; rows: TableRow[] }>;
  charts: Record<string, ChartDatum[]>;
  descriptions: Record<string, string>;
  automations: {
    triggers: { id: string; label: string; description: string }[];
    conditions: { id: string; label: string; description: string }[];
    actions: { id: string; label: string; description: string }[];
    cadences: { id: string; label: string; description: string }[];
  };
  lists: Record<string, { title: string; items: { title: string; meta: string; tone?: string }[] }>;
}

export const fixtures: Record<ModuleId, ModuleFixture> = {
  saas: {
    accentToken: "var(--vertical-saas)",
    kpis: [
      { id: "mrr", label: "Monthly Recurring Revenue", value: 420000, type: "currency", delta: 0.06, deltaLabel: "Up 6% vs last month", timeBasis: "vs. prior month" },
      { id: "workspaces", label: "Active Workspaces", value: 1280, type: "number", delta: 0.03, deltaLabel: "Up 3%", timeBasis: "30-day active" },
      { id: "api", label: "API Consumption (30-day)", value: 7800000, type: "number", delta: -0.02, deltaLabel: "Down 2%", timeBasis: "Requests" },
      { id: "nrr", label: "Net Revenue Retention", value: 1.12, type: "percent", delta: 0.01, deltaLabel: "Up 1 pt", timeBasis: "Rolling 12 months" }
    ],
    tables: {
      plans: {
        columns: [
          { key: "plan", label: "Plan" },
          { key: "price", label: "Price" },
          { key: "seats", label: "Seats" },
          { key: "activation", label: "Activation" },
          { key: "allocation", label: "Allocation" },
          { key: "churn", label: "Churn", align: "end" }
        ],
        rows: [
          { plan: "Starter", price: "$49", seats: 25, activation: "92%", allocation: "88%", churn: "1.2%" },
          { plan: "Growth", price: "$199", seats: 100, activation: "87%", allocation: "79%", churn: "2.8%" },
          { plan: "Scale", price: "$499", seats: 500, activation: "81%", allocation: "72%", churn: "4.6%" },
          { plan: "Enterprise", price: "Custom", seats: 2000, activation: "75%", allocation: "61%", churn: "3.2%" }
        ]
      }
    },
    charts: {
      churnHealth: [
        { stage: "Healthy", value: 62 },
        { stage: "Monitor", value: 28 },
        { stage: "Critical", value: 10 }
      ],
      mrrGrowth: [
        { month: "Jan", mrr: 360000 },
        { month: "Feb", mrr: 372000 },
        { month: "Mar", mrr: 388000 },
        { month: "Apr", mrr: 402000 },
        { month: "May", mrr: 415000 },
        { month: "Jun", mrr: 420000 }
      ],
      apiUsage: [
        { day: "Mon", saturation: 64 },
        { day: "Tue", saturation: 72 },
        { day: "Wed", saturation: 88 },
        { day: "Thu", saturation: 90 },
        { day: "Fri", saturation: 76 }
      ]
    },
    descriptions: {
      churnHealth: "Current customer health segmentation with action cues.",
      mrrGrowth: "MRR progression across the last six months.",
      apiUsage: "API saturation compared with allocated capacity."
    },
    automations: {
      triggers: [
        { id: "api-drop", label: "API drop", description: "Detect >15% drop in daily calls" },
        { id: "seat-underuse", label: "Seat underuse", description: "Seats <60% utilization" },
        { id: "nrr-dip", label: "NRR dip", description: "Net retention <105%" }
      ],
      conditions: [
        { id: "plan-tier", label: "Plan tier", description: "Enterprise + Scale" },
        { id: "region", label: "Region", description: "North America" },
        { id: "risk-score", label: "Risk score", description: ">0.7 predictive churn" }
      ],
      actions: [
        { id: "csm-task", label: "Create CSM task", description: "Assign to workspace owner" },
        { id: "email", label: "Send in-app/email nudge", description: "Share utilization tips" },
        { id: "slack", label: "Post to Slack", description: "Notify escalation channel" }
      ],
      cadences: [
        { id: "immediate", label: "Immediate", description: "Instant action" },
        { id: "daily", label: "Daily digest", description: "Queue for daily run" },
        { id: "weekly", label: "Weekly", description: "Bundle for weekly review" }
      ]
    },
    lists: {
      orchestration: {
        title: "Billing cycle orchestration",
        items: [
          { title: "Card expirations", meta: "42 upcoming", tone: "warning" },
          { title: "Dunning queue", meta: "18 accounts", tone: "danger" },
          { title: "Monthly close checklist", meta: "On track", tone: "success" }
        ]
      },
      playbooks: {
        title: "Churn recovery playbook",
        items: [
          { title: "Template: Platform adoption", meta: "Fallback owner: Jamie" },
          { title: "Trigger threshold", meta: "Usage saturation <65%" },
          { title: "Preview", meta: "Warm touch email" }
        ]
      }
    }
  },
  ecommerce: {
    accentToken: "var(--vertical-ecommerce)",
    kpis: [
      { id: "gmv", label: "GMV", value: 985000, type: "currency", delta: 0.08, deltaLabel: "Up 8%", timeBasis: "vs last week" },
      { id: "orders", label: "Orders (7-day)", value: 18240, type: "number", delta: 0.04, deltaLabel: "Up 4%", timeBasis: "Last 7 days" },
      { id: "aov", label: "Average Order Value", value: 142, type: "currency", delta: 0.02, deltaLabel: "Up $2", timeBasis: "vs last week" },
      { id: "returns", label: "Return rate", value: 0.064, type: "percent", delta: -0.01, deltaLabel: "Down 1 pt", timeBasis: "Rolling 30 days" }
    ],
    tables: {
      topProducts: {
        columns: [
          { key: "product", label: "Product" },
          { key: "category", label: "Category" },
          { key: "revenue", label: "Revenue" },
          { key: "conversion", label: "Conversion" },
          { key: "inventory", label: "Inventory" },
          { key: "trend", label: "Trend" }
        ],
        rows: [
          { product: "Aurora Hoodie", category: "Apparel", revenue: "$182K", conversion: "4.8%", inventory: "32 days", trend: "▲" },
          { product: "Trail Runner", category: "Footwear", revenue: "$145K", conversion: "3.1%", inventory: "18 days", trend: "▲" },
          { product: "Summit Bottle", category: "Accessories", revenue: "$98K", conversion: "6.5%", inventory: "44 days", trend: "▬" }
        ]
      }
    },
    charts: {
      salesTrend: [
        { week: "Week 1", ecommerce: 210000 },
        { week: "Week 2", ecommerce: 240000 },
        { week: "Week 3", ecommerce: 260000 },
        { week: "Week 4", ecommerce: 275000 }
      ],
      operationalHealth: [
        { category: "Fulfillment SLA", status: 96 },
        { category: "Payment health", status: 92 },
        { category: "Support backlog", status: 18 }
      ]
    },
    descriptions: {
      salesTrend: "Stacked comparison of promo vs evergreen sales.",
      operationalHealth: "Operational signal health across fulfillment and support."
    },
    automations: {
      triggers: [
        { id: "abandoned", label: "Abandoned cart", description: ">$200 AOV segments" },
        { id: "inventory", label: "Inventory threshold", description: "Days of cover < 12" },
        { id: "returns", label: "High return SKU", description: ">18% return rate" }
      ],
      conditions: [
        { id: "audience", label: "Audience", description: "VIP + Loyalty" },
        { id: "channel", label: "Channel", description: "Email + SMS" },
        { id: "guardrail", label: "Throttling guardrail", description: "Respect stock limits" }
      ],
      actions: [
        { id: "campaign", label: "Launch campaign", description: "Trigger promotion builder" },
        { id: "sms", label: "Send SMS", description: "Twilio integration" },
        { id: "pause", label: "Pause ads", description: "Meta/Google throttle" }
      ],
      cadences: [
        { id: "burst", label: "Burst", description: "Rapid 4h cadence" },
        { id: "daily", label: "Daily", description: "Daily sync" },
        { id: "weekly", label: "Weekly", description: "Weekly rollup" }
      ]
    },
    lists: {
      promotionBuilder: {
        title: "Seasonal promotion guardrails",
        items: [
          { title: "Campaign: Summer launch", meta: "Audience: VIP + high intent" },
          { title: "Incentive", meta: "Buy 2 get 20%" },
          { title: "Throttle", meta: "Inventory floor: 15 days" }
        ]
      },
      automation: {
        title: "Automation orchestration",
        items: [
          { title: "Abandoned cart", meta: "Live • 3 touch series", tone: "success" },
          { title: "Inventory replenish", meta: "Paused • awaiting PO", tone: "warning" },
          { title: "VIP delight", meta: "Draft • needs creative", tone: "info" }
        ]
      }
    }
  },
  analytics: {
    accentToken: "var(--vertical-analytics)",
    kpis: [
      { id: "pipeline", label: "Qualified pipeline", value: 12_800_000, type: "currency", delta: 0.12, deltaLabel: "Up 12%", timeBasis: "Current quarter" },
      { id: "visitors", label: "Monthly unique visitors", value: 280000, type: "number", delta: 0.05, deltaLabel: "Up 5%", timeBasis: "Last 30 days" },
      { id: "conversion", label: "M→SQL conversion", value: 0.18, type: "percent", delta: 0.02, deltaLabel: "Up 2 pts", timeBasis: "Rolling 90 days" },
      { id: "cycle", label: "Sales cycle", value: 42 * 60, type: "duration", delta: -0.05, deltaLabel: "Down 5%", timeBasis: "Avg days" }
    ],
    tables: {
      executive: {
        columns: [
          { key: "insight", label: "Insight" },
          { key: "context", label: "Context" }
        ],
        rows: [
          { insight: "ABM programs contributed 38% of pipeline", context: "B2B field events driving outsized SQLs" },
          { insight: "Creative fatigue detected on paid social", context: "Shift 12% budget to retargeting" },
          { insight: "Partner referrals up 22%", context: "Enablement kit adoption up" }
        ]
      }
    },
    charts: {
      funnel: [
        { stage: "Visitors", value: 280000 },
        { stage: "Marketing qualified", value: 54000 },
        { stage: "Sales qualified", value: 14200 },
        { stage: "Opportunities", value: 6200 },
        { stage: "Closed", value: 2100 }
      ],
      leadMix: [
        { source: "Organic", share: 34 },
        { source: "Paid", share: 26 },
        { source: "Partners", share: 18 },
        { source: "Events", share: 12 },
        { source: "Product", share: 10 }
      ]
    },
    descriptions: {
      funnel: "Conversion funnel from visitors through closed won.",
      leadMix: "Lead source mix sorted by contribution."
    },
    automations: {
      triggers: [
        { id: "intent", label: "Intent surge", description: "6sense score > 90" },
        { id: "sla", label: "Lifecycle SLA", description: "MQL aging > 12h" },
        { id: "attribution", label: "Attribution guardrail", description: "ROAS < 1.5" }
      ],
      conditions: [
        { id: "segment", label: "Segment", description: "Enterprise" },
        { id: "owner", label: "Owner", description: "Route to SDR pod" },
        { id: "budget", label: "Budget", description: "Reallocate underperforming spend" }
      ],
      actions: [
        { id: "route", label: "Route to SDR", description: "Assign & post to Slack" },
        { id: "boost", label: "Boost winner", description: "Increase spend 10%" },
        { id: "pause", label: "Pause creative", description: "Notify paid team" }
      ],
      cadences: [
        { id: "instant", label: "Instant", description: "Immediately" },
        { id: "hourly", label: "Hourly", description: "Hourly sync" },
        { id: "daily", label: "Daily", description: "Daily digest" }
      ]
    },
    lists: {
      insights: {
        title: "Executive insights",
        items: [
          { title: "Pipeline coverage 3.8x target", meta: "All segments", tone: "success" },
          { title: "Paid social fatigue", meta: "Consider creative refresh", tone: "warning" },
          { title: "Partner referrals climbing", meta: "Enablement kit performing" }
        ]
      }
    }
  },
  customapp: {
    accentToken: "var(--vertical-customapp)",
    kpis: [
      { id: "velocity", label: "Delivery velocity", value: 74, type: "number", delta: 0.04, deltaLabel: "Up 4%", timeBasis: "Story points/week" },
      { id: "ideas", label: "Idea intake", value: 56, type: "number", delta: -0.12, deltaLabel: "Down 12%", timeBasis: "Last 30 days" },
      { id: "automation", label: "Automations live", value: 18, type: "number", delta: 0.2, deltaLabel: "Up 20%", timeBasis: "Active workflows" },
      { id: "happiness", label: "Team health", value: 0.86, type: "percent", delta: 0.03, deltaLabel: "Up 3 pts", timeBasis: "Weekly pulse" }
    ],
    tables: {
      backlog: {
        columns: [
          { key: "idea", label: "Idea" },
          { key: "impact", label: "Impact" },
          { key: "effort", label: "Effort" },
          { key: "status", label: "Status" }
        ],
        rows: [
          { idea: "Unified notification center", impact: "High", effort: "Medium", status: "Ready" },
          { idea: "AI brief assistant", impact: "Medium", effort: "Low", status: "In discovery" },
          { idea: "Workflow templates", impact: "High", effort: "Medium", status: "Refinement" }
        ]
      }
    },
    charts: {
      workload: [
        { lane: "Backlog", tasks: 32 },
        { lane: "In progress", tasks: 18 },
        { lane: "Review", tasks: 9 },
        { lane: "Done", tasks: 54 }
      ]
    },
    descriptions: {
      workload: "Task distribution across delivery lanes."
    },
    automations: {
      triggers: [
        { id: "ritual", label: "Sprint ritual", description: "Schedule planning & retro" },
        { id: "workload", label: "Workload imbalance", description: ">20% delta" },
        { id: "stale", label: "Stale ticket", description: ">5 days idle" }
      ],
      conditions: [
        { id: "team", label: "Team", description: "Team Alpha" },
        { id: "priority", label: "Priority", description: "High" },
        { id: "devops", label: "DevOps hook", description: "PR merged" }
      ],
      actions: [
        { id: "nudge", label: "Send nudge", description: "Slack message" },
        { id: "schedule", label: "Schedule ritual", description: "Calendar invite" },
        { id: "rebalance", label: "Suggest rebalancing", description: "Shift to available owner" }
      ],
      cadences: [
        { id: "once", label: "One-time", description: "Run immediately" },
        { id: "recurring", label: "Recurring", description: "Weekly" },
        { id: "monthly", label: "Monthly", description: "Monthly reset" }
      ]
    },
    lists: {
      kanban: {
        title: "Kanban lanes",
        items: [
          { title: "Backlog", meta: "32 cards", tone: "info" },
          { title: "In progress", meta: "18 cards", tone: "warning" },
          { title: "Review", meta: "9 cards" }
        ]
      }
    }
  },
  media: {
    accentToken: "var(--vertical-media)",
    kpis: [
      { id: "plays", label: "Monthly plays/reads", value: 1_800_000, type: "number", delta: 0.11, deltaLabel: "Up 11%", timeBasis: "Rolling 30 days" },
      { id: "watch", label: "Avg watch time", value: 5 * 60 + 42, type: "duration", delta: 0.04, deltaLabel: "Up 4%", timeBasis: "mm:ss" },
      { id: "subs", label: "Subscriber growth", value: 0.072, type: "percent", delta: 0.01, deltaLabel: "Up 1 pt", timeBasis: "vs last month" },
      { id: "engagement", label: "Engagement score", value: 86, type: "number", delta: 0.05, deltaLabel: "Up 5%", timeBasis: "Composite" }
    ],
    tables: {
      stories: {
        columns: [
          { key: "title", label: "Title" },
          { key: "format", label: "Format" },
          { key: "window", label: "Window" },
          { key: "engagement", label: "Engagement" },
          { key: "status", label: "Status" }
        ],
        rows: [
          { title: "AI in production", format: "Video", window: "7 days", engagement: "92", status: "Ready" },
          { title: "Supply chain deep dive", format: "Article", window: "30 days", engagement: "88", status: "In review" },
          { title: "Leadership AMA", format: "Podcast", window: "14 days", engagement: "76", status: "Blocked" }
        ]
      }
    },
    charts: {
      engagement: [
        { day: "Mon", engagement: 72 },
        { day: "Tue", engagement: 78 },
        { day: "Wed", engagement: 88 },
        { day: "Thu", engagement: 92 },
        { day: "Fri", engagement: 86 }
      ]
    },
    descriptions: {
      engagement: "Engagement trend with markers for spikes."
    },
    automations: {
      triggers: [
        { id: "control", label: "Editorial control", description: "Advance statuses" },
        { id: "tagging", label: "Auto-tagging", description: "Taxonomy enforcement" },
        { id: "highlight", label: "Highlight reel", description: "Auto clip" }
      ],
      conditions: [
        { id: "channel", label: "Channel", description: "YouTube + OTT" },
        { id: "compliance", label: "Compliance", description: "Brand safety" },
        { id: "rights", label: "Rights window", description: "Check expiration" }
      ],
      actions: [
        { id: "publish", label: "Publish", description: "Omnichannel launch" },
        { id: "annotate", label: "Annotate", description: "Apply taxonomy" },
        { id: "distribute", label: "Distribute highlights", description: "Send to social" }
      ],
      cadences: [
        { id: "real-time", label: "Real time", description: "On publish" },
        { id: "hourly", label: "Hourly", description: "Hourly sync" },
        { id: "daily", label: "Daily", description: "Daily health" }
      ]
    },
    lists: {
      queue: {
        title: "Publishing queue",
        items: [
          { title: "AI in production", meta: "Ready", tone: "success" },
          { title: "Supply chain deep dive", meta: "In review", tone: "warning" },
          { title: "Leadership AMA", meta: "Blocked", tone: "danger" }
        ]
      }
    }
  },
  edtech: {
    accentToken: "var(--vertical-edtech)",
    kpis: [
      { id: "learners", label: "Active learners", value: 45200, type: "number", delta: 0.07, deltaLabel: "Up 7%", timeBasis: "Rolling 30 days" },
      { id: "completion", label: "Completion rate", value: 0.78, type: "percent", delta: 0.03, deltaLabel: "Up 3 pts", timeBasis: "Course completion" },
      { id: "quiz", label: "Avg quiz score", value: 0.84, type: "percent", delta: 0.02, deltaLabel: "Up 2 pts", timeBasis: "All quizzes" },
      { id: "certs", label: "Certificates issued", value: 1240, type: "number", delta: 0.16, deltaLabel: "Up 16%", timeBasis: "Monthly" }
    ],
    tables: {
      programs: {
        columns: [
          { key: "course", label: "Course" },
          { key: "enrollment", label: "Enrollment" },
          { key: "completion", label: "Completion" },
          { key: "score", label: "Avg score" }
        ],
        rows: [
          { course: "Data Science 201", enrollment: 3200, completion: "82%", score: "88" },
          { course: "Cybersecurity Essentials", enrollment: 2800, completion: "74%", score: "81" },
          { course: "Leadership Lab", enrollment: 1800, completion: "69%", score: "85" }
        ]
      }
    },
    charts: {
      activity: [
        { day: "Mon", active: 6200 },
        { day: "Tue", active: 6400 },
        { day: "Wed", active: 7100 },
        { day: "Thu", active: 6800 },
        { day: "Fri", active: 5900 }
      ]
    },
    descriptions: {
      activity: "Student activity intensity heatmap proxy."
    },
    automations: {
      triggers: [
        { id: "certificate", label: "Auto certificate", description: "On completion" },
        { id: "inactivity", label: "Inactivity nudge", description: ">7 days" },
        { id: "mentor", label: "Mentor rotation", description: "Balance load" }
      ],
      conditions: [
        { id: "program", label: "Program", description: "Leadership track" },
        { id: "cohort", label: "Cohort", description: "Spring" },
        { id: "integrity", label: "Integrity flag", description: "Proctoring" }
      ],
      actions: [
        { id: "badge", label: "Issue badge", description: "Open Badges" },
        { id: "email", label: "Send email", description: "Mentor update" },
        { id: "queue", label: "Add to review queue", description: "Mastery dips" }
      ],
      cadences: [
        { id: "instant", label: "Instant", description: "Immediate" },
        { id: "daily", label: "Daily", description: "Daily digest" },
        { id: "weekly", label: "Weekly", description: "Weekly review" }
      ]
    },
    lists: {
      orchestration: {
        title: "Automation orchestration",
        items: [
          { title: "Auto certificates", meta: "Live", tone: "success" },
          { title: "Inactivity nudges", meta: "Tuning thresholds", tone: "warning" },
          { title: "Mentor rotation", meta: "Draft" }
        ]
      }
    }
  },
  realestate: {
    accentToken: "var(--vertical-realestate)",
    kpis: [
      { id: "listings", label: "Active listings", value: 860, type: "number", delta: 0.05, deltaLabel: "Up 5%", timeBasis: "Rolling 30 days" },
      { id: "inquiries", label: "Qualified inquiries", value: 1240, type: "number", delta: 0.09, deltaLabel: "Up 9%", timeBasis: "Per week" },
      { id: "response", label: "Avg response time", value: 18 * 60, type: "duration", delta: -0.12, deltaLabel: "Down 12%", timeBasis: "Minutes" }
    ],
    tables: {
      listings: {
        columns: [
          { key: "title", label: "Listing" },
          { key: "location", label: "Location" },
          { key: "price", label: "Price" },
          { key: "status", label: "Status" }
        ],
        rows: [
          { title: "Skyline Lofts", location: "Seattle, WA", price: "$1.2M", status: "Active" },
          { title: "Harbor Townhomes", location: "Boston, MA", price: "$890K", status: "Under offer" },
          { title: "Sunset Villas", location: "Austin, TX", price: "$1.05M", status: "Active" }
        ]
      }
    },
    charts: {
      momentum: [
        { month: "Jan", momentum: 48 },
        { month: "Feb", momentum: 54 },
        { month: "Mar", momentum: 60 },
        { month: "Apr", momentum: 66 },
        { month: "May", momentum: 72 }
      ]
    },
    descriptions: {
      momentum: "Market momentum with absorption index"
    },
    automations: {
      triggers: [
        { id: "new-lead", label: "New inquiry", description: "Notify agent" },
        { id: "stale", label: "Stale listing", description: ">14 days" },
        { id: "momentum", label: "Momentum drop", description: "Index < 45" }
      ],
      conditions: [
        { id: "region", label: "Region", description: "West" },
        { id: "price", label: "Price band", description: "$900K-$1.5M" },
        { id: "team", label: "Team", description: "Luxury" }
      ],
      actions: [
        { id: "assign", label: "Assign agent", description: "Notify via app" },
        { id: "campaign", label: "Launch nurture", description: "Email drip" },
        { id: "update", label: "Update listing", description: "Refresh creative" }
      ],
      cadences: [
        { id: "instant", label: "Instant", description: "Immediate" },
        { id: "daily", label: "Daily", description: "Daily summary" },
        { id: "weekly", label: "Weekly", description: "Weekly review" }
      ]
    },
    lists: {
      inquiries: {
        title: "Listings & inquiries",
        items: [
          { title: "Skyline Lofts", meta: "New tour scheduled", tone: "info" },
          { title: "Harbor Townhomes", meta: "Awaiting docs", tone: "warning" },
          { title: "Sunset Villas", meta: "High intent", tone: "success" }
        ]
      }
    }
  },
  finance: {
    accentToken: "var(--vertical-finance)",
    kpis: [
      { id: "expense", label: "Expenses", value: 4_200_000, type: "currency", delta: 0.04, deltaLabel: "Up 4%", timeBasis: "vs budget" },
      { id: "budget", label: "Budget", value: 4_000_000, type: "currency", delta: 0.02, deltaLabel: "Up 2%", timeBasis: "YTD" },
      { id: "roi", label: "ROI", value: 0.36, type: "percent", delta: 0.03, deltaLabel: "Up 3 pts", timeBasis: "Rolling 12 months" }
    ],
    tables: {
      spend: {
        columns: [
          { key: "category", label: "Category" },
          { key: "actual", label: "Actual" },
          { key: "budget", label: "Budget" },
          { key: "variance", label: "Variance" }
        ],
        rows: [
          { category: "Cloud", actual: "$1.2M", budget: "$1.1M", variance: "+$100K" },
          { category: "Payroll", actual: "$1.5M", budget: "$1.6M", variance: "-$100K" },
          { category: "Marketing", actual: "$900K", budget: "$800K", variance: "+$100K" }
        ]
      }
    },
    charts: {
      expenseTrend: [
        { month: "Jan", actual: 320000, budget: 300000 },
        { month: "Feb", actual: 340000, budget: 320000 },
        { month: "Mar", actual: 360000, budget: 330000 },
        { month: "Apr", actual: 380000, budget: 340000 },
        { month: "May", actual: 410000, budget: 360000 }
      ],
      roiBreakdown: [
        { channel: "Product", roi: 38 },
        { channel: "Services", roi: 28 },
        { channel: "Marketplace", roi: 22 },
        { channel: "Other", roi: 12 }
      ]
    },
    descriptions: {
      expenseTrend: "Expense vs budget variance lines.",
      roiBreakdown: "ROI breakdown with high contrast segments."
    },
    automations: {
      triggers: [
        { id: "month-close", label: "Month-end close", description: "Checklist orchestration" },
        { id: "expense-ocr", label: "Expense routing", description: "OCR + policy" },
        { id: "anomaly", label: "Anomaly detection", description: ">10% variance" }
      ],
      conditions: [
        { id: "entity", label: "Entity", description: "Subsidiary" },
        { id: "policy", label: "Policy", description: "PCI compliance" },
        { id: "owner", label: "Owner", description: "Finance controller" }
      ],
      actions: [
        { id: "notify", label: "Notify", description: "Slack + Email" },
        { id: "reconcile", label: "Reconcile", description: "Stripe + ERP" },
        { id: "escalate", label: "Escalate", description: "Exec review" }
      ],
      cadences: [
        { id: "instant", label: "Instant", description: "Real time" },
        { id: "daily", label: "Daily", description: "Daily ledger" },
        { id: "weekly", label: "Weekly", description: "Weekly digest" }
      ]
    },
    lists: {
      compliance: {
        title: "Compliance hooks",
        items: [
          { title: "PCI scope", meta: "In compliance", tone: "success" },
          { title: "Audit log", meta: "12 new entries", tone: "info" }
        ]
      }
    }
  },
  healthcare: {
    accentToken: "var(--vertical-healthcare)",
    kpis: [
      { id: "patients", label: "Active patients", value: 18400, type: "number", delta: 0.05, deltaLabel: "Up 5%", timeBasis: "Rolling 30 days" },
      { id: "satisfaction", label: "Patient satisfaction", value: 0.91, type: "percent", delta: 0.02, deltaLabel: "Up 2 pts", timeBasis: "CAHPS" },
      { id: "throughput", label: "Avg wait", value: 12 * 60, type: "duration", delta: -0.08, deltaLabel: "Down 8%", timeBasis: "Minutes" }
    ],
    tables: {
      appointments: {
        columns: [
          { key: "provider", label: "Provider" },
          { key: "specialty", label: "Specialty" },
          { key: "appointments", label: "Appointments" },
          { key: "status", label: "Status" }
        ],
        rows: [
          { provider: "Dr. Patel", specialty: "Cardiology", appointments: 42, status: "On track" },
          { provider: "Dr. Chen", specialty: "Endocrinology", appointments: 36, status: "Slight delay" },
          { provider: "Dr. Lopez", specialty: "Pediatrics", appointments: 58, status: "On track" }
        ]
      }
    },
    charts: {
      marketMomentum: [
        { month: "Jan", momentum: 62 },
        { month: "Feb", momentum: 64 },
        { month: "Mar", momentum: 68 },
        { month: "Apr", momentum: 70 },
        { month: "May", momentum: 74 }
      ]
    },
    descriptions: {
      marketMomentum: "Patient momentum and satisfaction trends."
    },
    automations: {
      triggers: [
        { id: "reminder", label: "Appointment reminder", description: "SMS/Email" },
        { id: "reschedule", label: "Smart reschedule", description: "Two-way" },
        { id: "csat", label: "Post-visit CSAT", description: "Send survey" }
      ],
      conditions: [
        { id: "department", label: "Department", description: "Outpatient" },
        { id: "compliance", label: "Compliance", description: "HIPAA + audit" },
        { id: "acuity", label: "Acuity", description: "High" }
      ],
      actions: [
        { id: "message", label: "Send message", description: "Twilio integration" },
        { id: "task", label: "Create task", description: "Care team" },
        { id: "log", label: "Log to EHR", description: "FHIR event" }
      ],
      cadences: [
        { id: "immediate", label: "Immediate", description: "Real time" },
        { id: "daily", label: "Daily", description: "Daily summary" },
        { id: "weekly", label: "Weekly", description: "Weekly digest" }
      ]
    },
    lists: {
      compliance: {
        title: "Compliance & safeguards",
        items: [
          { title: "HIPAA audit log", meta: "Up to date", tone: "success" },
          { title: "PHI masking", meta: "Enabled", tone: "info" }
        ]
      }
    }
  }
};
