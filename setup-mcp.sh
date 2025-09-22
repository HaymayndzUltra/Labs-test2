#!/usr/bin/env bash
set -euo pipefail

SLUG="${1:-acme-001}"
ROOT="clients/$SLUG"

echo "⛏️  Creating scaffold at $ROOT ..."
mkdir -p "$ROOT"/{frontend,backend,configs,reports/{api,feature_flags,deploy,email,screenshots},reports/mcp}

# Backup existing meta package.json
if [ -f "$ROOT/package.json" ]; then cp "$ROOT/package.json" "$ROOT/package.json.bak"; fi

cat > "$ROOT/package.json" <<'JSON'
{
  "name": "CLIENT-SLUG",
  "private": true,
  "version": "0.0.0",
  "xTemplatePacks": {
    "packs": ["angular", "laravel", "featureflags", "deployment", "email", "qa"],
    "mcp": {
      "budgets": { "maxActive": 8, "maxPerRun": 3, "connectTimeoutMs": 5000, "opTimeoutMs": 60000, "retries": 2 },
      "canonical": {
        "deploy": "endgame",
        "flags": "statsig",
        "api": "postman",
        "email": "mailtrap",
        "evidence": "peekaboo"
      },
      "servers": [
        { "name": "postman",  "tags": ["pack:angular","pack:laravel","category:api"],      "type": "sse",   "url": "${POSTMAN_URL}" },
        { "name": "statsig",  "tags": ["pack:featureflags","category:flags"],               "type": "sse",   "url": "${STATSIG_URL}" },
        { "name": "bucket",   "tags": ["pack:featureflags","category:flags"],               "type": "stdio", "cmd": "bucket-mcp"    },
        { "name": "endgame",  "tags": ["pack:deployment","category:deploy"],                "type": "sse",   "url": "${ENDGAME_URL}" },
        { "name": "mailtrap", "tags": ["pack:email","category:email"],                      "type": "sse",   "url": "${MAILTRAP_URL}"},
        { "name": "peekaboo", "tags": ["pack:qa","pack:ui","category:evidence"],            "type": "stdio", "cmd": "peekaboo"      }
      ]
    }
  }
}
JSON

# Env placeholders
cat > "$ROOT/.env.mcp.example" <<'ENV'
# Fill then copy to .env.mcp (same directory)
POSTMAN_URL=https://<your-postman-mcp-sse-url>
STATSIG_URL=https://<your-statsig-mcp-sse-url>
ENDGAME_URL=https://<your-endgame-mcp-sse-url>
MAILTRAP_URL=https://<your-mailtrap-mcp-sse-url>
ENV

# Run orchestrator (env substitution if .env.mcp exists)
if [ -f "$ROOT/.env.mcp" ]; then echo "🔐 Using $ROOT/.env.mcp for URL substitution"; fi
node tools/mcp-orchestrator.js "$ROOT/package.json" > "$ROOT/configs/mcp.active.json"
cp -f "$ROOT/configs/mcp.cursor.json" "$ROOT/reports/mcp/mcp.cursor.json" || true

# Echo next steps
cat <<MSG
✅ Done.
➡ Next:
  1) Edit $ROOT/.env.mcp.example and copy to $ROOT/.env.mcp with real SSE URLs
  2) Re-run: node tools/mcp-orchestrator.js $ROOT/package.json (to refresh configs)
  3) Cursor → Settings → MCP → Add New Server
     - Use $ROOT/configs/mcp.cursor.json for entries
  4) Artifacts & outputs: $ROOT/reports/**
MSG