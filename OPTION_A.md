Best practices para sa 10 hiwa-hiwalay na framework

Gamitin ang Auto-Attached + globs per framework

Governance Overlay (Security & Compliance) → alwaysApply: true (1 light file lang)

Iwasan ang overlap: gawing mas “makitid” ang globs; kung may shared paths, ilagay ang shared checks sa isang shared rule o gawing Manual / Agent Requested

Short & sharp: panatilihing checklist/decision points; i-link ang mahahaba sa @examples/... files sa shared/templates/

Smoke test: mag-open/modify ng isang file sa loob ng bawat folder at tingnan kung tama ang na-aattach na rules

Folder tree (nested per framework)

Ito ang concrete, plug-and-play layout kung gusto mo talagang magkakahiwalay lahat:



your-repo/
├─ .cursor/
│  └─ rules/
│     └─ security-compliance-overlay.mdc     # Always (governance overlay)
│
├─ frameworks/
│  ├─ discovery-intake/
│  │  └─ .cursor/rules/discovery.mdc
│  ├─ product-planning/
│  │  ├─ fe/.cursor/rules/planning-fe.mdc
│  │  └─ be/.cursor/rules/planning-be.mdc
│  ├─ ux-ui/
│  │  └─ .cursor/rules/ux-ui-design.mdc
│  ├─ architecture-api/
│  │  └─ .cursor/rules/architecture-api.mdc
│  ├─ data-ml/
│  │  └─ .cursor/rules/data-ml.mdc
│  ├─ implementation/
│  │  ├─ fe/.cursor/rules/implementation-fe.mdc
│  │  └─ be/.cursor/rules/implementation-be.mdc
│  ├─ qa-test/
│  │  └─ .cursor/rules/qa-test.mdc
│  ├─ release-deployment/
│  │  └─ .cursor/rules/release-deploy.mdc
│  └─ observability-retro/
│     └─ .cursor/rules/observability-retro.mdc
│
├─ shared/
│  ├─ templates/        # ADR, test plans, runbooks, model cards, etc.
│  └─ examples/         # mga file na i-@examples sa rules
│
├─ contracts/           # (totoong source mo – naka-map sa architecture & data)
│  ├─ api/**            # openapi, mocks
│  └─ data/**           # schema.sql, migrations, seeds
├─ docs/
│  ├─ architecture/**   # ADRs, .mmd diagrams
│  ├─ data/**           # contracts, datasets, schemas, privacy
│  └─ ml/**             # baseline, drift, evaluation
├─ src/
│  └─ frontend/**       # FE code, telemetry, tests
├─ tests/
│  └─ load/**           # k6, perf
├─ .github/workflows/** # CI/CD (kung meron)
├─ Makefile
└─ .lighthouserc.json
