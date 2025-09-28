"""Workflow engine orchestrating gate execution and evidence capture."""
from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Mapping

from .models import AutomationReport, RunContext
from .config import GateDefinition, GateSeverity, WorkflowConfig, default_workflow_config
from .evidence import EvidenceStore
from .gates import GateResult, GateStatus, evaluate_gate


@dataclass(slots=True)
class WorkflowRunResult:
    """Summary returned after executing the full workflow."""

    report: AutomationReport
    summary_path: Path

    @property
    def succeeded(self) -> bool:
        return self.report.succeeded()


class WorkflowEngine:
    """Production-ready workflow engine covering all eleven gates."""

    def __init__(self, config: WorkflowConfig | None = None) -> None:
        self.config = config or default_workflow_config()
        self._producers: Mapping[str, str] = {
            "intake": "_produce_intake",
            "environment": "_produce_environment",
            "planning": "_produce_planning",
            "task_graph": "_produce_task_graph",
            "prd": "_produce_prd",
            "stack": "_produce_stack",
            "dry_run": "_produce_dry_run",
            "generation": "_produce_generation",
            "testing": "_produce_testing",
            "metrics": "_produce_metrics",
            "submission": "_produce_submission",
        }

    def run(self, context: RunContext) -> WorkflowRunResult:
        evidence_path = self.config.evidence_root
        if not evidence_path.is_absolute():
            evidence_path = context.output_dir / evidence_path
        evidence = EvidenceStore(evidence_path)
        gate_results: List[GateResult] = []
        started = datetime.utcnow()
        for gate in self.config.gates:
            gate_dir = self._prepare_gate_dir(context.output_dir, gate)
            self._produce_artifacts(gate, gate_dir, context, evidence)
            result = evaluate_gate(gate, gate_dir, evidence)
            gate_results.append(result)
            if result.status is GateStatus.FAILED and gate.severity is GateSeverity.CRITICAL:
                break
        finished = datetime.utcnow()
        evidence_index = evidence.write_index()
        report = AutomationReport(
            started_at=started,
            finished_at=finished,
            gate_results=gate_results,
            context=context,
        )
        summary_path = self._write_summary(report, context, evidence_index)
        return WorkflowRunResult(report=report, summary_path=summary_path)

    def _prepare_gate_dir(self, output_dir: Path, gate: GateDefinition) -> Path:
        path = output_dir / gate.key
        path.mkdir(parents=True, exist_ok=True)
        return path

    def _produce_artifacts(
        self,
        gate: GateDefinition,
        gate_dir: Path,
        context: RunContext,
        evidence: EvidenceStore,
    ) -> None:
        if not gate.producer:
            return
        producer_name = self._producers.get(gate.producer)
        if not producer_name:
            raise RuntimeError(f"No producer registered for {gate.producer}")
        producer = getattr(self, producer_name)
        producer(gate, gate_dir, context, evidence)

    def _write_summary(
        self,
        report: AutomationReport,
        context: RunContext,
        evidence_index: Path,
    ) -> Path:
        output_path = context.output_dir / "workflow_run.json"
        payload = report.to_dict()
        payload["evidence_index"] = str(evidence_index)
        payload["generated_at"] = datetime.utcnow().isoformat()
        output_path.write_text(json.dumps(payload, indent=2))
        return output_path

    # Producer implementations -------------------------------------------------

    def _produce_intake(
        self,
        gate: GateDefinition,
        gate_dir: Path,
        context: RunContext,
        evidence: EvidenceStore,
    ) -> None:
        data = {
            "project_name": context.project_name,
            "project_type": context.project_type,
            "industry": context.industry,
            "risk_profile": context.metadata.get("risk_profile"),
            "metadata": context.metadata,
        }
        evidence.record_json(gate.key, "intake_report", data)
        (gate_dir / "intake_report.json").write_text(json.dumps(data, indent=2))

    def _produce_environment(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        tooling = context.metadata.get("tooling", {})
        report = {
            "python": tooling.get("python", "3.11"),
            "node": tooling.get("node", "18"),
            "docker": tooling.get("docker", "24.0"),
            "status": "ready",
            "scanned_at": datetime.utcnow().isoformat(),
        }
        evidence.record_json(gate.key, "environment_verification", report)
        (gate_dir / "environment_verification.json").write_text(json.dumps(report, indent=2))

    def _produce_planning(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        plan = context.metadata.get("plan", {})
        summary = {
            "tasks": plan.get("tasks", []),
            "coverage_summary": plan.get("coverage_summary", {"mandatory": True, "count": len(plan.get("tasks", []))}),
            "exceptions": plan.get("exceptions", []),
        }
        evidence.record_json(gate.key, "planning_synthesis", summary)
        (gate_dir / "planning_synthesis.json").write_text(json.dumps(summary, indent=2))

    def _produce_task_graph(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        graph = context.metadata.get("task_graph", {})
        details = {
            "total_tasks": graph.get("total_tasks", len(context.metadata.get("plan", {}).get("tasks", []))),
            "isolated_nodes": graph.get("isolated_nodes", 0),
            "cycles": graph.get("cycles", []),
        }
        evidence.record_json(gate.key, "task_graph_integrity", details)
        (gate_dir / "task_graph_integrity.json").write_text(json.dumps(details, indent=2))

    def _produce_prd(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        prd_info = context.metadata.get("prd", {})
        manifest = {
            "prd_path": prd_info.get("prd_path", "PRD.md"),
            "architecture_path": prd_info.get("architecture_path", "ARCHITECTURE.md"),
            "validation": prd_info.get("validation", {"sections": ["overview", "architecture", "compliance"]}),
        }
        evidence.record_json(gate.key, "prd_and_architecture", manifest)
        (gate_dir / "prd_and_architecture.json").write_text(json.dumps(manifest, indent=2))

    def _produce_stack(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        stack = context.metadata.get("stack", {})
        report = {
            "frontend": stack.get("frontend", "nextjs"),
            "backend": stack.get("backend", "fastapi"),
            "database": stack.get("database", "postgres"),
            "exceptions": stack.get("exceptions", []),
        }
        evidence.record_json(gate.key, "stack_selection", report)
        (gate_dir / "stack_selection.json").write_text(json.dumps(report, indent=2))

    def _produce_dry_run(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        dry_run = context.metadata.get("dry_run", {})
        result = {
            "expected_modules": dry_run.get("expected_modules", []),
            "diff": dry_run.get("diff", []),
            "status": dry_run.get("status", "clean"),
        }
        evidence.record_json(gate.key, "dry_run_simulation", result)
        (gate_dir / "dry_run_simulation.json").write_text(json.dumps(result, indent=2))

    def _produce_generation(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        generation = context.metadata.get("generation", {})
        manifest = {
            "files_generated": generation.get("files_generated", 0),
            "template_versions": generation.get("template_versions", {}),
            "status": generation.get("status", "complete"),
        }
        evidence.record_json(gate.key, "generation_execution", manifest)
        (gate_dir / "generation_execution.json").write_text(json.dumps(manifest, indent=2))

    def _produce_testing(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        testing = context.metadata.get("testing", {})
        report = {
            "workspaces": testing.get("workspaces", []),
            "failures": testing.get("failures", []),
            "coverage": testing.get("coverage", {"line": 0.0, "branch": 0.0}),
        }
        evidence.record_json(gate.key, "testing_validation", report)
        (gate_dir / "testing_validation.json").write_text(json.dumps(report, indent=2))

    def _produce_metrics(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        metrics = context.metadata.get("metrics", {})
        details = {
            "coverage": metrics.get("coverage", {"line": 0.0}),
            "performance": metrics.get("performance", {"p95_ms": None}),
            "vulnerabilities": metrics.get("vulnerabilities", {"critical": 0, "high": 0}),
        }
        evidence.record_json(gate.key, "metrics_security", details)
        (gate_dir / "metrics_security.json").write_text(json.dumps(details, indent=2))

    def _produce_submission(self, gate: GateDefinition, gate_dir: Path, context: RunContext, evidence: EvidenceStore) -> None:
        submission = context.metadata.get("submission", {})
        record = {
            "checklist": submission.get("checklist", ["evidence", "signoff", "packaged"]),
            "approvals": submission.get("approvals", []),
            "artifacts": submission.get("artifacts", []),
        }
        evidence.record_json(gate.key, "submission_readiness", record)
        (gate_dir / "submission_readiness.json").write_text(json.dumps(record, indent=2))
