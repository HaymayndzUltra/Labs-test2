"""Gate execution primitives for the workflow optimization system."""
from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

from .config import CheckSpec, GateDefinition, GateSeverity
from .evidence import EvidenceStore


class GateStatus(str, Enum):
    """High level status values for gate evaluations."""

    PASSED = "passed"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass(slots=True)
class CheckResult:
    """Outcome of executing a single check."""

    name: str
    success: bool
    details: str
    evidence_path: Optional[Path] = None
    metadata: Dict[str, Any] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "success": self.success,
            "details": self.details,
            "evidence_path": str(self.evidence_path) if self.evidence_path else None,
            "metadata": self.metadata or {},
        }


@dataclass(slots=True)
class GateResult:
    """Aggregate result for a gate."""

    gate: GateDefinition
    status: GateStatus
    check_results: List[CheckResult]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "gate": self.gate.key,
            "status": self.status.value,
            "checks": [result.to_dict() for result in self.check_results],
            "severity": self.gate.severity.value,
        }


class GateExecutionError(RuntimeError):
    """Raised when a gate cannot be executed."""


class CheckExecutor:
    """Factory class responsible for running checks based on :class:`CheckSpec`."""

    def __init__(self, evidence: EvidenceStore) -> None:
        self._evidence = evidence

    def run(self, gate: GateDefinition, check: CheckSpec, base_dir: Path) -> CheckResult:
        if check.type == "command":
            return self._run_command(gate, check, base_dir)
        if check.type == "file_exists":
            return self._check_file_exists(gate, check, base_dir)
        if check.type == "json_keys":
            return self._check_json_keys(gate, check, base_dir)
        raise GateExecutionError(f"Unsupported check type: {check.type}")

    def _run_command(self, gate: GateDefinition, check: CheckSpec, base_dir: Path) -> CheckResult:
        if not check.command:
            raise GateExecutionError(f"Gate {gate.key} / check {check.name} missing command definition")
        try:
            completed = subprocess.run(
                check.command,
                cwd=base_dir,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
            )
            output = completed.stdout.strip()
            evidence_path = self._evidence.record_text(gate.key, check.name, output)
            return CheckResult(
                name=check.name,
                success=True,
                details=output or "Command executed successfully.",
                evidence_path=evidence_path,
                metadata=check.metadata,
            )
        except subprocess.CalledProcessError as exc:  # pragma: no cover - runtime failure path
            output = (exc.stdout or "").strip()
            evidence_path = self._evidence.record_text(
                gate.key,
                f"{check.name}_failure",
                output or str(exc),
            )
            return CheckResult(
                name=check.name,
                success=False,
                details=output or str(exc),
                evidence_path=evidence_path,
                metadata=check.metadata,
            )

    def _check_file_exists(self, gate: GateDefinition, check: CheckSpec, base_dir: Path) -> CheckResult:
        if not check.path:
            raise GateExecutionError(f"Gate {gate.key} / check {check.name} missing path definition")
        target = base_dir / check.path
        exists = target.exists()
        details = f"File {target} {'exists' if exists else 'is missing'}"
        metadata = {"path": str(target)} | (check.metadata or {})
        if exists:
            evidence_path = self._evidence.record_text(gate.key, check.name, details)
            return CheckResult(
                name=check.name,
                success=True,
                details=details,
                evidence_path=evidence_path,
                metadata=metadata,
            )
        evidence_path = self._evidence.record_text(gate.key, f"{check.name}_missing", details)
        return CheckResult(
            name=check.name,
            success=False,
            details=details,
            evidence_path=evidence_path,
            metadata=metadata,
        )

    def _check_json_keys(self, gate: GateDefinition, check: CheckSpec, base_dir: Path) -> CheckResult:
        if not check.path:
            raise GateExecutionError(f"Gate {gate.key} / check {check.name} missing path definition")
        target = base_dir / check.path
        missing: List[str] = []
        data: Dict[str, Any] = {}
        if target.exists():
            data = json.loads(target.read_text())
            for key in check.required_keys or []:
                if not _has_key(data, key):
                    missing.append(key)
        else:
            missing.extend(check.required_keys or [])
        if missing:
            details = f"Missing keys: {', '.join(missing)}"
            evidence_path = self._evidence.record_text(gate.key, f"{check.name}_missing", details)
            return CheckResult(
                name=check.name,
                success=False,
                details=details,
                evidence_path=evidence_path,
                metadata=check.metadata,
            )
        evidence_path = self._evidence.record_json(gate.key, check.name, data)
        return CheckResult(
            name=check.name,
            success=True,
            details="All keys present",
            evidence_path=evidence_path,
            metadata=check.metadata,
        )


def _has_key(data: Dict[str, Any], key: str) -> bool:
    """Return True if the dot-separated key exists within data."""

    current: Any = data
    for segment in key.split('.'):
        if isinstance(current, dict) and segment in current:
            current = current[segment]
        else:
            return False
    if current is None:
        return False
    if isinstance(current, str) and not current.strip():
        return False
    return True


def evaluate_gate(
    gate: GateDefinition,
    base_dir: Path,
    evidence: EvidenceStore,
) -> GateResult:
    """Execute all checks for a gate and return the aggregated result."""

    executor = CheckExecutor(evidence)
    check_results: List[CheckResult] = []
    for check in gate.checks:
        result = executor.run(gate, check, base_dir)
        check_results.append(result)
    failures = [result for result in check_results if not result.success]
    status = GateStatus.PASSED if not failures else GateStatus.FAILED
    return GateResult(gate=gate, status=status, check_results=check_results)


def summarize_results(results: Iterable[GateResult]) -> Dict[str, Any]:
    """Produce a machine-readable summary of gate outcomes."""

    return {
        "gates": [result.to_dict() for result in results],
        "summary": {
            "passed": sum(1 for result in results if result.status is GateStatus.PASSED),
            "failed": sum(1 for result in results if result.status is GateStatus.FAILED),
        },
    }
