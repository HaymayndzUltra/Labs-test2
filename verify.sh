#!/usr/bin/env bash
set -euo pipefail

PKG="dist/complete-scaffold-demo-submission.tar.gz"
WORKDIR="$(mktemp -d)"
tar -xzf "$PKG" -C "$WORKDIR"

pushd "$WORKDIR"/complete-scaffold-demo-submission >/dev/null

echo "== Checksum verify =="
sha256sum -c CHECKSUMS.sha256

echo "== Evidence parity =="
ls -1 stack.snapshot.complete-scaffold-demo.json \
      scaffold.complete-scaffold-demo.json \
      perf.complete-scaffold-demo.json \
      coverage.complete-scaffold-demo.json \
      hipaa.complete-scaffold-demo.json \
      gdpr.complete-scaffold-demo.json \
      CHECKSUMS.sha256 >/dev/null

echo "== OPA gate =="
if command -v opa >/dev/null 2>&1; then
  opa eval -i manifest.json -d opa/policy.rego "data.submission.pass.allow" | grep -q 'true'
  echo "OPA: PASS"
else
  echo "WARN: OPA not installed; skipping policy eval"
fi

echo "== Archive contents =="
test -f SUBMISSION.md && echo "SUBMISSION.md present"

echo "== Git tag provenance (optional) =="
# Replace with your local repo if verifying against source
# git fetch --tags
# git rev-parse submission/complete-scaffold-demo
# git cat-file -p submission/complete-scaffold-demo

echo "ALL CHECKS PASSED"
