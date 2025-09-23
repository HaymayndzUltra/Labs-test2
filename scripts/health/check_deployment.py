#!/usr/bin/env python3
"""Deployment health verification helper."""

from __future__ import annotations

import argparse
import json
import ssl
import sys
import time
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass
from typing import Any, Dict, Optional


@dataclass
class CheckResult:
    name: str
    target: str
    ok: bool
    http_status: Optional[int]
    latency_ms: float
    error: Optional[str] = None
    response_excerpt: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        payload = asdict(self)
        if self.response_excerpt is None:
            payload.pop("response_excerpt")
        if self.error is None:
            payload.pop("error")
        if self.http_status is None:
            payload.pop("http_status")
        return payload


def build_ssl_context(insecure: bool) -> Optional[ssl.SSLContext]:
    if not insecure:
        return None
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx


def http_get(url: str, timeout: float, insecure: bool) -> urllib.request.addinfourl:
    request = urllib.request.Request(url, headers={"User-Agent": "deployment-health-check/1.0"})
    context = build_ssl_context(insecure)
    return urllib.request.urlopen(request, timeout=timeout, context=context)


def check_endpoint(name: str, url: str, timeout: float, insecure: bool) -> CheckResult:
    start = time.perf_counter()
    try:
        with http_get(url, timeout, insecure) as response:
            status_code = response.getcode()
            snippet = response.read(512)
            latency_ms = (time.perf_counter() - start) * 1000
            ok = 200 <= status_code < 400
            excerpt = snippet.decode("utf-8", errors="ignore").strip() or None
            return CheckResult(
                name=name,
                target=url,
                ok=ok,
                http_status=status_code,
                latency_ms=latency_ms,
                response_excerpt=excerpt,
            )
    except urllib.error.URLError as exc:  # pragma: no cover - network failure branch
        latency_ms = (time.perf_counter() - start) * 1000
        return CheckResult(
            name=name,
            target=url,
            ok=False,
            http_status=None,
            latency_ms=latency_ms,
            error=str(exc),
        )


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Verify a deployment by probing public health endpoints.")
    parser.add_argument("--environment", required=True, help="Logical deployment environment (e.g., staging, production)")
    parser.add_argument("--frontend-url", required=True, help="Public URL that should respond with the frontend")
    parser.add_argument("--api-url", required=True, help="Health endpoint for the backend API")
    parser.add_argument("--db-url", help="Optional database connectivity check endpoint")
    parser.add_argument("--output-file", help="Write JSON results to the provided path")
    parser.add_argument("--timeout", type=float, default=10.0, help="Per-request timeout in seconds")
    parser.add_argument("--insecure", action="store_true", help="Disable TLS verification (for self-signed certs)")

    args = parser.parse_args(argv)

    checks = [
        check_endpoint("frontend", args.frontend_url, args.timeout, args.insecure),
        check_endpoint("api", args.api_url, args.timeout, args.insecure),
    ]

    if args.db_url:
        checks.append(check_endpoint("database", args.db_url, args.timeout, args.insecure))

    report = {
        "environment": args.environment,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "results": [c.to_dict() for c in checks],
        "overall_ok": all(c.ok for c in checks),
    }

    if args.output_file:
        with open(args.output_file, "w", encoding="utf-8") as handle:
            json.dump(report, handle, indent=2)
            handle.write("\n")

    for check in checks:
        status = "PASS" if check.ok else "FAIL"
        detail = f"{check.latency_ms:.1f}ms"
        if check.http_status is not None:
            detail += f" (HTTP {check.http_status})"
        print(f"[{status}] {check.name} -> {check.target} :: {detail}")
        if check.error:
            print(f"      error: {check.error}")
        if check.response_excerpt:
            excerpt = check.response_excerpt.replace("\n", " ")
            print(f"      body: {excerpt[:120]}")

    return 0 if report["overall_ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
