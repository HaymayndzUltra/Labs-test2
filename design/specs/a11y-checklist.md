# Accessibility Checklist — WCAG 2.2 AA

## Global
- [ ] Color contrast AA: text ≥ 4.5:1; large text ≥ 3:1; UI components ≥ 3:1
- [ ] Focus visible on all interactive elements; 2px ring recommended
- [ ] Keyboard: full operability without a mouse; logical tab order
- [ ] Skip link to main content; landmarks and headings structured
- [ ] Target size min 44px for touch

## Components
### Button
- [ ] Enter/Space activates; `aria-disabled` respected when disabled
- [ ] State changes announced appropriately

### Input
- [ ] Label associated; placeholder not used as label
- [ ] Errors via `aria-describedby`; `aria-invalid` on error

## Motion & Feedback
- [ ] Animations avoid flashing; provide reduced-motion support

## Screen Reader Support
- [ ] Roles and names programmatically determinable
- [ ] Descriptions available for icons-only controls

## Testing
- [ ] Keyboard walkthrough completed
- [ ] Screen reader pass (NVDA/VoiceOver)
- [ ] Automated checks (axe/lighthouse) clean or mitigated