# PRD: Unified Multi-Domain Portfolio Dashboard

## 1. Overview
- **Business Goal:** Present a premium multi-domain analytics showcase that demonstrates the team's ability to build rich, data-driven SaaS experiences spanning SaaS, e-commerce, analytics, custom applications, content platforms, EdTech, and specialized verticals. The dashboard must feel like a cohesive portfolio product that prospects can explore to understand capabilities across industries.
- **Detected Architecture:**
  - **Primary Component:** Frontend Next.js dashboard delivered from `frontend/src/app/dashboard`.
  - **Data Handling:** Static/mock datasets sourced client-side. API plumbing remains optional stubs for future backend integration.

## 2. Functional Specifications
### 2.1 Target Users
- Prospective enterprise clients evaluating the studio's multi-domain expertise.
- Internal sales/marketing teams using the dashboard as a demo asset.

### 2.2 User Stories
1. **As a prospect**, I want to switch between industry tabs so that I can quickly understand your breadth of solutions without leaving the page.
2. **As a viewer**, I want rich metric cards, visualizations, and automation notes in every category so that I perceive the offering as production-ready.
3. **As a sales engineer**, I want mock data, background jobs, and workflows illustrated so that I can tell a compelling story to prospects.

### 2.3 Experience Requirements
- Tabbed navigation that anchors each industry module while preserving a cohesive UI kit.
- Every module contains: overview hero, KPI cards, automation highlights, charts/tables specific to that industry, and cross-domain design consistency.
- Responsive layout with smart stacking and horizontal scrolling for smaller viewports.
- Interactive affordances: hover animations, collapsible sections, transitions on tab changes.
- Data visualizations to cover: line, bar, donut/pie, funnel, heatmap, leaderboard, workload distribution.
- Automation surfaced via cards/timeline/workflow diagrams per category.

### 2.4 Content Inventory (per tab)
1. **SaaS Platform**
   - KPIs: MRR, Active Users, API Calls, Churn Rate.
   - Visualizations: Subscription growth line chart, churn donut.
   - Automation: Billing cycles, churn alerts, email triggers.
2. **E-Commerce**
   - KPIs: Revenue, AOV, Conversion, Orders.
   - Visualizations: Sales trend bar chart, top products leaderboard.
   - Automation: Abandoned cart reminders, stock automation.
3. **Corporate Analytics**
   - KPIs: Leads, Page Views, Conversion Rate, Qualified Deals.
   - Visualizations: Conversion funnel, lead source pie chart.
   - Automation: Lead scoring, CRM sync.
4. **Custom App (Kanban)**
   - KPIs: Tasks, Completion Rate, SLA.
   - Visualizations: Workload distribution (stacked bar/radial), kanban summary.
   - Automation: Recurring tasks, reminders.
5. **Content/Media**
   - KPIs: Published items, Watch Time, Engagement Rate.
   - Visualizations: Engagement line chart, table of scheduled posts.
   - Automation: Scheduled publishing, auto-tagging.
6. **EdTech**
   - KPIs: Active learners, Completion Rate, Certificates.
   - Visualizations: Student activity heatmap (calendar style) plus quiz distribution.
   - Automation: Certificate issuance, inactivity alerts.
7. **Specialized Vertical Hub**
   - Sub-tabs or segmented cards for Real Estate, Finance, Healthcare.
   - Visualizations: Listings map heat strip or grid, ROI tracker chart, appointment pipeline.
   - Automation: Agent notifications, expense auto-categorization, patient reminders.

## 3. Technical Specifications
- **Inter-Service Communication:**
  - Continue using static data builders in `frontend/src/app/dashboard/data.ts` (or a new equivalent) to simulate API responses. Future integration to FastAPI backend will mirror the schema defined here.
- **State Management:**
  - Client components manage active tab state, filters, and simulated workflows via `useState` and `useMemo` hooks.
  - Reusable chart components built with Recharts to ensure consistent interactions.
- **Responsiveness & Theming:**
  - Tailwind utility classes drive layout with `grid`, `flex`, and `aspect-video` patterns.
  - Introduce shared design tokens (spacing, rounded corners, gradient surfaces) via Tailwind classes.
- **Accessibility:**
  - Tabs must be keyboard navigable (aria attributes, roving tabindex).
  - Provide text alternatives for charts and automation diagrams.

## 4. Data & Mocking
- Build rich mock datasets inside the frontend with typed helpers.
- Provide timeline arrays for automation, sample tables for leaderboards/catalogs, and 2D arrays for heatmaps.

## 5. Security & Authentication
- Demo operates without auth; ensure no sensitive data or real endpoints are referenced.

## 6. Out of Scope
- Backend persistence or live API integration.
- User customization or real-time collaboration features.
- Printing/export functionality.

## 7. Success Metrics
- Visual parity with premium SaaS dashboards.
- Every category contains automation, metrics, and charts as enumerated.
- Lighthouse-friendly: maintain minimal layout shift and accessible tabbing.
