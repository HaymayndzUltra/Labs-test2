# Portfolio-Grade Product Operations

A Vite + React + Tailwind dashboard delivering seven verticalized modules (SaaS, E-commerce, Corporate Analytics, Custom Web App, Content & Media, EdTech, and Specialized Niches) with a unified premium design system. It includes global filters synced to the URL, keyboard accessible charts with exportable tables, optimistic automation flows, and Storybook coverage for components.

## Getting Started

```bash
cd portfolio-ops-app
npm install
npm run dev
```

The app runs on [http://localhost:5173](http://localhost:5173). Use the module tabs to switch verticals. Toggle light/dark mode from the header.

## Scripts

- `npm run dev` – start the development server.
- `npm run build` – type-check and build for production.
- `npm run preview` – preview the production build.
- `npm run storybook` – run Storybook for design system review.

## Testing & Accessibility

- All charts expose downloadable CSV data and keyboard traversal (`Arrow` keys, `Home/End`).
- KPI, chart, and table skeletons render while data loads.
- Automation actions provide optimistic toasts with undo.
- Global filters persist in the query string and cascade to all modules through Zustand + React Query.
- Kanban board supports keyboard drag/drop (Space=lift, Arrows=move lane, Enter=drop) with live announcements.
- Compliance overlays surface PCI/SOC-2, HIPAA/BAA, and FERPA constraints per module.

## Storybook

```bash
npm run storybook
```

Preview RTL and dark mode via Storybook toolbar to validate the design tokens across viewing modes.
