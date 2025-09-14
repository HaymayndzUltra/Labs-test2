Summary
Description (short):
Ship a production news feed application end-to-end. You’ll implement source ingestion (RSS/APIs + selective scraping), content processing (extraction → de-dup → LLM classification/editorial), a fast query layer, and a clean feed UI with save/rate/report and paid filters. Code-only (React/TS) and move fast using context engineering + Claude Code/Codex. US-first scope.

Outcomes & targets:

Ingestion: RSS/Atom, regulatory and pressroom APIs; managed scraping only where needed; daily cadence (hourly when feasible).

Pipeline: Fetch → extract (Trafilatura/Readability/Goose) → clean → de-dup → classify/editorialize → store.

Performance: Feed queries p95 less than 1s; ingestion latency less than 5 min.

UI: Filters (free + paid lock states), Save, Usefulness rating, Report controls.

Ops: Orchestrated with Encore (schedules/jobs); optional Python extractor sidecar.

Scale: Designed to expand to 100+ trusted sources over time.

What you’ll build:

Backend (Encore/TS): source runners, schedulers, extraction/cleanup, de-dup, LLM tagging, Postgres query endpoints.

Frontend (Next.js): performant feed UI with top-level filters and post cards; free/paid filter gating.

Data layer: Postgres + JSONB tags (GIN/tsvector), keyset pagination.

Must-have skills (top 5):

Encore (TypeScript services) — schedulers, jobs, typed REST APIs

Next.js (React, Tailwind/ShadCN) — high-performance feed UI

PostgreSQL FTS & indexing — GIN/tsvector, JSONB filters, keyset pagination

Content ingestion & extraction — RSS/APIs, controlled scraping, de-duplication

LLM classification/editorial — prompt design & context engineering (Claude Code/Codex), confidence scoring

Code-only mandate: React/TypeScript. No Tableau/Power BI/Superset/Retool/low-code tools.

Apply with:

2–3 links to code-built feeds/pipelines you shipped

Your plan to hit p95 less than 1s (indexes, query shapes, pagination)

How you’ll use Claude Code/Codex to accelerate delivery

Availability + milestone outline

More than 30 hrs/week
Hourly
More than 6 months
Duration
Expert
I am willing to pay higher rates for the most experienced freelancers