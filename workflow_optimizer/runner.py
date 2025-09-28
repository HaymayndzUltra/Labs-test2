"""Gate orchestration for the workflow optimizer."""

from __future__ import annotations

import json
import time
from typing import Iterable, List

from .config import WorkflowConfig
from .evidence import EvidenceCollector
from .exceptions import GateExecutionError
from .models import EvidenceRecord, GateContext, GateDefinition, GateResult, GateStatus
from .gates import implementations as impl


class WorkflowOrchestrator:
    """Executes workflow gates sequentially and collects evidence."""

    def __init__(self, config: WorkflowConfig, *, gates: Iterable[GateDefinition] | None = None) -> None:
        self.config = config
        self.evidence_collector = EvidenceCollector(config.evidence_root)
        self.gates: List[GateDefinition] = list(gates) if gates else self._default_gates()

    def _default_gates(self) -> List[GateDefinition]:
        return [
            GateDefinition("metadata", "Validate intake metadata", impl.metadata_gate, tags=["intake"]),
            GateDefinition("environment", "Verify environment readiness", impl.environment_gate, tags=["intake"]),
            GateDefinition("planning", "Validate plan artifacts", impl.planning_gate, tags=["planning"]),
            GateDefinition("task_graph", "Validate task graph integrity", impl.task_graph_gate, tags=["planning"]),
            GateDefinition("prd", "Validate PRD and architecture", impl.prd_gate, tags=["design"]),
            GateDefinition("stack", "Verify stack selection", impl.stack_gate, tags=["design"]),
            GateDefinition("dry_run", "Check dry run output", impl.dry_run_gate, tags=["generation"]),
            GateDefinition("generation", "Validate generation manifest", impl.generation_gate, tags=["generation"]),
            GateDefinition("testing", "Confirm automated tests pass", impl.testing_gate, tags=["quality"]),
            GateDefinition("metrics", "Validate metrics & security thresholds", impl.metrics_gate, tags=["quality"]),
            GateDefinition("compliance", "Verify compliance and submission", impl.compliance_gate, tags=["compliance"]),
        ]

    def _build_context(self) -> GateContext:
        config_map = {
            "metadata_file": self.config.metadata_file,
            "plan_file": self.config.plan_file,
            "tasks_file": self.config.tasks_file,
            "prd_file": self.config.prd_file,
            "architecture_file": self.config.architecture_file,
            "stack_report": self.config.stack_report,
            "dry_run_snapshot": self.config.dry_run_snapshot,
            "generation_manifest": self.config.generation_manifest,
            "test_report": self.config.test_report,
            "metrics_manifest": self.config.metrics_manifest,
            "compliance_manifest": self.config.compliance_manifest,
            "submission_manifest": self.config.submission_manifest,
            "gate_overrides": self.config.gate_overrides,
            "environment": self.config.environment,
        }
        return GateContext(
            project_root=self.config.project_root,
            evidence_root=self.config.evidence_root,
            config=config_map,
        )

    def run(self, *, halt_on_failure: bool = True) -> List[GateResult]:
        context = self._build_context()
        results: List[GateResult] = []
        for definition in self.gates:
            start = time.monotonic()
            try:
                result = self._run_gate(definition, context)
            except GateExecutionError as exc:
                duration = time.monotonic() - start
                gate_result = GateResult(
                    definition=definition,
                    status=GateStatus.FAILED,
                    message=str(exc),
                    duration_seconds=duration,
                )
                results.append(gate_result)
                if halt_on_failure:
                    break
                else:
                    continue
            else:
                duration = time.monotonic() - start
                result.duration_seconds = duration
                results.append(result)
        self._write_gate_report(results)
        return results

    def _run_gate(self, definition: GateDefinition, context: GateContext) -> GateResult:
        outcome = definition.action(context)
        evidence_records: List[EvidenceRecord] = []
        if isinstance(outcome, EvidenceRecord):
            evidence_records = [outcome]
        elif outcome is None:
            evidence_records = []
        else:
            evidence_records = list(outcome)
        if evidence_records:
            for record in evidence_records:
                record.gate = definition.name
            self.evidence_collector.extend(evidence_records)
        return GateResult(
            definition=definition,
            status=GateStatus.PASSED,
            message="Gate passed",
            evidence=evidence_records,
        )

    def _write_gate_report(self, results: List[GateResult]) -> None:
        report_path = self.config.evidence_root / "gates_report.json"
        data = {
            "project_root": str(self.config.project_root),
            "results": [result.as_dict() for result in results],
        }
        report_path.write_text(json.dumps(data, indent=2), encoding="utf-8")

    def any_failed(self, results: Iterable[GateResult]) -> bool:
        return any(result.status is GateStatus.FAILED for result in results)
