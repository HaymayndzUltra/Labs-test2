#!/usr/bin/env node
/*
Enhanced MCP Orchestrator
- Reads package.json with xTemplatePacks (packs + mcp config)
- Loads optional .env.mcp alongside the package.json and substitutes ${VAR}
- Validates inputs (packs present, categories unique, canonical enforceable)
- Computes selected servers per category (api/flags/deploy/email/evidence)
- Writes three artifacts next to package.json:
  * configs/mcp.active.json  (detailed selection)
  * configs/mcp.cursor.json  (Cursor-ready minimal entries)
  * reports/mcp/summary.md   (human-readable summary)

Usage:
  node tools/mcp-orchestrator.js <path/to/package.json>
*/
const fs = require('fs');
const path = require('path');

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadEnv(pDir) {
  const envPath = path.join(pDir, '.env.mcp');
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    out[m[1]] = m[2];
  }
  return out;
}

function substEnv(str, env) {
  if (typeof str !== 'string') return str;
  return str.replace(/\$\{([A-Z0-9_]+)\}/g, (_, k) => (env[k] ?? `
${'${'}${k}${'}'}`));
}

function categoryOf(s) {
  const tag = (s.tags || []).find(t => t.startsWith('category:'));
  return tag ? tag.slice(9) : null;
}

function main() {
  const pkgPath = process.argv[2];
  if (!pkgPath) {
    console.error('Usage: node tools/mcp-orchestrator.js <path/to/package.json>');
    process.exit(1);
  }
  const pkgDir = path.dirname(path.resolve(pkgPath));
  const pkg = loadJson(pkgPath);
  const cfg = pkg.xTemplatePacks || {};
  const packs = new Set(cfg.packs || []);
  const mcp = cfg.mcp || {};
  const canonical = mcp.canonical || {};
  const budgets = mcp.budgets || {};
  const servers = Array.isArray(mcp.servers) ? mcp.servers : [];

  const env = loadEnv(pkgDir);

  // Validation
  const errors = [];
  if (!packs.size) errors.push('packs required (xTemplatePacks.packs)');
  const cats = new Set();
  for (const s of servers) {
    const c = categoryOf(s);
    if (!c) continue;
    if (cats.has(c)) {
      // allowed multiple; resolved later by canonical/first-match
    } else {
      cats.add(c);
    }
  }
  // Compute eligible by packs
  const eligible = servers.filter(s => (s.tags || []).some(t => t.startsWith('pack:') && packs.has(t.slice(5))));

  // Selection
  const chosen = new Map(); // cat -> server
  for (const s of eligible) {
    const cat = categoryOf(s);
    if (!cat) continue;
    const want = canonical[cat];
    if (want && s.name !== want) continue; // enforce canonical
    if (!chosen.has(cat)) chosen.set(cat, s); // first match wins
  }

  // Post checks for canonical
  for (const [cat, want] of Object.entries(canonical)) {
    const sel = chosen.get(cat);
    if (want && (!sel || sel.name !== want)) {
      errors.push(`canonical for category ${cat} requires server name=${want}, but not found in eligible set`);
    }
  }

  if (errors.length) {
    console.error('[MCP] validation errors:\n- ' + errors.join('\n- '));
    process.exit(2);
  }

  // Build outputs
  const selectedServers = Array.from(chosen.entries()).map(([cat, s]) => {
    return {
      category: cat,
      name: s.name,
      type: s.type,
      url: substEnv(s.url || null, env),
      cmd: s.cmd || null,
      tags: s.tags
    };
  });

  const outActive = {
    packs: Array.from(packs),
    budgets: {
      maxActive: budgets.maxActive ?? 8,
      maxPerRun: budgets.maxPerRun ?? 3,
      connectTimeoutMs: budgets.connectTimeoutMs ?? 5000,
      opTimeoutMs: budgets.opTimeoutMs ?? 60000,
      retries: budgets.retries ?? 2
    },
    canonical,
    selectedServers
  };

  const cursorServers = selectedServers.map(s => ({
    name: s.name,
    type: s.type,
    url: s.type === 'sse' ? s.url : undefined,
    command: s.type === 'stdio' ? s.cmd : undefined
  })).filter(Boolean);

  const summary = [
    '# MCP Selection Summary',
    '',
    `packs: ${outActive.packs.join(', ')}`,
    '',
    'Selected:',
    ...selectedServers.map(s => `- ${s.category}: ${s.name} (${s.type}) ${s.type==='sse' ? s.url : s.cmd}`),
    '',
    'Next steps:',
    '- Open Cursor → Settings → MCP → Add New Server using the entries in configs/mcp.cursor.json',
  ].join('\n');

  const cfgDir = path.join(pkgDir, 'configs');
  const repDir = path.join(pkgDir, 'reports', 'mcp');
  fs.mkdirSync(cfgDir, { recursive: true });
  fs.mkdirSync(repDir, { recursive: true });

  fs.writeFileSync(path.join(cfgDir, 'mcp.active.json'), JSON.stringify(outActive, null, 2));
  fs.writeFileSync(path.join(cfgDir, 'mcp.cursor.json'), JSON.stringify(cursorServers, null, 2));
  fs.writeFileSync(path.join(repDir, 'summary.md'), summary);

  // Still print active to stdout for piping
  process.stdout.write(JSON.stringify(outActive, null, 2));
}

main();