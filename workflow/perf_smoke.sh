#!/usr/bin/env bash
set -euo pipefail
mkdir -p metrics
: "${PERF_ENDPOINT:?PERF_ENDPOINT is required}"
: "${PERF_OUTPUT:=metrics/input_perf.txt}"

cat > metrics/k6_smoke.js <<'EOF'
import http from 'k6/http';
import { sleep } from 'k6';
export const options = { vus: 5, duration: '30s' };
export default function () {
  http.get(__ENV.PERF_ENDPOINT);
  sleep(0.1);
}
EOF

# run k6; if fails, still continue (we'll write 9999ms)
k6 run -e PERF_ENDPOINT="${PERF_ENDPOINT}" metrics/k6_smoke.js > metrics/k6_out.txt 2>&1 || true
P95=$(grep -Eo 'http_req_duration.*p\(95\)=\s*([0-9.]+)ms' metrics/k6_out.txt | tail -n1 | awk -F'=' '{print $2}' | tr -d ' ms' || true)
[ -z "$P95" ] && P95=9999
echo "$P95" > "${PERF_OUTPUT}"
echo "Perf p95(ms)=${P95}"
