#!/usr/bin/env python3
"""
Write metrics/perf.json with an http_p95_ms value.
- For simplicity, reads from env PERF_P95_MS or from metrics/input_perf.txt (ms)
- In real setups, integrate k6/Locust and write this file from their outputs.

Usage:
  PERF_P95_MS=420 python scripts/collect_perf.py
"""
from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
METRICS = ROOT / "metrics"


def main() -> int:
    METRICS.mkdir(parents=True, exist_ok=True)
    val = os.getenv("PERF_P95_MS")
    if not val:
        p = METRICS / "input_perf.txt"
        if p.exists():
            try:
                val = p.read_text(encoding="utf-8").strip()
            except Exception:
                val = None
    try:
        p95 = float(val) if val else 9999.0
    except Exception:
        p95 = 9999.0
    (METRICS / "perf.json").write_text(f"{{\n  \"http_p95_ms\": {p95} \n}}\n", encoding="utf-8")
    print(f"{{\"http_p95_ms\": {p95} }}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())