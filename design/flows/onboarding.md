# User Flow — Onboarding (Example)

## Actors
- New user (first-time)

## Goals
- Understand framework artifacts; locate planning and discovery outputs

## Steps
1. User lands on Home → sees navigation to Docs
2. User navigates to Discovery → reads Brief and RAD
3. User navigates to Planning → reads PRD, Roadmap, Backlog
4. User proceeds to Implementation → links to components and tokens

## A11y & Perf Considerations
- All links focusable with visible outline; logical tab order
- Skip-to-content present; headings structured (h1..h3)
- Minimum target sizes 44px; color contrast AA
- LCP ≤2.5s for initial load; avoid layout shift on navigation

## Artifacts
- References:
  - `/workspace/docs/discovery/*`
  - `/workspace/docs/planning/*`
  - `/workspace/design/tokens/*`