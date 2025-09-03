# Component Spec — Input

## Purpose
Text data entry with validation and assistive behaviors.

## Variants
- Type: text, email, password, number
- State: default, focus, filled, disabled, error, success
- Size: sm, md, lg

## Visual
- Border: `color.border.default`; on focus `color.border.focus`
- Text: `color.text.default`; placeholder `color.text.muted`
- Radius: `radius.control`
- Focus ring: `a11y.focusRing`

## Behavior
- Debounced `onChange`; immediate input response < 100–200ms
- Clear affordance optional; shows only when value present
- Error state shows message and associates via `aria-describedby`

## Accessibility (WCAG 2.2 AA)
- Label: programmatically associated `label` or `aria-label`
- Keyboard: Tab focus visible; Esc clears when clearable is present
- ARIA: `aria-invalid` on error; `aria-describedby` for help/error text
- Hit target: height ≥ `a11y.target.minSize` (44px)
- Contrast: text vs bg ≥ 4.5:1; placeholder ≥ 3:1 minimum

## Keyboard Map
| Key | Action |
|-----|--------|
| Tab/Shift+Tab | Move focus |
| Esc | Clear value (if clearable) |
| Enter | Submit in form context |

## Error/Edge Cases
- Validation: client hints + server errors merged with priority
- Disabled: not focusable; visibly distinct
- Long values: horizontal scroll within control, preserve caret position

## Contract
- Props: `type`, `value`, `onChange`, `disabled`, `placeholder`, `aria-label`, `aria-describedby`, `error` (string)
- Data attributes: `data-testid="input"`

## Acceptance
- Keyboard navigation and ARIA verified
- Contrast and focus ring meet AA; screen reader announcements correct