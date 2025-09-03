# Component Spec — Button

## Purpose
Primary action trigger with accessible, performant interactions.

## Variants
- Kind: primary, secondary, danger
- Size: sm, md, lg
- State: default, hover, active, disabled, loading

## Visual
- Background: `color.action.primary` → hover/active tokens
- Text: `color.text.inverted`
- Border radius: `radius.control`
- Focus ring: `a11y.focusRing`

## Behavior
- Click triggers assigned action
- Disabled: no pointer events, reduced contrast pass maintained
- Loading: shows spinner, preserves button width

## Accessibility (WCAG 2.2 AA)
- Keyboard: Tab focus visible; Enter/Space activate
- ARIA: `role="button"` when not native; `aria-disabled` when disabled
- Focus: 2px ring, minimum 3:1 contrast against adjacent colors
- Hit target: min `a11y.target.minSize` (44px)
- States announced to screen readers on change

## Keyboard Map
| Key | Action |
|-----|--------|
| Tab/Shift+Tab | Move focus |
| Enter/Space | Activate |
| Esc | Cancel in contextual dialogs |

## Error/Edge Cases
- Loading + disabled: loading overrides; disable click, show progress
- Long label: truncate with accessible tooltip/title

## Contract
- Props: `variant`, `size`, `disabled`, `loading`, `onClick`, `aria-label`
- Data attributes for testing: `data-testid="button"`

## Acceptance
- Contrast AA: text vs bg ≥ 4.5:1; focus ring ≥ 3:1
- Keyboard paths validated; screen reader announcements verified
- Performance: interaction response < 100–200ms