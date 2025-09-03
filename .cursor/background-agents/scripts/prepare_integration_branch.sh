#!/usr/bin/env bash
set -euo pipefail

BRANCH_NAME="${1:-integration}"

echo "[+] Preparing integration branch: ${BRANCH_NAME}"

# Ensure git initialized
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "[-] Not inside a git repository. Abort." >&2
  exit 1
fi

# Fetch remotes (if any)
if git remote -v >/dev/null 2>&1; then
  git fetch --all --prune || true
fi

# Create or reset branch from main/default
DEFAULT_BRANCH="main"
if ! git show-ref --verify --quiet refs/heads/${DEFAULT_BRANCH}; then
  DEFAULT_BRANCH="master"
fi

echo "[+] Using default branch: ${DEFAULT_BRANCH}"

git checkout ${DEFAULT_BRANCH}

git pull --rebase --autostash || true

if git show-ref --verify --quiet refs/heads/${BRANCH_NAME}; then
  echo "[+] Branch exists; updating from ${DEFAULT_BRANCH}"
  git checkout ${BRANCH_NAME}
  git reset --hard ${DEFAULT_BRANCH}
else
  echo "[+] Creating branch ${BRANCH_NAME} from ${DEFAULT_BRANCH}"
  git checkout -b ${BRANCH_NAME} ${DEFAULT_BRANCH}
fi

# Bootstrap a minimal CI workflow if missing
mkdir -p .github/workflows
if [ ! -f .github/workflows/integration.yml ]; then
  cat > .github/workflows/integration.yml << 'YML'
name: integration
on:
  push:
    branches: [ integration ]
  pull_request:
    branches: [ integration ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install
        run: |
          if [ -f package-lock.json ]; then npm ci; elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; else echo "No JS lockfile"; fi
      - name: Lint & Test
        run: |
          if [ -f package.json ]; then npm run -s lint || true; npm test --silent || true; else echo "No package.json"; fi
YML
fi

echo "[+] Done. Current branch: $(git branch --show-current)"
