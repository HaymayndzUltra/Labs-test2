# Premium Dashboard Design System
_Generated at 09/26/2025, 4:14:00 AM_

This document captures the shared tokens, component states, and motion choreography that power the Premium Multi-Category Dashboard.

## Foundation Tokens

| Category | Token | Value |
| --- | --- | --- |
| Typography | font.family.base | `Inter, Segoe UI, system-ui` |
| Typography | font.family.numeric | `Inter Tight, Roboto Mono, SFMono-Regular` |
| Typography | font.size.display | 32px |
| Typography | font.size.title | 24px |
| Typography | font.size.subtitle | 18px |
| Typography | font.size.body | 14px |
| Typography | font.weight.bold | 600 |
| Typography | font.weight.medium | 500 |
| Typography | font.weight.regular | 400 |
| Spacing | spacing.scale | 4, 8, 12, 16, 24, 32, 40 |
| Elevation | elevation.base | `0 1px 2px rgba(17,24,39,0.04)` |
| Elevation | elevation.raised | `0 8px 24px rgba(17,24,39,0.08)` |
| Elevation | elevation.overlay | `0 12px 32px rgba(17,24,39,0.16)` |
| Motion | duration.micro | 110ms |
| Motion | duration.standard | 200ms |
| Motion | duration.narrative | 320ms |
| Motion | easing.smooth | `cubic-bezier(0.17,0.84,0.44,1)` |
| Motion | easing.crisp | `cubic-bezier(0.2,0.6,0,0.99)` |
| Motion | easing.emphasis | `cubic-bezier(0.12,0.72,0.18,1)` |
| Motion | spring.drag | stiffness 360, damping 36 |
| Motion | spring.snap | stiffness 400, damping 34 |

### Color Ramps

| Semantic | Light | Dark |
| --- | --- | --- |
| Canvas | `#F7F7FB` | `#0D0C12` |
| Surface | `#FFFFFF` | `#171628` |
| Surface Subtle | `#F1F2F6` | `#1F1E32` |
| Foreground | `#1F1B2C` | `#FAFAFF` |
| Foreground Muted | `#4C4A5E` | `#B1B0C6` |
| Border | `#D7D8E5` | `#343254` |
| Border Strong | `#A2A5C1` | `#59577A` |
| Primary | `#6C4DD9` | `#B79BFF` |
| Primary Soft | `#E8E0FF` | `#3A2A6B` |
| Success | `#1E9F6E` | `#3FD6A0` |
| Success Soft | `#D9F3E9` | `#123C2C` |
| Warning | `#D88500` | `#FFB547` |
| Warning Soft | `#FFF1D6` | `#4A3510` |
| Error | `#C53A3A` | `#FF6A6A` |
| Error Soft | `#FCE4E4` | `#47161D` |
| Info | `#2D6CDF` | `#77A8FF` |
| Info Soft | `#E0EBFF` | `#1C2D59` |

Chart palettes expose as CSS variables `--color-chart-1` through `--color-chart-6` so both themes preserve hierarchy.

## Component States

* **KPI Cards** – padding 20px, tabular numbers, badge deltas with icon + label, states for success/warning/info.
* **Tables** – sticky headers via `table-grid`, bold header contrast, conversion columns emphasised.
* **Charts** – accessible `<figure>` with `aria` summaries, hashed donut fills, stacked line/bars with annotated legends.
* **Automation Builder** – consistent padding between builder vs log cards, CTA obeys hover/press bounds (lift -2px / press scale 0.98).
* **States** – skeleton (loading), empty (call-to-action copy), error (badge + explanation), success (data).

## Motion Map Per Module

| Module | Entry Sequence | Detail Motion | Reduced Motion |
| --- | --- | --- | --- |
| SaaS | Filters fade 0–120ms → KPIs count-up 120–260ms → charts slide 260–520ms → builder cards rise 520–600ms | Delta-only updates on charts; automation cards lift -2px on hover with smooth easing | Sequential opacity fades, no translation |
| E-commerce | KPI count-up precedes baseline-aligned trend draw | Table rows stagger 40ms using crisp easing; alerts pulse 200ms | Rows fade with 120ms duration |
| Corporate | Funnel compresses from baseline with emphasis easing | Donut segments animate via stroke dash; timeline cascades 3 items per 60ms | Funnel/cards fade only |
| Productivity | Kanban columns snap with spring stiffness 380 | Drag interactions use snap springs; success pulses 0.96→1 | Kanban updates fade highlight, no translation |
| Media | Queue timeline slides from baseline 260ms | READY/REVIEW/BLOCKED badges lift -2px on hover | Queues fade, badges rely on contrast |
| EdTech | Heatmap cells reveal 320ms crisp easing | Alert stack pulses subtle border; tables slide 8px | Heatmap color transition only; tables fade |
| Specialized Niches | Segmented tabs crossfade 200ms | Automation logs stagger 40ms; badges animate icon fill | Tabs fade; badges remain static |

## Automation Templates

Automation blueprints live in `automationTemplates` (TypeScript), supporting the builder and module playbooks. Extend by appending human-readable descriptions; components consume them automatically.

## Accessibility Commitments

* WCAG AA contrast across light/dark themes (verified via tokens).
* ARIA labels for charts, tables, and automation logs.
* Keyboard support for Kanban cards (Space/Enter) and focus rings with animated shadows.
* Tooltip delay of 140ms and respect for `prefers-reduced-motion` (global attribute `data-motion="reduce"`).

---

For visual context, run `npm run dev` and explore `/dashboard`. Toggle theme, direction, motion, and state controls to validate parity.
