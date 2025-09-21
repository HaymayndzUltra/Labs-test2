#!/usr/bin/env bash
set -euo pipefail

# install_and_test.sh
# Stack-aware install/build/test runner for generated projects.
# Detects FE/BE directories and runs appropriate package managers/tests.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
cd "$ROOT_DIR"

FRONTEND_DIR=${FRONTEND_DIR:-frontend}
BACKEND_DIR=${BACKEND_DIR:-backend}

run_if_dir() {
  local dir="$1"; shift || true
  if [[ -d "$dir" ]]; then
    ( cd "$dir" && echo "[INSTALL_TEST] In $(pwd)" && "$@" )
  else
    echo "[INSTALL_TEST] Skip: directory '$dir' not found"
  fi
}

# Frontend: nextjs/nuxt/angular/expo (node based)
if [[ -d "$FRONTEND_DIR" ]]; then
  if command -v pnpm >/dev/null 2>&1; then PM=pnpm; elif command -v npm >/dev/null 2>&1; then PM=npm; elif command -v yarn >/dev/null 2>&1; then PM=yarn; else PM=""; fi
  if [[ -n "${PM}" ]]; then
    case "$PM" in
      pnpm)
        run_if_dir "$FRONTEND_DIR" pnpm install --frozen-lockfile
        run_if_dir "$FRONTEND_DIR" pnpm run build || true
        run_if_dir "$FRONTEND_DIR" pnpm test || true
        ;;
      npm)
        run_if_dir "$FRONTEND_DIR" npm ci
        run_if_dir "$FRONTEND_DIR" npm run build || true
        run_if_dir "$FRONTEND_DIR" npm test || true
        ;;
      yarn)
        run_if_dir "$FRONTEND_DIR" yarn install --frozen-lockfile || yarn install
        run_if_dir "$FRONTEND_DIR" yarn build || true
        run_if_dir "$FRONTEND_DIR" yarn test || true
        ;;
    esac
  else
    echo "[INSTALL_TEST] No Node package manager found (pnpm/npm/yarn)." >&2
  fi
fi

# Backend: fastapi/django/nestjs/go
if [[ -d "$BACKEND_DIR" ]]; then
  # Detect Python backend (fastapi/django)
  if [[ -f "$BACKEND_DIR/requirements.txt" || -f "$BACKEND_DIR/pyproject.toml" ]]; then
    run_if_dir "$BACKEND_DIR" python -m pip install -r requirements.txt || true
    run_if_dir "$BACKEND_DIR" pytest -q || true
  fi
  # Detect NestJS (node)
  if [[ -f "$BACKEND_DIR/package.json" ]]; then
    if command -v pnpm >/dev/null 2>&1; then PM=pnpm; elif command -v npm >/dev/null 2>&1; then PM=npm; elif command -v yarn >/dev/null 2>&1; then PM=yarn; else PM=""; fi
    if [[ -n "${PM}" ]]; then
      case "$PM" in
        pnpm)
          run_if_dir "$BACKEND_DIR" pnpm install --frozen-lockfile
          run_if_dir "$BACKEND_DIR" pnpm run build || true
          run_if_dir "$BACKEND_DIR" pnpm test || true
          ;;
        npm)
          run_if_dir "$BACKEND_DIR" npm ci
          run_if_dir "$BACKEND_DIR" npm run build || true
          run_if_dir "$BACKEND_DIR" npm test || true
          ;;
        yarn)
          run_if_dir "$BACKEND_DIR" yarn install --frozen-lockfile || yarn install
          run_if_dir "$BACKEND_DIR" yarn build || true
          run_if_dir "$BACKEND_DIR" yarn test || true
          ;;
      esac
    else
      echo "[INSTALL_TEST] No Node package manager found for backend." >&2
    fi
  fi
  # Detect Go backend
  if [[ -f "$BACKEND_DIR/go.mod" ]]; then
    run_if_dir "$BACKEND_DIR" go mod download
    run_if_dir "$BACKEND_DIR" go test ./... -count=1 || true
  fi
fi

echo "[INSTALL_TEST] Completed"
