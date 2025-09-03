# Data Lineage and DQ Thresholds

## Lineage (Tokens)
- Source: `design/tokens/core.json`, `design/tokens/semantic.json`
- Pipeline: `data/pipelines/tokens_sync.py`
- Output: `data/pipelines/out/tokens.json`
- Consumers: FE theme builder, API `/tokens`

## DQ Thresholds
- Schema validity: 100% pass
- Presence: required token categories present (colors.neutral/primary, typography, spacing)
- Format: colors hex regex; numeric sizes parseable

## Monitoring
- CI step validates schema and presence; pipeline fails on violations
- Periodic checks (daily) to detect drift