"""Workflow runner implementation."""

from __future__ import annotations

from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional

import yaml

from .checks import execute_check
from .evidence import EvidenceCollector
from .exceptions import CheckExecutionError, WorkflowConfigError
from .models import (
    GateDefinition,
    GateResult,
    WorkflowDefinition,
    WorkflowResult,
    build_workflow_definition,
)


def load_workflow_definition(path: Path | str) -> WorkflowDefinition:
    """Load a workflow definition from a YAML file."""

    config_path = Path(path)
    if not config_path.exists():
        raise WorkflowConfigError(f"Workflow definition not found: {config_path}")

    try:
        raw = yaml.safe_load(config_path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:  # pragma: no cover - config syntax errors
        raise WorkflowConfigError(f"Failed to parse workflow definition: {exc}") from exc

    if not isinstance(raw, dict):
        raise WorkflowConfigError("Workflow definition must be a mapping")

    return build_workflow_definition(raw)


class WorkflowRunner:
    """Executes workflow gates defined in a configuration file."""

    def __init__(
        self,
        definition: WorkflowDefinition,
        *,
        manifest_path: Optional[Path] = None,
    ) -> None:
        self.definition = definition
        self.manifest_path = manifest_path

    def run(
        self,
        *,
        context: Dict[str, Any],
        stop_on_failure: bool = True,
    ) -> WorkflowResult:
        """Execute the workflow and return a :class:`WorkflowResult`."""

        combined_context: Dict[str, Any] = deepcopy(self.definition.global_context)
        combined_context.update(context)

        project_dir = Path(combined_context.setdefault("project_dir", "./project"))
        evidence_dir = Path(
            combined_context.setdefault("evidence_dir", project_dir / "evidence")
        )
        combined_context.setdefault("project_name", self.definition.name)

        collector = EvidenceCollector(Path(evidence_dir))
        manifest_path = self.manifest_path or (Path(evidence_dir) / "manifest.json")

        workflow_started = datetime.utcnow()
        workflow_result = WorkflowResult(
            workflow=self.definition,
            status="running",
            started_at=workflow_started,
            completed_at=workflow_started,
            gate_results=[],
        )

        for gate in self.definition.gates:
            gate_result = self._execute_gate(
                gate=gate,
                context=combined_context,
                collector=collector,
                stop_on_failure=stop_on_failure,
            )
            workflow_result.gate_results.append(gate_result)
            if gate_result.status == "fail" and stop_on_failure:
                workflow_result.status = "fail"
                workflow_result.completed_at = datetime.utcnow()
                collector.write_manifest(manifest_path)
                return workflow_result

        workflow_result.status = "pass"
        workflow_result.completed_at = datetime.utcnow()
        collector.write_manifest(manifest_path)
        return workflow_result

    def _execute_gate(
        self,
        *,
        gate: GateDefinition,
        context: Dict[str, Any],
        collector: EvidenceCollector,
        stop_on_failure: bool,
    ) -> GateResult:
        """Run all checks within a gate."""

        started_at = datetime.utcnow()
        gate_result = GateResult(
            gate=gate,
            status="running",
            started_at=started_at,
            completed_at=started_at,
            check_results=[],
            metadata=gate.metadata,
        )

        gate_context = deepcopy(context)
        gate_context.update(gate.metadata or {})

        for check in gate.checks:
            try:
                check_result = execute_check(check, gate_context, collector)
            except CheckExecutionError as exc:
                check_result = self._handle_check_failure(
                    gate=gate,
                    check_id=check.id,
                    message=str(exc),
                )
                gate_result.check_results.append(check_result)
                gate_result.status = "fail"
                gate_result.completed_at = datetime.utcnow()
                if not check.continue_on_error and stop_on_failure:
                    return gate_result
                continue
            gate_result.check_results.append(check_result)
            if check_result.status != "pass":
                gate_result.status = "fail"
                if not check.continue_on_error and stop_on_failure:
                    gate_result.completed_at = datetime.utcnow()
                    return gate_result

        if gate_result.status != "fail":
            gate_result.status = "pass"
        gate_result.completed_at = datetime.utcnow()
        return gate_result

    def _handle_check_failure(
        self,
        *,
        gate: GateDefinition,
        check_id: str,
        message: str,
    ) -> "CheckResult":
        """Generate a failing :class:`CheckResult` for an exception."""

        raise_time = datetime.utcnow()
        from .models import CheckDefinition, CheckResult

        check_definition = CheckDefinition(
            id=check_id,
            type="python",
            target="",
            description="",
        )
        return CheckResult(
            check=check_definition,
            status="fail",
            started_at=raise_time,
            completed_at=raise_time,
            details=message,
        )
