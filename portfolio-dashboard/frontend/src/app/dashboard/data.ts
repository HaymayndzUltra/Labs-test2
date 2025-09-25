import { cache } from 'react';
import type { PortfolioDashboardResponse } from './types';

const portfolioDashboard = {
  "generatedAt": "2024-12-18T09:00:00.000Z",
  "headline": "Unified Multi-Discipline Portfolio Operations",
  "intro": "A premium dashboard showcasing how our studio orchestrates SaaS, commerce, analytics, content, education, and niche vertical builds with one cohesive product language.",
  "portfolioHighlights": [
    {
      "id": "portfolio-clients",
      "label": "Cross-Industry Deployments",
      "value": "48",
      "change": 12.4,
      "trend": "up",
      "caption": "10 new client launches this quarter",
      "icon": "briefcase"
    },
    {
      "id": "automation-jobs",
      "label": "Active Automations",
      "value": "126",
      "change": 18.2,
      "trend": "up",
      "caption": "Workflow engine uptime 99.9%",
      "icon": "zap"
    },
    {
      "id": "deploy-success",
      "label": "Deployment Success Rate",
      "value": "99.4%",
      "change": 1.4,
      "trend": "up",
      "caption": "Across all managed environments",
      "icon": "shield"
    },
    {
      "id": "cycle-time",
      "label": "Average Time-to-Value",
      "value": "21 days",
      "change": -4.2,
      "trend": "up",
      "caption": "Accelerated onboarding playbooks",
      "icon": "rocket"
    }
  ],
  "quickActions": [
    {
      "id": "schedule-strategy-session",
      "title": "Book Strategy Intensive",
      "description": "Pair with a lead architect to shape your roadmap and delivery model.",
      "ctaLabel": "Schedule Session",
      "icon": "calendar",
      "badge": "Live availability"
    },
    {
      "id": "request-automation-audit",
      "title": "Automation Health Scan",
      "description": "We evaluate billing, lifecycle, and workflow jobs across your stack.",
      "ctaLabel": "Request Audit",
      "icon": "clipboard",
      "badge": "48h turnaround"
    },
    {
      "id": "download-portfolio-kit",
      "title": "Download Capability Kit",
      "description": "Receive the asset pack with architecture maps and delivery timelines.",
      "ctaLabel": "Send Me the Kit",
      "icon": "bookmark"
    }
  ],
  "categories": [
    {
      "id": "saas-dashboard",
      "name": "SaaS Growth Command Center",
      "badge": "SaaS",
      "description": "Subscription intelligence, billing automation, and proactive churn management for cloud platforms.",
      "summary": "Enterprise-grade SaaS instrumentation featuring ARR telemetry, billing orchestration, and adoption programs.",
      "metrics": [
        {
          "id": "arr",
          "label": "Annual Recurring Revenue",
          "value": "$4.2M",
          "change": 12.4,
          "trend": "up",
          "caption": "Quarterly growth",
          "icon": "rocket"
        },
        {
          "id": "active-users",
          "label": "Active Workspaces",
          "value": "18,420",
          "change": 6.8,
          "trend": "up",
          "caption": "Across 42 regions",
          "icon": "users"
        },
        {
          "id": "api-throughput",
          "label": "API Transactions (24h)",
          "value": "38.4M",
          "change": 9.6,
          "trend": "up",
          "caption": "Latency p95 at 132ms",
          "icon": "cpu"
        },
        {
          "id": "churn",
          "label": "Net Revenue Retention",
          "value": "118%",
          "change": 3.2,
          "trend": "up",
          "caption": "Upsell programs performing",
          "icon": "bar-chart"
        }
      ],
      "charts": [
        {
          "id": "saas-growth-line",
          "type": "line",
          "title": "ARR Growth vs Forecast",
          "description": "We monitor real-time revenue acceleration across the fiscal year.",
          "data": [
            {
              "label": "Jan",
              "actual": 2.8,
              "forecast": 3.0
            },
            {
              "label": "Feb",
              "actual": 3.0,
              "forecast": 3.2
            },
            {
              "label": "Mar",
              "actual": 3.3,
              "forecast": 3.4
            },
            {
              "label": "Apr",
              "actual": 3.5,
              "forecast": 3.6
            },
            {
              "label": "May",
              "actual": 3.7,
              "forecast": 3.8
            },
            {
              "label": "Jun",
              "actual": 3.9,
              "forecast": 4.0
            },
            {
              "label": "Jul",
              "actual": 4.0,
              "forecast": 4.1
            },
            {
              "label": "Aug",
              "actual": 4.1,
              "forecast": 4.2
            },
            {
              "label": "Sep",
              "actual": 4.2,
              "forecast": 4.3
            },
            {
              "label": "Oct",
              "actual": 4.3,
              "forecast": 4.4
            },
            {
              "label": "Nov",
              "actual": 4.4,
              "forecast": 4.5
            },
            {
              "label": "Dec",
              "actual": 4.6,
              "forecast": 4.7
            }
          ],
          "series": [
            {
              "key": "actual",
              "label": "Actual ARR (USD M)",
              "color": "#4f46e5"
            },
            {
              "key": "forecast",
              "label": "Forecast ARR (USD M)",
              "color": "#a855f7"
            }
          ],
          "valuePrefix": "$",
          "valueSuffix": "M"
        },
        {
          "id": "saas-churn-donut",
          "type": "donut",
          "title": "Churn & Expansion Mix",
          "description": "Health of customer segments tracked weekly.",
          "centerLabel": "Churn 2.1%",
          "segments": [
            {
              "label": "Active",
              "value": 82,
              "color": "#4f46e5"
            },
            {
              "label": "Expansion",
              "value": 11,
              "color": "#0ea5e9"
            },
            {
              "label": "At Risk",
              "value": 5,
              "color": "#f97316"
            },
            {
              "label": "Churned",
              "value": 2,
              "color": "#f43f5e"
            }
          ]
        },
        {
          "id": "saas-api-bar",
          "type": "bar",
          "title": "API Usage & Automation Triggers",
          "description": "Monitoring throughput spikes before billing cycles.",
          "data": [
            {
              "label": "Week 1",
              "requests": 18.2,
              "automations": 3.2
            },
            {
              "label": "Week 2",
              "requests": 21.4,
              "automations": 3.8
            },
            {
              "label": "Week 3",
              "requests": 23.6,
              "automations": 4.1
            },
            {
              "label": "Week 4",
              "requests": 25.1,
              "automations": 4.6
            }
          ],
          "series": [
            {
              "key": "requests",
              "label": "API Requests (M)",
              "color": "#38bdf8"
            },
            {
              "key": "automations",
              "label": "Automation Jobs (M)",
              "color": "#4f46e5"
            }
          ],
          "valueSuffix": "M"
        }
      ],
      "tables": [
        {
          "id": "saas-plan-matrix",
          "title": "Subscription Plans & Adoption",
          "description": "Plan performance with pricing experiments and onboarding score.",
          "columns": [
            "Plan",
            "MRR",
            "Customers",
            "ARPU",
            "Onboarding Score"
          ],
          "rows": [
            {
              "id": "starter",
              "cells": [
                "Starter",
                "$142K",
                "6,120",
                "$23",
                "92/100"
              ],
              "status": "steady",
              "note": "Growth via product-led motion"
            },
            {
              "id": "growth",
              "cells": [
                "Growth",
                "$382K",
                "2,410",
                "$158",
                "96/100"
              ],
              "status": "up",
              "note": "Highest expansion revenue"
            },
            {
              "id": "scale",
              "cells": [
                "Scale",
                "$521K",
                "720",
                "$724",
                "98/100"
              ],
              "status": "up",
              "note": "Dedicated success pods assigned"
            },
            {
              "id": "enterprise",
              "cells": [
                "Enterprise+",
                "$781K",
                "160",
                "$4,881",
                "99/100"
              ],
              "status": "up",
              "note": "Custom contract automation"
            }
          ]
        },
        {
          "id": "saas-alerts-table",
          "title": "Lifecycle Alerts Queue",
          "description": "Signals generated by billing and adoption monitors.",
          "columns": [
            "Customer",
            "Signal",
            "Playbook",
            "Owner",
            "SLA"
          ],
          "rows": [
            {
              "id": "northwind",
              "cells": [
                "Northwind Labs",
                "Usage drop 28%",
                "Reactivation drip",
                "CX Pod A",
                "4h"
              ],
              "status": "alert"
            },
            {
              "id": "lighthouse",
              "cells": [
                "Lighthouse Partners",
                "Payment retry",
                "Billing concierge",
                "Finance Ops",
                "1h"
              ],
              "status": "steady"
            },
            {
              "id": "stellar",
              "cells": [
                "Stellar Robotics",
                "Add-on interest",
                "Expansion architect",
                "Solutions",
                "Same day"
              ],
              "status": "up"
            }
          ]
        }
      ],
      "automations": [
        {
          "id": "billing-cycle",
          "title": "Automated Billing Cycle Orchestration",
          "description": "Consolidates usage metrics, applies credits, and posts invoices to finance systems.",
          "trigger": "Billing window opens 3 days before renewal date",
          "actions": [
            "Collect product usage aggregates",
            "Sync pricing rules from RevOps",
            "Publish invoice + send webhook to ERP"
          ],
          "cadence": "Daily across tenant cohorts",
          "owner": "Finance Automation Squad",
          "status": "active",
          "lastRun": "Today, 06:00 UTC",
          "nextRun": "Today, 18:00 UTC"
        },
        {
          "id": "churn-alert",
          "title": "Risk Scoring & Churn Alerts",
          "description": "Predictive scoring model escalates at-risk accounts to customer success playbooks.",
          "trigger": "Usage anomaly or NPS < 6 detected",
          "actions": [
            "Score in ML pipeline",
            "Queue success pod task",
            "Start 5-step reactivation journey"
          ],
          "cadence": "Continuous stream",
          "owner": "Customer Intelligence",
          "status": "active",
          "lastRun": "5 min ago",
          "nextRun": "Live stream"
        },
        {
          "id": "email-upgrade",
          "title": "Expansion Email Trigger",
          "description": "Auto-sends targeted upgrade messaging when teams hit 80% of plan limits.",
          "trigger": "Feature limit threshold crossed",
          "actions": [
            "Segment audience in CDP",
            "Generate personalized pricing deck",
            "Launch nurture campaign"
          ],
          "cadence": "Hourly evaluation",
          "owner": "Lifecycle Marketing",
          "status": "active",
          "lastRun": "45 min ago",
          "nextRun": "In 15 min"
        }
      ],
      "extras": {
        "highlights": [
          {
            "title": "Platform Certifications",
            "items": [
              {
                "label": "SOC 2 Type II",
                "value": "Renewed 2024"
              },
              {
                "label": "ISO 27001",
                "value": "Integrated controls"
              }
            ]
          },
          {
            "title": "Preferred Tech Stack",
            "items": [
              {
                "label": "Frontend",
                "value": "Next.js + Tailwind"
              },
              {
                "label": "Backend",
                "value": "FastAPI + Temporal"
              },
              {
                "label": "Data",
                "value": "Snowflake + dbt"
              }
            ]
          }
        ]
      }
    },
    {
      "id": "commerce-dashboard",
      "name": "E-Commerce Performance Studio",
      "badge": "Commerce",
      "description": "Merchandising intelligence, order orchestration, and omnichannel fulfillment reporting.",
      "summary": "Blending demand forecasting, merchandising performance, and automated ops for global storefronts.",
      "metrics": [
        {
          "id": "gmv",
          "label": "Gross Merchandise Volume",
          "value": "$9.7M",
          "change": 15.6,
          "trend": "up",
          "caption": "Trailing 30 days",
          "icon": "shopping-cart"
        },
        {
          "id": "orders",
          "label": "Orders Fulfilled",
          "value": "128,240",
          "change": 11.2,
          "trend": "up",
          "caption": "97.6% SLA met",
          "icon": "target"
        },
        {
          "id": "aov",
          "label": "Average Order Value",
          "value": "$76",
          "change": 6.3,
          "trend": "up",
          "caption": "Boosted by bundling engine",
          "icon": "credit-card"
        },
        {
          "id": "repeat-rate",
          "label": "Repeat Purchase Rate",
          "value": "38%",
          "change": 4.1,
          "trend": "up",
          "caption": "Loyalty 2.0 rollout",
          "icon": "bookmark"
        }
      ],
      "charts": [
        {
          "id": "commerce-sales-bar",
          "type": "bar",
          "title": "Sales Trends by Week",
          "description": "Revenue pulses used for re-order automation.",
          "data": [
            {
              "label": "Wk 1",
              "revenue": 1.8,
              "marketing": 0.42
            },
            {
              "label": "Wk 2",
              "revenue": 2.2,
              "marketing": 0.5
            },
            {
              "label": "Wk 3",
              "revenue": 2.6,
              "marketing": 0.46
            },
            {
              "label": "Wk 4",
              "revenue": 3.1,
              "marketing": 0.53
            },
            {
              "label": "Wk 5",
              "revenue": 3.5,
              "marketing": 0.61
            }
          ],
          "series": [
            {
              "key": "revenue",
              "label": "Revenue (USD M)",
              "color": "#4f46e5"
            },
            {
              "key": "marketing",
              "label": "Paid Media Spend (USD M)",
              "color": "#a855f7"
            }
          ],
          "valuePrefix": "$",
          "valueSuffix": "M"
        },
        {
          "id": "commerce-channel-donut",
          "type": "donut",
          "title": "Channel Contribution Mix",
          "description": "Balanced acquisition to sustain blended CAC.",
          "centerLabel": "CAC $18",
          "segments": [
            {
              "label": "Direct",
              "value": 32,
              "color": "#6366f1"
            },
            {
              "label": "Paid",
              "value": 24,
              "color": "#22d3ee"
            },
            {
              "label": "Marketplace",
              "value": 18,
              "color": "#f59e0b"
            },
            {
              "label": "Email",
              "value": 14,
              "color": "#f43f5e"
            },
            {
              "label": "Affiliates",
              "value": 12,
              "color": "#14b8a6"
            }
          ]
        },
        {
          "id": "commerce-operations-line",
          "type": "line",
          "title": "Operations Health",
          "description": "Fulfillment and support automation insights.",
          "data": [
            {
              "label": "Jan",
              "fulfillment": 94,
              "csat": 4.4
            },
            {
              "label": "Feb",
              "fulfillment": 95,
              "csat": 4.5
            },
            {
              "label": "Mar",
              "fulfillment": 96,
              "csat": 4.6
            },
            {
              "label": "Apr",
              "fulfillment": 97,
              "csat": 4.7
            },
            {
              "label": "May",
              "fulfillment": 98,
              "csat": 4.7
            },
            {
              "label": "Jun",
              "fulfillment": 98,
              "csat": 4.8
            }
          ],
          "series": [
            {
              "key": "fulfillment",
              "label": "On-Time Fulfillment %",
              "color": "#22d3ee"
            },
            {
              "key": "csat",
              "label": "Customer Satisfaction",
              "color": "#f97316"
            }
          ]
        }
      ],
      "tables": [
        {
          "id": "commerce-top-products",
          "title": "Top Product Leaderboard",
          "description": "Merchandising intelligence with automation flags.",
          "columns": [
            "Product",
            "Revenue",
            "Orders",
            "Inventory",
            "Automation"
          ],
          "rows": [
            {
              "id": "athletic-hoodie",
              "cells": [
                "AeroFlex Hoodie",
                "$640K",
                "12,840",
                "3.2k units",
                "Replenishment queued"
              ],
              "status": "up"
            },
            {
              "id": "studio-shoes",
              "cells": [
                "StudioFlow Sneakers",
                "$512K",
                "9,420",
                "1.1k units",
                "Restock automation"
              ],
              "status": "steady"
            },
            {
              "id": "smart-bottle",
              "cells": [
                "HydraSmart Bottle",
                "$381K",
                "7,310",
                "920 units",
                "Cross-sell triggered"
              ],
              "status": "up"
            },
            {
              "id": "mat-set",
              "cells": [
                "ZenCore Mat Set",
                "$244K",
                "4,870",
                "1.8k units",
                "Bundle optimization"
              ],
              "status": "steady"
            }
          ]
        },
        {
          "id": "commerce-operations",
          "title": "Order Operations Pulse",
          "columns": [
            "Region",
            "Orders",
            "Refund Rate",
            "SLA",
            "Escalations"
          ],
          "rows": [
            {
              "id": "na",
              "cells": [
                "North America",
                "48,210",
                "1.2%",
                "99%",
                "2"
              ],
              "status": "up"
            },
            {
              "id": "emea",
              "cells": [
                "EMEA",
                "36,420",
                "1.6%",
                "98%",
                "5"
              ],
              "status": "steady"
            },
            {
              "id": "apac",
              "cells": [
                "APAC",
                "22,110",
                "0.9%",
                "99%",
                "1"
              ],
              "status": "up"
            }
          ]
        }
      ],
      "automations": [
        {
          "id": "abandoned-cart",
          "title": "Abandoned Cart Recovery",
          "description": "Dynamic incentives based on margin guardrails.",
          "trigger": "Cart idle > 30 minutes with value over $120",
          "actions": [
            "Trigger journey in Braze",
            "Reserve inventory for 2 hours",
            "Alert concierge for VIP carts"
          ],
          "cadence": "Real-time stream",
          "owner": "Lifecycle Ops",
          "status": "active",
          "lastRun": "2 min ago",
          "nextRun": "Continuous"
        },
        {
          "id": "inventory-sync",
          "title": "Stock Auto-Update",
          "description": "Auto-balances stock levels between FCs and marketplaces.",
          "trigger": "Inventory delta > 5%",
          "actions": [
            "Sync ERP quantity",
            "Update channel listings",
            "Notify merchandising lead"
          ],
          "cadence": "Every 15 minutes",
          "owner": "Supply Chain",
          "status": "active",
          "lastRun": "12 min ago",
          "nextRun": "In 3 min"
        },
        {
          "id": "vip-reengage",
          "title": "VIP Re-Engagement",
          "description": "White-glove outreach for high-value cohorts.",
          "trigger": "LTV top 5% + inactive 21 days",
          "actions": [
            "Open concierge ticket",
            "Generate curated bundle",
            "Send SMS + email sequence"
          ],
          "cadence": "Daily at 09:00",
          "owner": "CX Elite Squad",
          "status": "active",
          "lastRun": "Today 09:00",
          "nextRun": "Tomorrow 09:00"
        }
      ]
    },
    {
      "id": "corporate-analytics",
      "name": "Corporate Growth Analytics",
      "badge": "Enterprise",
      "description": "Board-ready analytics, marketing attribution, and CRM automation for B2B brands.",
      "summary": "From lead capture to closed-won, we orchestrate analytics, scoring, and sync with enterprise CRMs.",
      "metrics": [
        {
          "id": "pipeline-value",
          "label": "Pipeline Value",
          "value": "$12.4M",
          "change": 8.3,
          "trend": "up",
          "caption": "Across 68 active deals",
          "icon": "briefcase"
        },
        {
          "id": "conversion-rate",
          "label": "Lead Conversion",
          "value": "5.7%",
          "change": 1.1,
          "trend": "up",
          "caption": "QoQ improvement",
          "icon": "target"
        },
        {
          "id": "page-views",
          "label": "Monthly Page Views",
          "value": "2.1M",
          "change": 19.4,
          "trend": "up",
          "caption": "Multi-touch attribution tuned",
          "icon": "globe"
        },
        {
          "id": "avg-cycle",
          "label": "Sales Cycle Length",
          "value": "52 days",
          "change": -6.4,
          "trend": "up",
          "caption": "Workflow automation trimmed time",
          "icon": "clock"
        }
      ],
      "charts": [
        {
          "id": "corporate-funnel",
          "type": "funnel",
          "title": "Conversion Funnel",
          "description": "Top-to-bottom velocity across account-based journeys.",
          "steps": [
            {
              "label": "Website Visitors",
              "value": 2100000
            },
            {
              "label": "Marketing Qualified",
              "value": 184000
            },
            {
              "label": "Sales Accepted",
              "value": 41000
            },
            {
              "label": "Opportunities",
              "value": 5200
            },
            {
              "label": "Closed Won",
              "value": 620
            }
          ]
        },
        {
          "id": "corporate-lead-sources",
          "type": "donut",
          "title": "Lead Source Distribution",
          "segments": [
            {
              "label": "Organic",
              "value": 34,
              "color": "#4f46e5"
            },
            {
              "label": "Paid Media",
              "value": 22,
              "color": "#14b8a6"
            },
            {
              "label": "Webinars",
              "value": 16,
              "color": "#f59e0b"
            },
            {
              "label": "Partner",
              "value": 18,
              "color": "#38bdf8"
            },
            {
              "label": "Events",
              "value": 10,
              "color": "#f97316"
            }
          ],
          "centerLabel": "MQL Mix"
        },
        {
          "id": "corporate-engagement-line",
          "type": "line",
          "title": "Engagement Velocity",
          "description": "Time-on-site and account research depth.",
          "data": [
            {
              "label": "Jan",
              "dwell": 3.2,
              "research": 1.8
            },
            {
              "label": "Feb",
              "dwell": 3.4,
              "research": 2.1
            },
            {
              "label": "Mar",
              "dwell": 3.7,
              "research": 2.3
            },
            {
              "label": "Apr",
              "dwell": 4.0,
              "research": 2.6
            },
            {
              "label": "May",
              "dwell": 4.2,
              "research": 2.8
            },
            {
              "label": "Jun",
              "dwell": 4.4,
              "research": 3.0
            }
          ],
          "series": [
            {
              "key": "dwell",
              "label": "Avg. Session (min)",
              "color": "#8b5cf6"
            },
            {
              "key": "research",
              "label": "Research Actions",
              "color": "#06b6d4"
            }
          ]
        }
      ],
      "tables": [
        {
          "id": "corporate-pipeline",
          "title": "Enterprise Pipeline Highlights",
          "columns": [
            "Account",
            "Stage",
            "Value",
            "Probability",
            "Owner"
          ],
          "rows": [
            {
              "id": "nebulon",
              "cells": [
                "Nebulon Systems",
                "Evaluation",
                "$1.4M",
                "45%",
                "P. Ortiz"
              ],
              "status": "steady"
            },
            {
              "id": "orion",
              "cells": [
                "Orion Capital",
                "Proposal",
                "$2.1M",
                "60%",
                "J. Kumar"
              ],
              "status": "up"
            },
            {
              "id": "zenith",
              "cells": [
                "Zenith Labs",
                "Negotiation",
                "$980K",
                "30%",
                "A. Chen"
              ],
              "status": "steady"
            },
            {
              "id": "atlas",
              "cells": [
                "Atlas Industries",
                "Contract",
                "$3.7M",
                "75%",
                "L. Morgan"
              ],
              "status": "up"
            }
          ]
        },
        {
          "id": "corporate-campaigns",
          "title": "Campaign Performance",
          "columns": [
            "Campaign",
            "Channel",
            "Leads",
            "Pipeline",
            "ROI"
          ],
          "rows": [
            {
              "id": "cxo-roundtable",
              "cells": [
                "CXO Roundtable",
                "Event",
                "1,240",
                "$2.8M",
                "6.4x"
              ],
              "status": "up"
            },
            {
              "id": "webinar-series",
              "cells": [
                "Zero Trust Webinar",
                "Webinar",
                "860",
                "$1.1M",
                "4.2x"
              ],
              "status": "steady"
            },
            {
              "id": "abm-drip",
              "cells": [
                "Account Lab",
                "Email ABM",
                "540",
                "$780K",
                "5.1x"
              ],
              "status": "up"
            }
          ]
        }
      ],
      "automations": [
        {
          "id": "lead-scoring",
          "title": "Predictive Lead Scoring",
          "description": "Machine learning model pushes scores into CRM in under 90 seconds.",
          "trigger": "New lead enters marketing automation",
          "actions": [
            "Score against ICP",
            "Route to SDR or nurture",
            "Log explanation in CRM"
          ],
          "cadence": "Continuous ingestion",
          "owner": "Revenue Ops",
          "status": "active",
          "lastRun": "1 min ago",
          "nextRun": "Live stream"
        },
        {
          "id": "crm-sync",
          "title": "Two-Way CRM Sync",
          "description": "Keeps HubSpot and Salesforce instances perfectly aligned.",
          "trigger": "Field updates or deal stage change",
          "actions": [
            "Normalize schema",
            "Sync attachments + notes",
            "Alert RevOps on conflicts"
          ],
          "cadence": "Every 5 minutes",
          "owner": "Systems Team",
          "status": "active",
          "lastRun": "3 min ago",
          "nextRun": "In 2 min"
        },
        {
          "id": "exec-digest",
          "title": "Executive KPI Digest",
          "description": "Curated slides and talking points delivered to leadership before standup.",
          "trigger": "06:30 leadership standup",
          "actions": [
            "Compile metrics snapshot",
            "Generate narrative summary",
            "Send Slack + email briefing"
          ],
          "cadence": "Weekdays",
          "owner": "Analytics Guild",
          "status": "active",
          "lastRun": "Today 06:15",
          "nextRun": "Tomorrow 06:15"
        }
      ]
    },
    {
      "id": "custom-app",
      "name": "Custom Web Application Ops",
      "badge": "Product",
      "description": "Task orchestration, Kanban delivery, and workload balancing for bespoke platforms.",
      "summary": "Full product squads with sprint analytics, automation coverage, and intelligent reminders.",
      "metrics": [
        {
          "id": "velocity",
          "label": "Sprint Velocity",
          "value": "68 pts",
          "change": 9.2,
          "trend": "up",
          "caption": "3 sprint average",
          "icon": "chart-line"
        },
        {
          "id": "tasks",
          "label": "Tasks Shipped",
          "value": "312",
          "change": 14.5,
          "trend": "up",
          "caption": "This iteration",
          "icon": "list"
        },
        {
          "id": "automation-coverage",
          "label": "Automation Coverage",
          "value": "72%",
          "change": 5.4,
          "trend": "up",
          "caption": "Recurring tasks automated",
          "icon": "sparkles"
        },
        {
          "id": "cycle-time",
          "label": "Median Cycle Time",
          "value": "2.6d",
          "change": -0.8,
          "trend": "up",
          "caption": "Lead time reduction",
          "icon": "clock"
        }
      ],
      "charts": [
        {
          "id": "custom-cycle-line",
          "type": "line",
          "title": "Cycle Time Trend",
          "data": [
            {
              "label": "Sprint 1",
              "cycle": 3.8,
              "review": 1.4
            },
            {
              "label": "Sprint 2",
              "cycle": 3.5,
              "review": 1.3
            },
            {
              "label": "Sprint 3",
              "cycle": 3.1,
              "review": 1.1
            },
            {
              "label": "Sprint 4",
              "cycle": 2.9,
              "review": 1.0
            },
            {
              "label": "Sprint 5",
              "cycle": 2.7,
              "review": 0.9
            },
            {
              "label": "Sprint 6",
              "cycle": 2.6,
              "review": 0.8
            }
          ],
          "series": [
            {
              "key": "cycle",
              "label": "Cycle Time (days)",
              "color": "#4f46e5"
            },
            {
              "key": "review",
              "label": "Review Time (days)",
              "color": "#0ea5e9"
            }
          ]
        },
        {
          "id": "custom-workload-bar",
          "type": "bar",
          "title": "Workload Distribution",
          "description": "Ensuring each squad member stays inside 85% capacity.",
          "data": [
            {
              "label": "Ava",
              "allocation": 78,
              "capacity": 88
            },
            {
              "label": "Jordan",
              "allocation": 84,
              "capacity": 90
            },
            {
              "label": "Priya",
              "allocation": 81,
              "capacity": 88
            },
            {
              "label": "Miguel",
              "allocation": 72,
              "capacity": 85
            },
            {
              "label": "Sam",
              "allocation": 69,
              "capacity": 80
            }
          ],
          "series": [
            {
              "key": "allocation",
              "label": "Allocation %",
              "color": "#6366f1"
            },
            {
              "key": "capacity",
              "label": "Capacity %",
              "color": "#a855f7"
            }
          ],
          "valueSuffix": "%"
        }
      ],
      "tables": [
        {
          "id": "custom-recurring",
          "title": "Recurring Automation Jobs",
          "columns": [
            "Workflow",
            "Schedule",
            "Owner",
            "Success Rate",
            "Notes"
          ],
          "rows": [
            {
              "id": "daily-digest",
              "cells": [
                "Daily Standup Digest",
                "08:00 daily",
                "Ava",
                "100%",
                "Summarizes active blockers"
              ],
              "status": "up"
            },
            {
              "id": "retro-prompt",
              "cells": [
                "Retro Prompt",
                "Fri 16:30",
                "Miguel",
                "100%",
                "Auto collects talking points"
              ],
              "status": "steady"
            },
            {
              "id": "sprint-rollover",
              "cells": [
                "Sprint Rollover",
                "Bi-weekly",
                "Priya",
                "98%",
                "Re-queues deferred work"
              ],
              "status": "steady"
            }
          ]
        }
      ],
      "automations": [
        {
          "id": "task-recurring",
          "title": "Recurring Task Engine",
          "description": "Turns routines into tracked automations with SLA monitors.",
          "trigger": "Sprint start + calendar cadence",
          "actions": [
            "Clone blueprint tasks",
            "Assign owners based on workload",
            "Notify via Slack + email"
          ],
          "cadence": "Every sprint (2 weeks)",
          "owner": "Product Ops",
          "status": "active",
          "lastRun": "Mon 09:00",
          "nextRun": "In 12 days"
        },
        {
          "id": "reminder-bot",
          "title": "Auto Reminder Concierge",
          "description": "Contextual nudges for tasks nearing SLA or dependencies.",
          "trigger": "Task due in < 48h without status change",
          "actions": [
            "DM assignee with summary",
            "Escalate to lead if critical",
            "Log reminder to audit trail"
          ],
          "cadence": "Hourly sweep",
          "owner": "Automation Guild",
          "status": "active",
          "lastRun": "10 min ago",
          "nextRun": "In 50 min"
        },
        {
          "id": "quality-gate",
          "title": "Quality Gate Automation",
          "description": "Ensures tests, accessibility, and security scans run before merge.",
          "trigger": "Pull request ready for review",
          "actions": [
            "Run CI pipelines",
            "Post coverage summary",
            "Block merge until gates green"
          ],
          "cadence": "On demand",
          "owner": "Engineering Enablement",
          "status": "active",
          "lastRun": "5 min ago",
          "nextRun": "Awaiting events"
        }
      ],
      "extras": {
        "kanban": {
          "summary": "Adaptive Kanban board for the current sprint.",
          "columns": [
            {
              "id": "backlog",
              "title": "Backlog",
              "items": [
                {
                  "id": "B1",
                  "title": "AI-assisted brief parser",
                  "assignee": "Ava",
                  "badge": "Discovery",
                  "dueDate": "Dec 22",
                  "effort": 5
                },
                {
                  "id": "B2",
                  "title": "Segment billing webhooks",
                  "assignee": "Sam",
                  "badge": "API",
                  "dueDate": "Dec 21",
                  "effort": 3
                }
              ]
            },
            {
              "id": "in-progress",
              "title": "In Progress",
              "items": [
                {
                  "id": "IP1",
                  "title": "Client style guide builder",
                  "assignee": "Jordan",
                  "badge": "UI",
                  "dueDate": "Dec 19",
                  "effort": 8
                },
                {
                  "id": "IP2",
                  "title": "Temporal workflow templates",
                  "assignee": "Priya",
                  "badge": "Automation",
                  "dueDate": "Dec 20",
                  "effort": 5
                }
              ]
            },
            {
              "id": "review",
              "title": "Review",
              "items": [
                {
                  "id": "R1",
                  "title": "Analytics export API",
                  "assignee": "Miguel",
                  "badge": "Backend",
                  "dueDate": "Dec 18",
                  "effort": 3
                }
              ]
            },
            {
              "id": "done",
              "title": "Done",
              "items": [
                {
                  "id": "D1",
                  "title": "SLA alert templates",
                  "assignee": "Sam",
                  "badge": "Ops",
                  "dueDate": "Dec 15",
                  "effort": 2
                },
                {
                  "id": "D2",
                  "title": "Portfolio microsite",
                  "assignee": "Ava",
                  "badge": "Frontend",
                  "dueDate": "Dec 14",
                  "effort": 4
                }
              ]
            }
          ],
          "workload": {
            "team": [
              {
                "name": "Ava Lee",
                "role": "Product Lead",
                "allocation": 82,
                "capacity": 90
              },
              {
                "name": "Jordan Banks",
                "role": "Design Lead",
                "allocation": 76,
                "capacity": 88
              },
              {
                "name": "Priya Patel",
                "role": "Automation Eng",
                "allocation": 84,
                "capacity": 92
              },
              {
                "name": "Miguel Torres",
                "role": "Platform Eng",
                "allocation": 68,
                "capacity": 85
              },
              {
                "name": "Sam Carter",
                "role": "Ops Strategist",
                "allocation": 73,
                "capacity": 86
              }
            ]
          }
        }
      }
    },
    {
      "id": "content-media",
      "name": "Content & Media Intelligence",
      "badge": "Media",
      "description": "Editorial analytics, multi-channel distribution, and engagement scoring.",
      "summary": "Elevated publishing operations with scheduled releases, engagement monitors, and syndication.",
      "metrics": [
        {
          "id": "monthly-views",
          "label": "Monthly Views",
          "value": "4.6M",
          "change": 17.6,
          "trend": "up",
          "caption": "Across article + video surfaces",
          "icon": "video"
        },
        {
          "id": "avg-session",
          "label": "Average Session Time",
          "value": "5m 42s",
          "change": 0.8,
          "trend": "up",
          "caption": "Content personalization",
          "icon": "clock"
        },
        {
          "id": "subscriber-growth",
          "label": "Subscriber Growth",
          "value": "+12,480",
          "change": 9.1,
          "trend": "up",
          "caption": "30-day net",
          "icon": "mail"
        },
        {
          "id": "engagement-score",
          "label": "Engagement Score",
          "value": "86/100",
          "change": 3.6,
          "trend": "up",
          "caption": "AI-driven recommendations",
          "icon": "sparkles"
        }
      ],
      "charts": [
        {
          "id": "content-engagement-line",
          "type": "line",
          "title": "Engagement Trend",
          "data": [
            {
              "label": "Week 1",
              "reads": 1.2,
              "watch": 0.8
            },
            {
              "label": "Week 2",
              "reads": 1.35,
              "watch": 0.92
            },
            {
              "label": "Week 3",
              "reads": 1.42,
              "watch": 1.05
            },
            {
              "label": "Week 4",
              "reads": 1.51,
              "watch": 1.18
            },
            {
              "label": "Week 5",
              "reads": 1.63,
              "watch": 1.22
            }
          ],
          "series": [
            {
              "key": "reads",
              "label": "Article Reads (M)",
              "color": "#4f46e5"
            },
            {
              "key": "watch",
              "label": "Video Plays (M)",
              "color": "#f59e0b"
            }
          ]
        },
        {
          "id": "content-format-bar",
          "type": "bar",
          "title": "Format Performance",
          "description": "Signals to steer the editorial roadmap.",
          "data": [
            {
              "label": "Deep Dives",
              "completion": 72,
              "shares": 38
            },
            {
              "label": "Quick Takes",
              "completion": 48,
              "shares": 22
            },
            {
              "label": "Video Essays",
              "completion": 81,
              "shares": 46
            },
            {
              "label": "Podcasts",
              "completion": 66,
              "shares": 34
            }
          ],
          "series": [
            {
              "key": "completion",
              "label": "Completion %",
              "color": "#0ea5e9"
            },
            {
              "key": "shares",
              "label": "Share Rate %",
              "color": "#6366f1"
            }
          ],
          "valueSuffix": "%"
        },
        {
          "id": "content-source-donut",
          "type": "donut",
          "title": "Traffic Sources",
          "segments": [
            {
              "label": "Search",
              "value": 46,
              "color": "#6366f1"
            },
            {
              "label": "Direct",
              "value": 21,
              "color": "#22d3ee"
            },
            {
              "label": "Social",
              "value": 18,
              "color": "#f43f5e"
            },
            {
              "label": "Referral",
              "value": 9,
              "color": "#a855f7"
            },
            {
              "label": "Email",
              "value": 6,
              "color": "#f97316"
            }
          ],
          "centerLabel": "Top Funnel"
        }
      ],
      "tables": [
        {
          "id": "content-leaderboard",
          "title": "Top Stories & Series",
          "columns": [
            "Title",
            "Format",
            "Publish Date",
            "Engagement",
            "Status"
          ],
          "rows": [
            {
              "id": "ai-blueprint",
              "cells": [
                "AI Blueprint 2025",
                "Deep Dive",
                "Dec 09",
                "98/100",
                "Syndicated"
              ],
              "status": "up"
            },
            {
              "id": "ops-playbook",
              "cells": [
                "Ops Velocity Playbook",
                "Video Essay",
                "Dec 12",
                "94/100",
                "Premier"
              ],
              "status": "steady"
            },
            {
              "id": "security-trends",
              "cells": [
                "Security Signals Live",
                "Podcast",
                "Dec 10",
                "91/100",
                "Live"
              ],
              "status": "up"
            },
            {
              "id": "design-sprint",
              "cells": [
                "Design Sprint Journal",
                "Quick Take",
                "Dec 08",
                "88/100",
                "Queued"
              ],
              "status": "steady"
            }
          ]
        }
      ],
      "automations": [
        {
          "id": "scheduled-publishing",
          "title": "Scheduled Publishing Orchestrator",
          "description": "Aligns editorial calendar with timezone-aware releases.",
          "trigger": "Content enters \"Ready\" column",
          "actions": [
            "Slot into optimal release window",
            "Sync to CDN + channels",
            "Notify editor upon publish"
          ],
          "cadence": "Hourly windowing",
          "owner": "Editorial Ops",
          "status": "active",
          "lastRun": "1h ago",
          "nextRun": "In 20 min"
        },
        {
          "id": "auto-tagging",
          "title": "Auto Tagging & SEO Enhancer",
          "description": "Metadata enrichment ensures discoverability and personalization.",
          "trigger": "Draft moves to review",
          "actions": [
            "Run NLP entity tagging",
            "Map to taxonomy",
            "Push tags into CMS"
          ],
          "cadence": "On review",
          "owner": "Content Intelligence",
          "status": "active",
          "lastRun": "20 min ago",
          "nextRun": "Awaiting"
        },
        {
          "id": "syndication",
          "title": "Syndication Distribution",
          "description": "Routes top performers to partner publications automatically.",
          "trigger": "Engagement score > 90",
          "actions": [
            "Prepare partner-friendly format",
            "Share to partner feeds",
            "Track referral performance"
          ],
          "cadence": "Daily at 11:00",
          "owner": "Audience Team",
          "status": "active",
          "lastRun": "Today 11:00",
          "nextRun": "Tomorrow 11:00"
        }
      ]
    },
    {
      "id": "edtech",
      "name": "EdTech Learning Hub",
      "badge": "EdTech",
      "description": "Course management, learner analytics, and credential automation.",
      "summary": "Adaptive learning environment with heatmaps, competency scoring, and certificate automation.",
      "metrics": [
        {
          "id": "active-learners",
          "label": "Active Learners",
          "value": "28,640",
          "change": 14.2,
          "trend": "up",
          "caption": "Weekly cohort",
          "icon": "users"
        },
        {
          "id": "completion-rate",
          "label": "Average Completion",
          "value": "78%",
          "change": 5.4,
          "trend": "up",
          "caption": "Adaptive pacing",
          "icon": "graduation"
        },
        {
          "id": "certificates",
          "label": "Certificates Issued",
          "value": "6,420",
          "change": 22.1,
          "trend": "up",
          "caption": "Automated issuance",
          "icon": "bookmark"
        },
        {
          "id": "nps",
          "label": "Learner NPS",
          "value": "+54",
          "change": 4.6,
          "trend": "up",
          "caption": "Support automation",
          "icon": "sparkles"
        }
      ],
      "charts": [
        {
          "id": "edtech-heatmap",
          "type": "heatmap",
          "title": "Student Activity Heatmap",
          "description": "Engagement intensity across weekly cohorts.",
          "rows": [
            {
              "label": "Week 1",
              "values": [
                {
                  "label": "Mon",
                  "value": 62
                },
                {
                  "label": "Tue",
                  "value": 78
                },
                {
                  "label": "Wed",
                  "value": 84
                },
                {
                  "label": "Thu",
                  "value": 73
                },
                {
                  "label": "Fri",
                  "value": 68
                },
                {
                  "label": "Sat",
                  "value": 42
                },
                {
                  "label": "Sun",
                  "value": 28
                }
              ]
            },
            {
              "label": "Week 2",
              "values": [
                {
                  "label": "Mon",
                  "value": 66
                },
                {
                  "label": "Tue",
                  "value": 81
                },
                {
                  "label": "Wed",
                  "value": 88
                },
                {
                  "label": "Thu",
                  "value": 76
                },
                {
                  "label": "Fri",
                  "value": 71
                },
                {
                  "label": "Sat",
                  "value": 44
                },
                {
                  "label": "Sun",
                  "value": 31
                }
              ]
            },
            {
              "label": "Week 3",
              "values": [
                {
                  "label": "Mon",
                  "value": 69
                },
                {
                  "label": "Tue",
                  "value": 83
                },
                {
                  "label": "Wed",
                  "value": 91
                },
                {
                  "label": "Thu",
                  "value": 82
                },
                {
                  "label": "Fri",
                  "value": 75
                },
                {
                  "label": "Sat",
                  "value": 48
                },
                {
                  "label": "Sun",
                  "value": 35
                }
              ]
            },
            {
              "label": "Week 4",
              "values": [
                {
                  "label": "Mon",
                  "value": 72
                },
                {
                  "label": "Tue",
                  "value": 86
                },
                {
                  "label": "Wed",
                  "value": 94
                },
                {
                  "label": "Thu",
                  "value": 85
                },
                {
                  "label": "Fri",
                  "value": 78
                },
                {
                  "label": "Sat",
                  "value": 52
                },
                {
                  "label": "Sun",
                  "value": 38
                }
              ]
            }
          ],
          "valueRange": [
            0,
            100
          ],
          "legend": [
            "Low",
            "Medium",
            "High"
          ]
        },
        {
          "id": "edtech-quiz-bar",
          "type": "bar",
          "title": "Quiz Performance by Module",
          "data": [
            {
              "label": "Foundations",
              "score": 82,
              "mastery": 68
            },
            {
              "label": "Projects",
              "score": 88,
              "mastery": 74
            },
            {
              "label": "Labs",
              "score": 91,
              "mastery": 81
            },
            {
              "label": "Capstone",
              "score": 87,
              "mastery": 79
            }
          ],
          "series": [
            {
              "key": "score",
              "label": "Average Score %",
              "color": "#0ea5e9"
            },
            {
              "key": "mastery",
              "label": "Mastery Rate %",
              "color": "#6366f1"
            }
          ],
          "valueSuffix": "%"
        },
        {
          "id": "edtech-retention-line",
          "type": "line",
          "title": "Cohort Retention",
          "data": [
            {
              "label": "Week 1",
              "retention": 100,
              "automation": 8
            },
            {
              "label": "Week 2",
              "retention": 92,
              "automation": 12
            },
            {
              "label": "Week 3",
              "retention": 88,
              "automation": 16
            },
            {
              "label": "Week 4",
              "retention": 84,
              "automation": 21
            },
            {
              "label": "Week 5",
              "retention": 82,
              "automation": 26
            }
          ],
          "series": [
            {
              "key": "retention",
              "label": "Retention %",
              "color": "#22d3ee"
            },
            {
              "key": "automation",
              "label": "Automation Touchpoints",
              "color": "#f59e0b"
            }
          ]
        }
      ],
      "tables": [
        {
          "id": "edtech-leaderboard",
          "title": "Learner Progress Leaderboard",
          "columns": [
            "Learner",
            "Track",
            "Progress",
            "Quiz Avg",
            "Certificates"
          ],
          "rows": [
            {
              "id": "naomi",
              "cells": [
                "Naomi F.",
                "Product Strategy",
                "94%",
                "89%",
                "4"
              ],
              "status": "up"
            },
            {
              "id": "darius",
              "cells": [
                "Darius H.",
                "Data Science",
                "91%",
                "92%",
                "3"
              ],
              "status": "up"
            },
            {
              "id": "lena",
              "cells": [
                "Lena W.",
                "Automation",
                "88%",
                "87%",
                "3"
              ],
              "status": "steady"
            },
            {
              "id": "amir",
              "cells": [
                "Amir S.",
                "Design Systems",
                "86%",
                "85%",
                "2"
              ],
              "status": "steady"
            }
          ]
        }
      ],
      "automations": [
        {
          "id": "inactivity-alerts",
          "title": "Inactivity Alerts",
          "description": "Outreach sequences triggered when learners pause progress.",
          "trigger": "No course activity for 72 hours",
          "actions": [
            "Send motivational email",
            "Ping instructor dashboard",
            "Offer study resources"
          ],
          "cadence": "Hourly check",
          "owner": "Learner Success",
          "status": "active",
          "lastRun": "30 min ago",
          "nextRun": "In 30 min"
        },
        {
          "id": "certificate-automation",
          "title": "Auto Certificate Issuance",
          "description": "Issue badges + PDF certificates instantly.",
          "trigger": "Course completion >= 85%",
          "actions": [
            "Generate certificate",
            "Notify LMS + CRM",
            "Post to learner profile"
          ],
          "cadence": "Real-time",
          "owner": "Platform Ops",
          "status": "active",
          "lastRun": "5 min ago",
          "nextRun": "Continuous"
        },
        {
          "id": "instructor-digest",
          "title": "Instructor Coaching Digest",
          "description": "Summaries highlight learners needing attention.",
          "trigger": "Daily at 07:00",
          "actions": [
            "Aggregate performance anomalies",
            "Suggest outreach template",
            "Schedule office hours"
          ],
          "cadence": "Daily",
          "owner": "Academic Ops",
          "status": "active",
          "lastRun": "Today 07:00",
          "nextRun": "Tomorrow 07:00"
        }
      ]
    },
    {
      "id": "specialized-niches",
      "name": "Specialized Vertical Pods",
      "badge": "Niche",
      "description": "Real estate pipelines, fintech optimization, and healthcare operations in one suite.",
      "summary": "Vertical accelerators tuned for industry compliance, automation, and frontline productivity.",
      "metrics": [
        {
          "id": "real-estate",
          "label": "Active Real Estate Listings",
          "value": "1,240",
          "change": 8.6,
          "trend": "up",
          "caption": "Auto-synced to MLS",
          "icon": "building"
        },
        {
          "id": "fintech",
          "label": "Avg ROI on Portfolios",
          "value": "18.4%",
          "change": 2.3,
          "trend": "up",
          "caption": "Expense intelligence engine",
          "icon": "database"
        },
        {
          "id": "healthcare",
          "label": "Patient Appointments",
          "value": "4,280",
          "change": 11.9,
          "trend": "up",
          "caption": "No-show rate 3.2%",
          "icon": "stethoscope"
        },
        {
          "id": "automation",
          "label": "Cross-Vertical Automations",
          "value": "64",
          "change": 7.4,
          "trend": "up",
          "caption": "Unified automation fabric",
          "icon": "sparkles"
        }
      ],
      "charts": [
        {
          "id": "niche-realestate-line",
          "type": "line",
          "title": "Real Estate Inquiry Velocity",
          "data": [
            {
              "label": "Week 1",
              "inbound": 420,
              "qualified": 180
            },
            {
              "label": "Week 2",
              "inbound": 460,
              "qualified": 195
            },
            {
              "label": "Week 3",
              "inbound": 512,
              "qualified": 224
            },
            {
              "label": "Week 4",
              "inbound": 548,
              "qualified": 240
            }
          ],
          "series": [
            {
              "key": "inbound",
              "label": "Inbound Inquiries",
              "color": "#4f46e5"
            },
            {
              "key": "qualified",
              "label": "Qualified Leads",
              "color": "#22d3ee"
            }
          ]
        },
        {
          "id": "niche-finance-bar",
          "type": "bar",
          "title": "Finance Portfolio Performance",
          "data": [
            {
              "label": "Fund A",
              "roi": 21,
              "benchmark": 15
            },
            {
              "label": "Fund B",
              "roi": 18,
              "benchmark": 14
            },
            {
              "label": "Fund C",
              "roi": 16,
              "benchmark": 12
            },
            {
              "label": "Fund D",
              "roi": 24,
              "benchmark": 17
            }
          ],
          "series": [
            {
              "key": "roi",
              "label": "ROI %",
              "color": "#14b8a6"
            },
            {
              "key": "benchmark",
              "label": "Benchmark %",
              "color": "#0ea5e9"
            }
          ],
          "valueSuffix": "%"
        },
        {
          "id": "niche-health-donut",
          "type": "donut",
          "title": "Healthcare Communication Mix",
          "description": "Automation coverage for patient reminders.",
          "segments": [
            {
              "label": "SMS",
              "value": 42,
              "color": "#6366f1"
            },
            {
              "label": "Email",
              "value": 36,
              "color": "#a855f7"
            },
            {
              "label": "Phone",
              "value": 14,
              "color": "#f97316"
            },
            {
              "label": "Portal",
              "value": 8,
              "color": "#22d3ee"
            }
          ],
          "centerLabel": "Reach 96%"
        }
      ],
      "tables": [
        {
          "id": "niche-realestate-table",
          "title": "Real Estate Listings",
          "columns": [
            "Property",
            "Status",
            "Inquiries",
            "Agent",
            "Automation"
          ],
          "rows": [
            {
              "id": "skyline",
              "cells": [
                "Skyline Tower",
                "Active",
                "146",
                "J. Myers",
                "Agent notified via SMS"
              ],
              "status": "up"
            },
            {
              "id": "harbor",
              "cells": [
                "Harbor Residences",
                "Under Offer",
                "82",
                "D. Alvarez",
                "Workflow: contract prep"
              ],
              "status": "steady"
            },
            {
              "id": "greenway",
              "cells": [
                "Greenway Estates",
                "Staged",
                "64",
                "S. Patel",
                "Nurture drip active"
              ],
              "status": "steady"
            }
          ]
        },
        {
          "id": "niche-finance-table",
          "title": "Finance Expense Insights",
          "columns": [
            "Account",
            "Monthly Spend",
            "Auto Categorized",
            "Variance",
            "Owner"
          ],
          "rows": [
            {
              "id": "growth-lab",
              "cells": [
                "Growth Lab",
                "$420K",
                "98%",
                "+4%",
                "Finance Ops"
              ],
              "status": "steady"
            },
            {
              "id": "revenue-core",
              "cells": [
                "Revenue Core",
                "$318K",
                "96%",
                "-2%",
                "FP&A"
              ],
              "status": "steady"
            },
            {
              "id": "venture",
              "cells": [
                "Venture Studio",
                "$152K",
                "92%",
                "+6%",
                "Investment Ops"
              ],
              "status": "alert"
            }
          ]
        },
        {
          "id": "niche-healthcare-table",
          "title": "Healthcare Appointment Pulse",
          "columns": [
            "Clinic",
            "Appointments",
            "No-Show",
            "Automation Coverage",
            "Escalations"
          ],
          "rows": [
            {
              "id": "central-care",
              "cells": [
                "Central Care",
                "1,260",
                "2.8%",
                "96%",
                "0"
              ],
              "status": "up"
            },
            {
              "id": "wellness",
              "cells": [
                "Wellness Hub",
                "980",
                "3.2%",
                "92%",
                "1"
              ],
              "status": "steady"
            },
            {
              "id": "metro-health",
              "cells": [
                "Metro Health",
                "2,040",
                "3.6%",
                "94%",
                "0"
              ],
              "status": "steady"
            }
          ]
        }
      ],
      "automations": [
        {
          "id": "realestate-notify",
          "title": "Agent Notification Workflow",
          "description": "Hands agents curated lead context instantly.",
          "trigger": "New inquiry on premium listing",
          "actions": [
            "Enrich lead with CRM data",
            "Notify primary + backup agent",
            "Schedule follow-up tasks"
          ],
          "cadence": "Real-time",
          "owner": "Real Estate Pod",
          "status": "active",
          "lastRun": "8 min ago",
          "nextRun": "Continuous"
        },
        {
          "id": "finance-autocategorize",
          "title": "Expense Auto-Categorization",
          "description": "Normalizes spend with ML labeling and anomaly detection.",
          "trigger": "Transaction imported from ledger",
          "actions": [
            "Apply ML category",
            "Check variance thresholds",
            "Alert finance if out of band"
          ],
          "cadence": "Every 10 minutes",
          "owner": "Fintech Pod",
          "status": "active",
          "lastRun": "4 min ago",
          "nextRun": "In 6 min"
        },
        {
          "id": "healthcare-reminders",
          "title": "Patient Reminder Automation",
          "description": "Reduces no-shows with multi-channel reminders.",
          "trigger": "Appointment scheduled or rescheduled",
          "actions": [
            "Send SMS + email reminders",
            "Offer self-reschedule link",
            "Escalate chronic no-shows to care team"
          ],
          "cadence": "Continuous stream",
          "owner": "Healthcare Pod",
          "status": "active",
          "lastRun": "6 min ago",
          "nextRun": "Live stream"
        }
      ],
      "extras": {
        "highlights": [
          {
            "title": "Compliance Readiness",
            "items": [
              {
                "label": "Real Estate",
                "value": "RESO + MLS certified"
              },
              {
                "label": "Finance",
                "value": "SOC 1 controls mapped"
              },
              {
                "label": "Healthcare",
                "value": "HIPAA BAA signed"
              }
            ]
          },
          {
            "title": "Automation Fabric",
            "items": [
              {
                "label": "Event Bus",
                "value": "Temporal + Kafka"
              },
              {
                "label": "Notification",
                "value": "Twilio + SendGrid + WhatsApp"
              }
            ]
          }
        ]
      }
    }
  ]
} satisfies PortfolioDashboardResponse;

export const getPortfolioDashboard = cache(async () => portfolioDashboard);
