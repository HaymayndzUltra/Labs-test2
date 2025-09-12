Mas advanced na end-to-end flow (auto from paste → proposal → full brief)
Smart ingestion (auto-start)
Drop a file into upwork-inbox/ or run @upwork start → auto-create upwork-sessions/session-XXX/
Preserve full raw post (job-post.txt) + fingerprint for dedupe and versioning
Redact PII-only if unsafe; never alter source text used for evidence
Deterministic extraction + gap map
Heuristic extractors first (budget, timeline, deliverables, skills, KPIs)
Build extracted-info.json + gaps.json with: unknowns, ambiguities, risks, compliance flags
Create a “requirements matrix” (Must/Should/Could/Won’t) with status: unknown, assumed, confirmed
Initial proposal (rules-enforced)
Generator enforces 5-part structure, exact CTA, word-count, client-tone
“Evidence gate” cross-checks every claim against candidate-facts.yaml (no fabrication)
3-pass validator (structure/hygiene → tailoring/truthfulness → compliance/tone); blocks if failing
Client response processing (delta-aware)
Paste reply via @upwork add → compute diff vs last known facts
Update extracted-info.json, close items in gaps.json, and refresh requirements matrix
Generate max 2–3 sharp follow-up questions prioritized by criticality and dependency
Iterative refinement (signal-first)
“Assumptions ledger” with expiry and conversion to confirmed when evidence appears
Tone tuner (technical vs plain) inferred from client wording; mirrors terms (e.g., “MVP”, “dashboard”)
Domain router (e.g., Shopify, SaaS, Data) adjusts checklists and risk patterns automatically
Complete client brief (one-click)
project-brief.md with Overview, Technical Requirements, Milestones, Budget, Success Criteria, Risks
Acceptance criteria per deliverable; tie each to the requirements matrix
Include traceability: which client message satisfied each requirement
Quality and compliance guards
Strict checks: no external contact info, no placeholders, no new tools/KPIs not in inputs
“Red-flag” scanner (scope creep, missing data access, unclear ownership, risky timelines)
Proposal-only PII policy; store raw client text separately, never mixed into generated content
Commands (minimal, scannable UX)

@upwork start                # create session from pasted job post
@upwork add                  # append client response and re-analyze
@upwork status               # progress, completeness %, open gaps, risk flags
@upwork gaps                 # remaining unknowns + top 3 next questions
@upwork draft                # regenerate proposal (keeps structure/CTA rules)
@upwork validate             # run 3-pass validator; fail loud if any breach
@upwork brief                # output final project-brief.md
@upwork tune --tone plain    # force tone override (plain|technical)
@upwork facts                # view/update candidate-facts.yaml (evidence source)

File structure

upwork-inbox/
upwork-sessions/
  session-001/
    job-post.txt
    conversation-history.md
    extracted-info.json
    gaps.json
    requirements-matrix.md
    assumptions-ledger.md
    project-brief.md
config/
  candidate-facts.yaml
  proposal-style.yaml


What’s newly enhanced vs tentative plan
Requirements matrix + assumptions ledger with lifecycle
Delta-aware updates and priority-ranked questions
Evidence-gated proposals (no claims outside candidate-facts.yaml)
3-pass validator with hard fail; exact CTA and word-count guardrails
Domain-aware routing, tone mirroring, and red-flag risk scanner
Traceability from each brief item back to client messages