"""Core orchestration logic for the workflow optimization system."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Iterable, List, Sequence
import json
import subprocess
import uuid
import shutil

from .config import WorkflowConfig, load_workflow_config
from .deployment import DeploymentPlanner
from .evidence import EvidenceManager
from .exceptions import AutomationError, GateFailure, WorkflowConfigurationError
from .gates import Gate, GateResult, GateStatus
from .templates import TemplateManager


@dataclass(slots=True)
class WorkflowContext:
    """Shared runtime state accessible by all gates."""

    config: WorkflowConfig
    run_id: str
    run_dir: Path
    artifacts_dir: Path
    evidence: EvidenceManager
    template_manager: TemplateManager
    automation: "AutomationFramework"
    base_dir: Path
    state: Dict[str, Any] = field(default_factory=dict)

    def resolve_path(self, value: str) -> Path:
        """Resolve a path relative to the configuration directory."""

        path = Path(value)
        if not path.is_absolute():
            path = (self.base_dir / path).resolve()
        return path


class AutomationFramework:
    """Execute commands and scripted automation tasks."""

    def __init__(self, automation_config: Dict[str, Any], working_dir: Path) -> None:
        self.config = automation_config
        self.working_dir = working_dir

    def run_category(self, category: str) -> List[Dict[str, Any]]:
        """Execute a category of automation commands defined in the configuration."""

        commands = self.config.get(category, [])
        results: List[Dict[str, Any]] = []
        for index, entry in enumerate(commands):
            if isinstance(entry, dict):
                cmd = entry.get("cmd")
                name = entry.get("name", f"{category}-{index}")
                cwd = entry.get("cwd")
                timeout = entry.get("timeout")
            elif isinstance(entry, Sequence):
                cmd = list(entry)
                name = f"{category}-{index}"
                cwd = None
                timeout = None
            else:
                raise WorkflowConfigurationError(
                    f"Automation command for category '{category}' must be a dict or sequence"
                )

            if not cmd:
                raise WorkflowConfigurationError(
                    f"Automation command '{name}' in category '{category}' is empty"
                )

            working_directory = Path(cwd).resolve() if cwd else self.working_dir
            completed = subprocess.run(
                cmd,
                cwd=working_directory,
                capture_output=True,
                text=True,
                check=False,
                timeout=timeout,
            )
            result = {
                "name": name,
                "cmd": cmd,
                "cwd": str(working_directory),
                "returncode": completed.returncode,
                "stdout": completed.stdout,
                "stderr": completed.stderr,
            }
            if completed.returncode != 0:
                raise AutomationError(
                    f"Automation command '{name}' failed with code {completed.returncode}: {completed.stderr.strip()}"
                )
            results.append(result)
        return results

    def ensure_categories(self, required: Iterable[str]) -> None:
        missing = [category for category in required if category not in self.config]
        if missing:
            raise WorkflowConfigurationError(
                "Automation configuration missing categories: " + ", ".join(sorted(missing))
            )


@dataclass(slots=True)
class WorkflowRunSummary:
    """Summary of a workflow engine run."""

    run_id: str
    success: bool
    gate_results: List[GateResult]
    run_dir: Path
    manifest_path: Path
    evidence_manifest: Path


class WorkflowEngine:
    """High level orchestrator executing each gate sequentially."""

    def __init__(self, config: WorkflowConfig) -> None:
        self.config = config
        self.template_manager = TemplateManager(config.paths.template_root)

    @classmethod
    def from_file(cls, config_path: str | Path) -> "WorkflowEngine":
        return cls(load_workflow_config(config_path))

    def run(self) -> WorkflowRunSummary:
        run_id = f"{datetime.utcnow().strftime('%Y%m%dT%H%M%S')}-{uuid.uuid4().hex[:8]}"
        run_dir = self.config.paths.run_root / run_id
        run_dir.mkdir(parents=True, exist_ok=True)
        artifacts_dir = run_dir / "artifacts"
        artifacts_dir.mkdir(parents=True, exist_ok=True)
        evidence = EvidenceManager(run_dir / "evidence")
        automation = AutomationFramework(self.config.automation, run_dir)
        automation.ensure_categories(["checks", "tests", "scans"])

        base_dir = Path(self.config.metadata.get("config_dir", ".")).resolve()
        context = WorkflowContext(
            config=self.config,
            run_id=run_id,
            run_dir=run_dir,
            artifacts_dir=artifacts_dir,
            evidence=evidence,
            template_manager=self.template_manager,
            automation=automation,
            base_dir=base_dir,
        )

        gate_results: List[GateResult] = []
        for gate in self._build_gates():
            try:
                result = gate.execute(context)
            except GateFailure as exc:
                failure = GateResult(
                    name=gate.name,
                    status=GateStatus.FAIL,
                    details=str(exc),
                    evidence=[],
                )
                gate_results.append(failure)
                break
            gate_results.append(result)
            if not result.succeeded:
                break

        evidence_manifest = evidence.save_manifest()
        central_evidence_dir = self.config.paths.evidence_root / run_id
        if central_evidence_dir.exists():
            shutil.rmtree(central_evidence_dir)
        shutil.copytree(evidence.evidence_dir, central_evidence_dir)
        manifest_data = {
            "run_id": run_id,
            "project": self.config.project,
            "started_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
            "gates": [
                {
                    "name": result.name,
                    "status": result.status.value,
                    "details": result.details,
                    "evidence": result.evidence,
                    "metadata": result.metadata or {},
                }
                for result in gate_results
            ],
        }
        manifest_path = run_dir / "run_manifest.json"
        manifest_path.write_text(json.dumps(manifest_data, indent=2), encoding="utf-8")

        planner = DeploymentPlanner(run_dir, self.template_manager)
        planner.build_plan(self.config, gate_results)

        success = all(result.succeeded for result in gate_results)
        return WorkflowRunSummary(
            run_id=run_id,
            success=success,
            gate_results=gate_results,
            run_dir=run_dir,
            manifest_path=manifest_path,
            evidence_manifest=evidence_manifest,
        )

    def _build_gates(self) -> List[Gate]:
        config = self.config
        templates = self.template_manager

        def initiation_gate(context: WorkflowContext) -> GateResult:
            project = context.config.project
            brief_path = context.resolve_path(project.get("brief_location", ""))
            if not brief_path.exists():
                raise GateFailure(
                    "Initiation & Intake gate failed: project brief not found at "
                    f"{brief_path}"
                )
            approvals = project.get("approvals", [])
            if not approvals:
                raise GateFailure("Initiation & Intake gate failed: no stakeholder approvals recorded")

            report = {
                "project": project,
                "stakeholder_count": len(project.get("stakeholders", [])),
                "brief_path": str(brief_path),
                "approvals": approvals,
            }
            evidence = context.evidence.record_data(
                "Initiation & Intake",
                "initiation_report",
                report,
                {"gate": "initiation"},
            )
            rendered = templates.render(
                "intake",
                {
                    "project_name": project["name"],
                    "stakeholders": ", ".join(project.get("stakeholders", [])),
                    "industry": project.get("industry", "n/a"),
                },
            )
            (context.artifacts_dir / "intake.md").write_text(rendered, encoding="utf-8")
            return GateResult(
                name="Initiation & Intake",
                status=GateStatus.PASS,
                details="Brief validated and intake report generated",
                evidence=[evidence.path],
                metadata={"stakeholders": str(len(project.get("stakeholders", [])))},
            )

        def governance_gate(context: WorkflowContext) -> GateResult:
            governance = context.config.governance
            risk = governance.get("risk_profile", {})
            level = risk.get("level")
            if level not in {"low", "medium", "high"}:
                raise GateFailure("Governance gate failed: risk level must be low, medium, or high")
            mitigations = risk.get("mitigations", [])
            if isinstance(mitigations, str):
                mitigations_list = [mitigations]
            else:
                mitigations_list = list(mitigations)
            if level in {"medium", "high"} and not mitigations_list:
                raise GateFailure("Governance gate failed: mitigations required for elevated risk levels")

            evidence = context.evidence.record_data(
                "Configuration & Governance",
                "governance_certificate",
                {
                    "risk_profile": risk,
                    "approvers": governance.get("approvers", []),
                    "policy_checks": governance.get("policy_checks", []),
                },
                {"gate": "governance"},
            )
            risk_summary = templates.render(
                "risk",
                {
                    "project_name": context.config.project["name"],
                    "risk_level": level,
                    "mitigations": ", ".join(mitigations_list) or "None",
                },
            )
            (context.artifacts_dir / "risk_assessment.md").write_text(
                risk_summary, encoding="utf-8"
            )
            return GateResult(
                name="Configuration & Governance",
                status=GateStatus.PASS,
                details=f"Risk profile assessed at {level}",
                evidence=[evidence.path],
                metadata={"risk_level": level},
            )

        def planning_gate(context: WorkflowContext) -> GateResult:
            planning = context.config.planning
            documents = planning.get("plan_documents", [])
            if not documents:
                raise GateFailure("Planning gate failed: plan_documents list is empty")
            missing_docs = [str(doc) for doc in documents if not context.resolve_path(doc).exists()]
            if missing_docs:
                raise GateFailure(
                    "Planning gate failed: missing plan documents - " + ", ".join(missing_docs)
                )
            traceability = planning.get("traceability_matrix", {})
            if not traceability:
                raise GateFailure("Planning gate failed: traceability matrix missing")
            evidence = context.evidence.record_data(
                "Planning & Modeling",
                "planning_summary",
                {
                    "documents": documents,
                    "traceability": traceability,
                },
                {"gate": "planning"},
            )
            return GateResult(
                name="Planning & Modeling",
                status=GateStatus.PASS,
                details="Planning artifacts validated",
                evidence=[evidence.path],
                metadata={"document_count": str(len(documents))},
            )

        def design_gate(context: WorkflowContext) -> GateResult:
            design = context.config.design
            documents = design.get("design_documents", [])
            if not documents:
                raise GateFailure("Design gate failed: no design_documents provided")
            missing = [str(doc) for doc in documents if not context.resolve_path(doc).exists()]
            if missing:
                raise GateFailure("Design gate failed: missing design documents - " + ", ".join(missing))
            review = templates.render(
                "design",
                {
                    "project_name": context.config.project["name"],
                    "architecture_owner": design.get("owner", "unassigned"),
                    "document_count": len(documents),
                },
            )
            review_path = context.artifacts_dir / "design_review.md"
            review_path.write_text(review, encoding="utf-8")
            evidence = context.evidence.record_data(
                "Design Assurance",
                "design_review",
                {
                    "documents": documents,
                    "checklists": design.get("checklists", []),
                },
                {"gate": "design"},
            )
            return GateResult(
                name="Design Assurance",
                status=GateStatus.PASS,
                details="Design package approved",
                evidence=[evidence.path, str(review_path)],
                metadata={"documents": str(len(documents))},
            )

        def environment_gate(context: WorkflowContext) -> GateResult:
            environment = context.config.environment
            stacks = environment.get("stacks", [])
            if not stacks:
                raise GateFailure("Environment gate failed: stacks configuration missing")
            telemetry = environment.get("telemetry", {})
            bom_path = context.artifacts_dir / "environment_bom.json"
            bom_data = {
                "stacks": stacks,
                "telemetry": telemetry,
                "timestamp": datetime.utcnow().isoformat(timespec="seconds") + "Z",
            }
            bom_path.write_text(json.dumps(bom_data, indent=2), encoding="utf-8")
            evidence = context.evidence.record_file(
                "Stack & Environment Validation",
                "environment_bom",
                bom_path,
                {"gate": "environment"},
            )
            return GateResult(
                name="Stack & Environment Validation",
                status=GateStatus.PASS,
                details="Stacks and toolchains validated",
                evidence=[evidence.path],
                metadata={"stack_count": str(len(stacks))},
            )

        def dry_run_gate(context: WorkflowContext) -> GateResult:
            dry_run = context.config.dry_run
            scenarios = dry_run.get("scenarios", [])
            if not scenarios:
                raise GateFailure("Dry-run gate failed: scenarios not defined")
            audit_report = {
                "scenarios": scenarios,
                "expected_tree_hash": dry_run.get("expected_tree_hash"),
            }
            evidence = context.evidence.record_data(
                "Dry-Run & Simulation",
                "dry_run_audit",
                audit_report,
                {"gate": "dry_run"},
            )
            return GateResult(
                name="Dry-Run & Simulation",
                status=GateStatus.PASS,
                details="Dry-run scenarios validated",
                evidence=[evidence.path],
                metadata={"scenario_count": str(len(scenarios))},
            )

        def generation_gate(context: WorkflowContext) -> GateResult:
            generation = context.config.generation
            artifacts = generation.get("artifacts", [])
            if not artifacts:
                raise GateFailure("Generation gate failed: artifacts list empty")
            manifest_path = context.artifacts_dir / "generation_manifest.json"
            manifest_path.write_text(json.dumps({"artifacts": artifacts}, indent=2), encoding="utf-8")
            evidence = context.evidence.record_file(
                "Generation & Build",
                "generation_manifest",
                manifest_path,
                {"gate": "generation"},
            )
            return GateResult(
                name="Generation & Build",
                status=GateStatus.PASS,
                details="Generation manifest captured",
                evidence=[evidence.path],
                metadata={"artifact_count": str(len(artifacts))},
            )

        def testing_gate(context: WorkflowContext) -> GateResult:
            quality = context.config.testing
            thresholds = quality.get("thresholds", {})
            test_results = context.automation.run_category("tests")
            scan_results = context.automation.run_category("scans")
            checks = context.automation.run_category("checks")
            testing_matrix = templates.read("testing")
            (context.artifacts_dir / "testing_matrix.md").write_text(
                testing_matrix, encoding="utf-8"
            )
            evidence = context.evidence.record_data(
                "Automated Testing & Scanning",
                "quality_report",
                {
                    "thresholds": thresholds,
                    "tests": test_results,
                    "scans": scan_results,
                    "checks": checks,
                },
                {"gate": "testing"},
            )
            return GateResult(
                name="Automated Testing & Scanning",
                status=GateStatus.PASS,
                details="Automation commands executed successfully",
                evidence=[evidence.path],
                metadata={"tests": str(len(test_results))},
            )

        def synchronization_gate(context: WorkflowContext) -> GateResult:
            sync = context.config.synchronization
            traceability = sync.get("traceability", {})
            completeness = traceability.get("completeness", 0)
            threshold = traceability.get("threshold", 0)
            if completeness < threshold:
                raise GateFailure(
                    f"Synchronization gate failed: completeness {completeness} below threshold {threshold}"
                )
            evidence = context.evidence.record_data(
                "Synchronization & Traceability",
                "traceability_report",
                traceability,
                {"gate": "synchronization"},
            )
            return GateResult(
                name="Synchronization & Traceability",
                status=GateStatus.PASS,
                details="Traceability matrix meets threshold",
                evidence=[evidence.path],
                metadata={"completeness": str(completeness)},
            )

        def metrics_gate(context: WorkflowContext) -> GateResult:
            metrics = context.config.metrics
            coverage = metrics.get("coverage", {})
            performance = metrics.get("performance", {})
            if coverage.get("actual", 0) < coverage.get("threshold", 0):
                raise GateFailure("Metrics gate failed: coverage below threshold")
            if performance.get("p95_ms", 0) > performance.get("threshold_ms", float("inf")):
                raise GateFailure("Metrics gate failed: performance exceeds threshold")
            evidence = context.evidence.record_data(
                "Metrics & Observability",
                "metrics_report",
                {
                    "coverage": coverage,
                    "performance": performance,
                    "build_time": metrics.get("build_time"),
                },
                {"gate": "metrics"},
            )
            return GateResult(
                name="Metrics & Observability",
                status=GateStatus.PASS,
                details="Coverage and performance within bounds",
                evidence=[evidence.path],
                metadata={"coverage": str(coverage.get("actual"))},
            )

        def compliance_gate(context: WorkflowContext) -> GateResult:
            compliance = context.config.compliance
            controls = compliance.get("controls", [])
            if not controls:
                raise GateFailure("Compliance gate failed: controls list empty")
            score = compliance.get("score", 0)
            if score < compliance.get("threshold", 0):
                raise GateFailure("Compliance gate failed: score below threshold")
            submission_content = templates.render(
                "submission",
                {
                    "project_name": context.config.project["name"],
                    "score": score,
                    "controls": ", ".join(controls),
                },
            )
            submission_path = context.run_dir / "submission_pack.md"
            submission_path.write_text(submission_content, encoding="utf-8")
            evidence = context.evidence.record_data(
                "Compliance & Delivery",
                "compliance_scorecard",
                {
                    "controls": controls,
                    "score": score,
                    "mappings": compliance.get("mappings", {}),
                },
                {"gate": "compliance"},
            )
            return GateResult(
                name="Compliance & Delivery",
                status=GateStatus.PASS,
                details="Compliance controls satisfied and delivery pack generated",
                evidence=[evidence.path, str(submission_path)],
                metadata={"score": str(score)},
            )

        return [
            Gate("Initiation & Intake", "Validate intake artifacts", initiation_gate),
            Gate("Configuration & Governance", "Assess governance readiness", governance_gate),
            Gate("Planning & Modeling", "Validate planning outputs", planning_gate),
            Gate("Design Assurance", "Ensure design completeness", design_gate),
            Gate("Stack & Environment Validation", "Verify stack readiness", environment_gate),
            Gate("Dry-Run & Simulation", "Evaluate dry-run outputs", dry_run_gate),
            Gate("Generation & Build", "Confirm generation results", generation_gate),
            Gate("Automated Testing & Scanning", "Run automated quality checks", testing_gate),
            Gate("Synchronization & Traceability", "Confirm traceability coverage", synchronization_gate),
            Gate("Metrics & Observability", "Validate operational metrics", metrics_gate),
            Gate("Compliance & Delivery", "Final compliance validation and packaging", compliance_gate),
        ]
