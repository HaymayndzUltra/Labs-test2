"""Base helpers for gate implementations."""

from __future__ import annotations

import subprocess
import time
from pathlib import Path
from typing import Iterable, Sequence

from ..exceptions import GateExecutionError
from ..models import EvidenceRecord, GateContext


def run_command(context: GateContext, command: Sequence[str], *, timeout: int | None = None) -> EvidenceRecord:
    """Execute a shell command and capture its output as evidence."""

    start = time.monotonic()
    try:
        completed = subprocess.run(
            command,
            cwd=context.project_root,
            check=True,
            capture_output=True,
            text=True,
            timeout=timeout,
        )
    except subprocess.CalledProcessError as exc:
        raise GateExecutionError(
            f"Command {' '.join(command)} failed with exit code {exc.returncode}: {exc.stderr.strip()}"
        ) from exc
    except subprocess.TimeoutExpired as exc:
        raise GateExecutionError(f"Command {' '.join(command)} timed out after {timeout}s") from exc

    duration = time.monotonic() - start
    log_path = context.evidence_root / f"{'_'.join(command[:2])}_output.log"
    log_path.write_text(completed.stdout, encoding="utf-8")
    metadata = {
        "command": list(command),
        "duration_seconds": round(duration, 3),
        "return_code": completed.returncode,
    }
    return EvidenceRecord(
        gate="command",
        description=f"Executed command: {' '.join(command)}",
        artifact_path=log_path,
        metadata=metadata,
    )


def require_files_exist(context: GateContext, paths: Iterable[Path]) -> None:
    missing = [str(path) for path in paths if not path.exists()]
    if missing:
        raise GateExecutionError(f"Missing required files: {', '.join(missing)}")


def read_json(path: Path) -> dict:
    import json

    if not path.exists():
        raise GateExecutionError(f"JSON file not found: {path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise GateExecutionError(f"Invalid JSON in {path}: {exc}") from exc


def ensure_keys(data: dict, required_keys: Iterable[str], *, file_path: Path) -> None:
    missing = [key for key in required_keys if key not in data]
    if missing:
        raise GateExecutionError(f"Missing keys {missing} in {file_path}")
