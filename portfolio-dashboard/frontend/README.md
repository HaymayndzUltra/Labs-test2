# Portfolio-grade Product Operations (Frontend)

Modern React + Vite implementation of the portfolio-grade product operations dashboard. The frontend ships a reusable design system, portfolio modules, and Storybook playground.

## Stack
- **Vite + React 19**
- **TypeScript**
- **Zustand** for global UI state & feature flags
- **@tanstack/react-query** for data fetching/cache
- **Recharts** for accessible, keyboard navigable charts
- **react-hook-form + zod** for automation builder forms
- **Vitest + Testing Library** for unit tests
- **Storybook** with light/dark + LTR/RTL controls

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the dashboard.

### Scripts
- `npm run dev` – start Vite dev server
- `npm run build` – type-check and build production assets
- `npm run preview` – preview production build
- `npm run test` – run vitest suite (formatting, design tokens, store reducers)
- `npm run lint` – eslint TypeScript sources
- `npm run storybook` – launch Storybook with theme toggles

## Project Structure
```
src/
├── App.tsx                    # Root portfolio application
├── components/                # Design system primitives & modules
├── data/                      # Portfolio fixtures & typings
├── features/dashboard/        # Module renderers & skeletons
├── hooks/                     # Cross-cutting hooks (URL sync, media queries)
├── lib/                       # Formatting, query client, live event stream
├── store/                     # Zustand store with filters & feature flags
├── theme/                     # Design tokens + global styles
└── stories/                   # Storybook stories
```

## Design System Highlights
- 12-column responsive grid with 8pt spacing rhythm
- Tokenized typography scale (H1/H2/H3/Body/Caption)
- Surface elevations (S0–S3) with light/dark themes
- Semantic palettes (`--primary`, `--success`, `--warning`, `--danger`, `--info`)
- Colorblind-safe chart palette & vertical accent gradients
- Motion tuned to 200ms with reduced-motion support
- Accessible focus rings, keyboard navigation, and ARIA patterns

## Testing

```bash
npm run test
```

Vitest executes formatting utilities, design token resolution, and Zustand reducer tests under jsdom.

## Storybook

```bash
npm run storybook
```

Use the toolbar controls to toggle light/dark themes and LTR/RTL directions. Stories live in `src/stories`.
