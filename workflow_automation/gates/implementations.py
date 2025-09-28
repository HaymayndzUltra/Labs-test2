"""Gate implementations for workflow automation."""
from __future__ import annotations

import json
import logging
import re
import shutil
import subprocess
from pathlib import Path
from typing import Any, Dict, Iterable, List, Set, Tuple

from ..context import WorkflowContext
from ..exceptions import GateFailedError
from .base import Gate, GateResult

LOGGER = logging.getLogger(__name__)


def _load_json(path: Path) -> Dict[str, Any]:
    if not path.exists():
        raise GateFailedError(f"Required file missing: {path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise GateFailedError(f"Failed to parse JSON from {path}: {exc}") from exc


class IntakeGate(Gate):
    """Validates project intake metadata and brief."""

    def execute(self, context: WorkflowContext) -> GateResult:
        metadata_rel = self.settings.get("metadata_file") or context.config.metadata_file or "metadata.json"
        brief_rel = self.settings.get("brief_file") or context.config.brief_file or "brief.md"
        required_fields: Iterable[str] = self.settings.get("required_fields", [])

        metadata_path = context.project_root / metadata_rel
        metadata = _load_json(metadata_path)

        missing = [field for field in required_fields if field not in metadata]
        if missing:
            raise GateFailedError(
                f"Metadata file {metadata_path} is missing required fields: {', '.join(missing)}"
            )

        context.metadata = metadata
        brief_path = context.project_root / brief_rel
        if not brief_path.exists():
            raise GateFailedError(f"Brief file not found: {brief_path}")
        context.brief = brief_path.read_text(encoding="utf-8")

        evidence_paths = [
            str(
                self.evidence_manager.write_json(
                    "intake/metadata_snapshot.json",
                    metadata,
                    category="intake",
                    description="Intake metadata snapshot",
                ).relative_to(self.evidence_manager.root)
            ),
            str(
                self.evidence_manager.write_text(
                    "intake/brief_excerpt.md",
                    context.brief[:1000],
                    category="intake",
                    description="Brief excerpt captured during intake gate",
                ).relative_to(self.evidence_manager.root)
            ),
        ]
        return GateResult(True, "Intake metadata validated", evidence_paths)


class EnvironmentGate(Gate):
    """Ensures required tools are available with acceptable versions."""

    def execute(self, context: WorkflowContext) -> GateResult:
        required_tools: Iterable[Dict[str, Any]] = self.settings.get("required_tools", [])
        missing_tools: List[str] = []
        tool_reports: List[Dict[str, Any]] = []

        def parse_version(raw: str) -> Tuple[int, ...]:
            try:
                return tuple(int(part) for part in raw.split("."))
            except ValueError:
                raise GateFailedError(f"Unable to parse semantic version '{raw}'")

        for tool in required_tools:
            name = tool.get("name")
            command = tool.get("command", name)
            min_version = tool.get("min_version")
            if not name or not command:
                raise GateFailedError("Each required tool must include a name and command")

            executable = shutil.which(command)
            if executable is None:
                missing_tools.append(name)
                tool_reports.append({"name": name, "status": "missing"})
                continue

            version_command = tool.get("version_command", f"{command} --version")
            try:
                completed = subprocess.run(
                    version_command.split(),
                    capture_output=True,
                    text=True,
                    check=False,
                )
                version_output = completed.stdout.strip() or completed.stderr.strip()
            except OSError as exc:
                raise GateFailedError(f"Unable to execute version command for {name}: {exc}") from exc

            status = "available"
            if min_version:
                version_match = re.search(r"(\d+\.\d+\.\d+)", version_output)
                if version_match:
                    detected_version = version_match.group(1)
                    if parse_version(detected_version) < parse_version(min_version):
                        status = "version_too_low"
                        missing_tools.append(f"{name} >= {min_version}")
                else:
                    status = "unknown_version"
            tool_reports.append(
                {
                    "name": name,
                    "command": command,
                    "status": status,
                    "output": version_output,
                }
            )

        if missing_tools:
            raise GateFailedError(
                "Environment checks failed for: " + ", ".join(sorted(missing_tools))
            )

        evidence_path = self.evidence_manager.write_json(
            "environment/tool_report.json",
            {"tools": tool_reports},
            category="environment",
            description="Tool availability report",
        )
        return GateResult(True, "Environment validation passed", [str(evidence_path.relative_to(self.evidence_manager.root))])


class PlanningGate(Gate):
    """Validates planning artifacts and ensures tasks cover required domains."""

    def execute(self, context: WorkflowContext) -> GateResult:
        plan_file = context.project_root / self.settings.get("plan_file", "PLAN.md")
        tasks_file = context.project_root / self.settings.get("tasks_file", "PLAN.tasks.json")
        required_topics: Iterable[str] = self.settings.get("required_topics", [])

        if not plan_file.exists():
            raise GateFailedError(f"Planning document missing: {plan_file}")

        tasks_data = _load_json(tasks_file)
        tasks = tasks_data.get("tasks")
        if not isinstance(tasks, list) or not tasks:
            raise GateFailedError("Task plan must include a non-empty 'tasks' array")

        coverage_topics: Set[str] = set()
        for task in tasks:
            if "id" not in task or "title" not in task:
                raise GateFailedError("Each task must include 'id' and 'title'")
            tags = task.get("tags", [])
            for tag in tags:
                if isinstance(tag, str):
                    coverage_topics.add(tag.lower())

        missing_topics = [topic for topic in required_topics if topic.lower() not in coverage_topics]
        if missing_topics:
            raise GateFailedError(
                "Planning artifacts missing coverage for topics: " + ", ".join(missing_topics)
            )

        evidence_paths = [
            str(
                self.evidence_manager.write_json(
                    "planning/tasks_snapshot.json",
                    tasks_data,
                    category="planning",
                    description="Task plan snapshot",
                ).relative_to(self.evidence_manager.root)
            ),
        ]
        return GateResult(True, "Planning artifacts validated", evidence_paths)


class TaskGraphGate(Gate):
    """Ensures the task graph is structurally valid."""

    def execute(self, context: WorkflowContext) -> GateResult:
        tasks_file = context.project_root / self.settings.get("tasks_file", "PLAN.tasks.json")
        tasks_data = _load_json(tasks_file)
        tasks = tasks_data.get("tasks", [])
        ids = [task.get("id") for task in tasks]
        if len(ids) != len(set(ids)):
            raise GateFailedError("Duplicate task IDs detected in task graph")

        dependency_map = {task["id"]: task.get("dependencies", []) for task in tasks}

        for task_id, deps in dependency_map.items():
            for dep in deps:
                if dep not in dependency_map:
                    raise GateFailedError(f"Task {task_id} references unknown dependency {dep}")

        visited: Set[str] = set()
        stack: Set[str] = set()

        def visit(node: str) -> None:
            if node in stack:
                raise GateFailedError("Cycle detected in task graph")
            if node in visited:
                return
            stack.add(node)
            for dep in dependency_map.get(node, []):
                visit(dep)
            stack.remove(node)
            visited.add(node)

        for node in dependency_map:
            visit(node)

        evidence_path = self.evidence_manager.write_json(
            "planning/task_graph_validation.json",
            {"validated_tasks": len(tasks)},
            category="planning",
            description="Task graph validation report",
        )
        return GateResult(True, "Task graph validated", [str(evidence_path.relative_to(self.evidence_manager.root))])


class PrdGate(Gate):
    """Validates PRD and architecture documentation."""

    def execute(self, context: WorkflowContext) -> GateResult:
        prd_file = context.project_root / self.settings.get("prd_file", "PRD.md")
        architecture_file = context.project_root / self.settings.get("architecture_file", "ARCHITECTURE.md")
        required_sections: Iterable[str] = self.settings.get(
            "required_sections", ["# Product Requirements", "# Architecture Overview"]
        )

        missing_files = [str(path) for path in (prd_file, architecture_file) if not path.exists()]
        if missing_files:
            raise GateFailedError("PRD gate missing files: " + ", ".join(missing_files))

        prd_content = prd_file.read_text(encoding="utf-8")
        architecture_content = architecture_file.read_text(encoding="utf-8")

        for section in required_sections:
            if section not in prd_content and section not in architecture_content:
                raise GateFailedError(f"Required section '{section}' not found in PRD or architecture docs")

        evidence_paths = [
            str(
                self.evidence_manager.write_text(
                    "prd/prd_hash.txt",
                    f"PRD checksum: {hash(prd_content)}\nARCH checksum: {hash(architecture_content)}\n",
                    category="documentation",
                    description="PRD and architecture verification hashes",
                ).relative_to(self.evidence_manager.root)
            )
        ]
        return GateResult(True, "PRD and architecture assets validated", evidence_paths)


class StackGate(Gate):
    """Verifies stack selection and compatibility details."""

    def execute(self, context: WorkflowContext) -> GateResult:
        stack_file = context.project_root / self.settings.get("stack_file", "stack_report.json")
        stack_data = _load_json(stack_file)
        required_keys: Iterable[str] = self.settings.get(
            "required_keys", ["frontend", "backend", "database"]
        )

        missing = [key for key in required_keys if key not in stack_data]
        if missing:
            raise GateFailedError("Stack report missing keys: " + ", ".join(missing))

        discrepancies = stack_data.get("discrepancies", [])
        if discrepancies:
            raise GateFailedError("Stack discrepancies unresolved: " + ", ".join(discrepancies))

        evidence_path = self.evidence_manager.write_json(
            "stack/stack_report.json",
            stack_data,
            category="stack",
            description="Stack selection validation",
        )
        return GateResult(True, "Stack selection validated", [str(evidence_path.relative_to(self.evidence_manager.root))])


class DryRunGate(Gate):
    """Validates dry-run scaffolding results."""

    def execute(self, context: WorkflowContext) -> GateResult:
        snapshot_file = context.project_root / self.settings.get("snapshot_file", "dryrun_snapshot.json")
        snapshot = _load_json(snapshot_file)
        status = snapshot.get("status")
        if status != "success":
            raise GateFailedError(f"Dry-run reported non-success status: {status}")

        expected_modules = set(self.settings.get("expected_modules", []))
        actual_modules = set(snapshot.get("modules", []))
        missing_modules = expected_modules - actual_modules
        if missing_modules:
            raise GateFailedError("Dry-run missing modules: " + ", ".join(sorted(missing_modules)))

        evidence_path = self.evidence_manager.write_json(
            "dryrun/snapshot.json",
            snapshot,
            category="generation",
            description="Dry-run snapshot",
        )
        return GateResult(True, "Dry-run snapshot validated", [str(evidence_path.relative_to(self.evidence_manager.root))])


class GenerationGate(Gate):
    """Validates generated file manifests."""

    def execute(self, context: WorkflowContext) -> GateResult:
        manifest_file = context.project_root / self.settings.get("manifest_file", "file_manifest.json")
        manifest = _load_json(manifest_file)
        files = manifest.get("files", [])
        if not files:
            raise GateFailedError("Generation manifest must include at least one file entry")

        duplicate_paths = set()
        seen_paths = set()
        for entry in files:
            path = entry.get("path")
            if not path:
                raise GateFailedError("File manifest entries must include a 'path'")
            if path in seen_paths:
                duplicate_paths.add(path)
            seen_paths.add(path)

        if duplicate_paths:
            raise GateFailedError("Duplicate files detected in manifest: " + ", ".join(sorted(duplicate_paths)))

        evidence_path = self.evidence_manager.write_json(
            "generation/file_manifest.json",
            manifest,
            category="generation",
            description="Generated file manifest",
        )
        return GateResult(True, "Generation manifest validated", [str(evidence_path.relative_to(self.evidence_manager.root))])


class TestingGate(Gate):
    """Validates automated test results."""

    def execute(self, context: WorkflowContext) -> GateResult:
        results_file = context.project_root / self.settings.get("results_file", "test_results.json")
        results = _load_json(results_file)
        status = results.get("status")
        if status != "passed":
            raise GateFailedError(f"Automated tests did not pass: {status}")

        coverage = float(results.get("coverage", 0))
        minimum_coverage = float(self.settings.get("minimum_coverage", 0))
        if coverage < minimum_coverage:
            raise GateFailedError(
                f"Coverage {coverage} below minimum threshold {minimum_coverage}"
            )

        evidence_path = self.evidence_manager.write_json(
            "testing/test_results.json",
            results,
            category="testing",
            description="Automated test results",
        )
        return GateResult(True, "Automated tests validated", [str(evidence_path.relative_to(self.evidence_manager.root))])


class MetricsGate(Gate):
    """Aggregates metrics, security scans, and ensures thresholds."""

    def execute(self, context: WorkflowContext) -> GateResult:
        metrics_file = context.project_root / self.settings.get("metrics_file", "metrics_report.json")
        metrics = _load_json(metrics_file)

        coverage_threshold = float(self.settings.get("minimum_coverage", 0))
        perf_threshold = float(self.settings.get("maximum_latency_ms", 0))
        max_vulnerabilities = int(self.settings.get("maximum_vulnerabilities", 0))

        coverage = float(metrics.get("coverage", 0))
        latency = float(metrics.get("p95_latency_ms", 0))
        vulnerabilities = int(metrics.get("critical_vulnerabilities", 0))

        if coverage < coverage_threshold:
            raise GateFailedError(
                f"Coverage metric {coverage} below required threshold {coverage_threshold}"
            )
        if perf_threshold and latency > perf_threshold:
            raise GateFailedError(
                f"Performance latency {latency} exceeds maximum allowed {perf_threshold}"
            )
        if vulnerabilities > max_vulnerabilities:
            raise GateFailedError(
                f"Detected {vulnerabilities} critical vulnerabilities (limit {max_vulnerabilities})"
            )

        evidence_path = self.evidence_manager.write_json(
            "metrics/metrics_report.json",
            metrics,
            category="metrics",
            description="Aggregated metrics report",
        )
        return GateResult(True, "Metrics thresholds satisfied", [str(evidence_path.relative_to(self.evidence_manager.root))])


class ComplianceGate(Gate):
    """Validates compliance attestations against requirements matrix."""

    def execute(self, context: WorkflowContext) -> GateResult:
        compliance_file = context.project_root / self.settings.get("compliance_file", "compliance_report.json")
        compliance = _load_json(compliance_file)
        requirements = self.settings.get("requirements", [])

        failures = []
        for requirement in requirements:
            req_id = requirement.get("id")
            if not req_id:
                raise GateFailedError("Compliance requirements must include an 'id'")
            status = compliance.get(req_id)
            if status not in {"approved", "waived"}:
                failures.append(req_id)

        if failures:
            raise GateFailedError(
                "Compliance requirements not satisfied: " + ", ".join(sorted(failures))
            )

        evidence_path = self.evidence_manager.write_json(
            "compliance/compliance_report.json",
            compliance,
            category="compliance",
            description="Compliance attestation snapshot",
        )
        return GateResult(True, "Compliance requirements satisfied", [str(evidence_path.relative_to(self.evidence_manager.root))])


class SubmissionGate(Gate):
    """Ensures submission pack is ready for delivery."""

    def execute(self, context: WorkflowContext) -> GateResult:
        checklist_file = context.project_root / self.settings.get("checklist_file", "submission_index.md")
        dist_dir = context.project_root / self.settings.get("dist_dir", "dist")

        if not checklist_file.exists():
            raise GateFailedError(f"Submission checklist missing: {checklist_file}")
        if not dist_dir.exists():
            raise GateFailedError(f"Distribution directory missing: {dist_dir}")

        artifacts = list(dist_dir.glob("**/*"))
        files = [str(path.relative_to(dist_dir)) for path in artifacts if path.is_file()]
        if not files:
            raise GateFailedError("Submission package contains no files")

        evidence_paths = [
            str(
                self.evidence_manager.write_json(
                    "submission/dist_manifest.json",
                    {"files": files},
                    category="submission",
                    description="Submission package manifest",
                ).relative_to(self.evidence_manager.root)
            ),
            str(
                self.evidence_manager.write_text(
                    "submission/checklist.md",
                    checklist_file.read_text(encoding="utf-8"),
                    category="submission",
                    description="Submission readiness checklist",
                ).relative_to(self.evidence_manager.root)
            ),
        ]
        return GateResult(True, "Submission package validated", evidence_paths)


__all__ = [
    "IntakeGate",
    "EnvironmentGate",
    "PlanningGate",
    "TaskGraphGate",
    "PrdGate",
    "StackGate",
    "DryRunGate",
    "GenerationGate",
    "TestingGate",
    "MetricsGate",
    "ComplianceGate",
    "SubmissionGate",
]
