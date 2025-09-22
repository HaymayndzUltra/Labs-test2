"""Compliance-aware middleware components.

This module centralizes audit and access logging helpers that can be toggled via
environment variables. It relies on the compliance configuration exposed in
``app.config.Settings``.
"""

from __future__ import annotations

import json
import logging
import time
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Iterable, Sequence

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

DEFAULT_REDACT_HEADERS = {"authorization", "cookie", "set-cookie"}


def _ensure_logger_handler(logger: logging.Logger, handler: logging.Handler) -> None:
    """Attach *handler* to *logger* if an equivalent handler is not present."""

    for existing in logger.handlers:
        same_file = getattr(existing, "baseFilename", None) == getattr(handler, "baseFilename", None)
        if type(existing) is type(handler) and same_file:
            return
    logger.addHandler(handler)


def _build_handler(destination: str | None) -> logging.Handler:
    if destination:
        path = Path(destination)
        path.parent.mkdir(parents=True, exist_ok=True)
        return RotatingFileHandler(path, maxBytes=5 * 1024 * 1024, backupCount=5)
    return logging.StreamHandler()


def configure_compliance_logging(
    *,
    destination: str | None,
    level: str = "INFO",
    enable_access: bool = False,
) -> None:
    """Configure audit/access loggers based on runtime settings."""

    log_level = getattr(logging, level.upper(), logging.INFO)

    audit_logger = logging.getLogger("compliance.audit")
    audit_logger.setLevel(log_level)
    audit_logger.propagate = False
    _ensure_logger_handler(audit_logger, _build_handler(destination))
    audit_logger.handlers[-1].setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))

    if enable_access:
        access_logger = logging.getLogger("compliance.access")
        access_logger.setLevel(log_level)
        access_logger.propagate = False
        access_destination = f"{destination}.access" if destination else None
        handler = _build_handler(access_destination)
        handler.setFormatter(logging.Formatter("%(asctime)s %(message)s"))
        _ensure_logger_handler(access_logger, handler)


class ComplianceAuditMiddleware(BaseHTTPMiddleware):
    """Emit structured audit/access records for each request."""

    def __init__(
        self,
        app,
        *,
        regimes: Sequence[str] | None = None,
        redact_headers: Iterable[str] | None = None,
        log_access: bool = False,
    ) -> None:
        super().__init__(app)
        self._regimes = sorted({r.lower() for r in (regimes or [])})
        self._redact_headers = {h.lower() for h in (redact_headers or DEFAULT_REDACT_HEADERS)}
        self._audit_logger = logging.getLogger("compliance.audit")
        self._access_logger = logging.getLogger("compliance.access") if log_access else None

    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        duration_ms = (time.perf_counter() - start) * 1000.0

        record: dict[str, object] = {
            "event": "request",
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": round(duration_ms, 2),
            "client_ip": request.client.host if request.client else None,
        }
        if self._regimes:
            record["regimes"] = self._regimes

        if self._audit_logger.isEnabledFor(logging.INFO):
            safe_headers = {
                k: v
                for k, v in request.headers.items()
                if k.lower() not in self._redact_headers
            }
            if safe_headers:
                record["headers"] = safe_headers
            self._audit_logger.info(json.dumps({k: v for k, v in record.items() if v}))

        if self._access_logger and self._access_logger.isEnabledFor(logging.INFO):
            regimes = ",".join(self._regimes) if self._regimes else "-"
            self._access_logger.info(
                "%s %s -> %s %.2fms regimes=%s",
                request.method,
                request.url.path,
                response.status_code,
                duration_ms,
                regimes,
            )

        return response
