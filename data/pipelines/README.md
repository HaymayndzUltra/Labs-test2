# Data Pipelines

## Reproducible Job: tokens_sync
- Purpose: Validate and publish design tokens matching schema
- Steps:
  1. Read `design/tokens/*.json`
  2. Validate against `docs/data/schemas/tokens-schema.yaml`
  3. Emit merged artifact to `data/pipelines/out/tokens.json`

## Run
- Environment: Node.js or Python with jsonschema
- Example (python): `python tokens_sync.py`

## Outputs
- `data/pipelines/out/tokens.json` (validated, merged)