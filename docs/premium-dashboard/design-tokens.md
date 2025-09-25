# Premium Multi-Category Dashboard: SaaS, E-commerce, Corporate, Media, EdTech, Custom App, Niches
<small>Generated at 09/26/2025, 4:14:00 AM</small>

## Design Tokens
### Color (Light / Dark)
| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `--color-canvas` | #f7f7fb | #090815 | Background canvas |
| `--color-surface` | #ffffff | #141126 | Cards & surfaces |
| `--color-surface-subtle` | #f0eefc | #1c1733 | Sub-cards, chips |
| `--color-surface-strong` | #e7e4fa | #2a2149 | Tooltips, overlays |
| `--color-text-primary` | #1c1233 | #f6f1ff | Headlines & body |
| `--color-text-secondary` | #5a5078 | #bfb7d9 | Captions |
| `--color-text-muted` | #7f7697 | #9488b4 | Metadata |
| `--color-border` | #d7d2ef | #2f264b | Dividers |
| `--color-primary` | #6f4df6 | #9f8dff | Buttons, highlights |
| `--color-success` | #1f8a6f | #4fd5aa | Positive states |
| `--color-warning` | #b17b00 | #ffd166 | Caution |
| `--color-error` | #c73a3a | #ff7a7a | Errors |
| `--color-info` | #2563eb | #74a2ff | Informational |
| `--color-focus` | #8b6dfa | #b39aff | Focus rings |

### Typography
| Token | Size / Line Height | Weight | Notes |
| --- | --- | --- | --- |
| Display | 32 / 40 px | 600 | Header title |
| Heading | 24 / 32 px | 600 | Section titles |
| Title | 18 / 26 px | 500 | Card titles |
| Body | 14 / 20 px | 400 | Copy |
| Caption | 12 / 16 px | 400 | Metadata |
| Metric | 24 / 28 px | 600 | KPI values (tabular/lining) |
| Metric Sm | 18 / 22 px | 600 | Secondary metrics |

### Spacing & Layout
- Base grid: 12 columns ≥1280px, 8 columns tablet, 4 columns mobile.
- Gutters: 32px desktop, 24px tablet, 16px mobile.
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40 px.
- Card padding: 20px (matches spacing tokens).
- Border radii: 12px (chips), 16px (cards), 20px (overlays).

### Elevation
| Token | Shadow |
| --- | --- |
| `--shadow-base` | 0 2px 8px rgba(29,20,62,0.08) |
| `--shadow-raised` | 0 12px 24px -12px rgba(29,20,62,0.2) |
| `--shadow-overlay` | 0 20px 48px -24px rgba(16,11,35,0.32) |

### Motion
| Token | Value | Notes |
| --- | --- | --- |
| `--motion-duration-micro` | 110 ms | Hover/focus |
| `--motion-duration-standard` | 200 ms | UI transitions |
| `--motion-duration-narrative` | 320 ms | KPI count-up, card reveals |
| `--motion-duration-entrance` | 600 ms | Page entrance cascade |
| `--motion-easing-smooth` | cubic-bezier(0.17,0.84,0.44,1) | Standard easing |
| `--motion-easing-crisp` | cubic-bezier(0.2,0.6,0,0.99) | Micro interactions |
| `--motion-easing-emphasis` | cubic-bezier(0.12,0.72,0.18,1) | Highlights |
| Springs | drag: 360/36, snap: 420/32 | Space/enter drag accessible |

### Accessibility & Patterns
- Focus ring: 2px `--color-focus` with 3px offset.
- Tooltip delay: 140 ms via `--tooltip-delay`.
- Donut segments use patterned SVG fills plus text labels for redundancy.
- Charts expose `aria-label` descriptions; heatmaps overlay numeric values.
- Reduced motion: `[data-motion='reduce']` disables transitions/animations.
