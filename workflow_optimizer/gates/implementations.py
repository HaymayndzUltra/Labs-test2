"""Concrete gate implementations."""

from __future__ import annotations

import json
import shutil
from pathlib import Path
from typing import List

from ..exceptions import GateExecutionError
from ..models import EvidenceRecord, GateContext
from .base import ensure_keys, read_json, require_files_exist, run_command


def _write_summary(path: Path, data: dict) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return path


def metadata_gate(context: GateContext) -> EvidenceRecord:
    require_files_exist(context, [context.config["metadata_file"]])
    metadata = read_json(context.config["metadata_file"])
    ensure_keys(metadata, ["name", "industry", "project_type"], file_path=context.config["metadata_file"])
    summary_path = _write_summary(
        context.evidence_root / "metadata_gate.json",
        {
            "detected_name": metadata.get("name"),
            "industry": metadata.get("industry"),
            "project_type": metadata.get("project_type"),
        },
    )
    return EvidenceRecord(
        gate="metadata",
        description="Validated metadata completeness",
        artifact_path=summary_path,
        metadata={"fields": sorted(metadata.keys())},
    )


def environment_gate(context: GateContext) -> EvidenceRecord:
    required = context.config.get("environment", {}).get("required_binaries", [])
    missing: List[str] = []
    binaries: List[dict] = []
    for binary in required:
        path = shutil.which(binary)
        if path:
            binaries.append({"binary": binary, "path": path})
        else:
            missing.append(binary)
    if missing:
        raise GateExecutionError(f"Missing required binaries: {', '.join(missing)}")
    summary_path = _write_summary(
        context.evidence_root / "environment_gate.json",
        {"binaries": binaries},
    )
    return EvidenceRecord(
        gate="environment",
        description="Verified required tooling is available",
        artifact_path=summary_path,
        metadata={"count": len(binaries)},
    )


def planning_gate(context: GateContext) -> EvidenceRecord:
    plan_file = context.config["plan_file"]
    require_files_exist(context, [plan_file])
    content = plan_file.read_text(encoding="utf-8")
    if "#" not in content:
        raise GateExecutionError("PLAN.md appears to be empty or missing headings")
    summary_path = _write_summary(
        context.evidence_root / "planning_gate.json",
        {"characters": len(content)},
    )
    return EvidenceRecord(
        gate="planning",
        description="Validated plan artifact",
        artifact_path=summary_path,
        metadata={"length": len(content)},
    )


def task_graph_gate(context: GateContext) -> EvidenceRecord:
    tasks = read_json(context.config["tasks_file"])
    entries = tasks.get("tasks") if isinstance(tasks, dict) else None
    if not entries or not isinstance(entries, list):
        raise GateExecutionError("PLAN.tasks.json must contain a list of tasks under `tasks`")
    ids = {task.get("id") for task in entries if isinstance(task, dict)}
    if None in ids:
        raise GateExecutionError("All tasks require an `id`")
    if len(ids) != len(entries):
        raise GateExecutionError("Duplicate task ids detected")
    summary_path = _write_summary(
        context.evidence_root / "task_graph_gate.json",
        {"task_count": len(entries)},
    )
    return EvidenceRecord(
        gate="task_graph",
        description="Validated task graph structure",
        artifact_path=summary_path,
        metadata={"task_count": len(entries)},
    )


def prd_gate(context: GateContext) -> List[EvidenceRecord]:
    prd_file = context.config["prd_file"]
    architecture = context.config["architecture_file"]
    require_files_exist(context, [prd_file, architecture])
    prd_content = prd_file.read_text(encoding="utf-8")
    arch_content = architecture.read_text(encoding="utf-8")
    if "#" not in prd_content or "#" not in arch_content:
        raise GateExecutionError("PRD or ARCHITECTURE documents appear incomplete")
    prd_summary = _write_summary(
        context.evidence_root / "prd_gate.json",
        {"prd_characters": len(prd_content), "architecture_characters": len(arch_content)},
    )
    return [
        EvidenceRecord(
            gate="prd",
            description="Validated PRD and architecture assets",
            artifact_path=prd_summary,
            metadata={"prd_sections": prd_content.count("# "), "architecture_sections": arch_content.count("# ")},
        )
    ]


def stack_gate(context: GateContext) -> EvidenceRecord:
    stack_data = read_json(context.config["stack_report"])
    ensure_keys(stack_data, ["frontend", "backend"], file_path=context.config["stack_report"])
    summary_path = _write_summary(context.evidence_root / "stack_gate.json", stack_data)
    return EvidenceRecord(
        gate="stack",
        description="Validated stack selection",
        artifact_path=summary_path,
        metadata={"frontend": stack_data["frontend"], "backend": stack_data["backend"]},
    )


def dry_run_gate(context: GateContext) -> EvidenceRecord:
    snapshot = read_json(context.config["dry_run_snapshot"])
    files = snapshot.get("files", [])
    if not files:
        raise GateExecutionError("Dry run snapshot missing file list")
    summary_path = _write_summary(
        context.evidence_root / "dry_run_gate.json",
        {"file_count": len(files)},
    )
    return EvidenceRecord(
        gate="dry_run",
        description="Validated dry run output",
        artifact_path=summary_path,
        metadata={"file_count": len(files)},
    )


def generation_gate(context: GateContext) -> EvidenceRecord:
    manifest = read_json(context.config["generation_manifest"])
    generated = manifest.get("generated_files", [])
    if not generated:
        raise GateExecutionError("Generation manifest missing `generated_files`")
    summary_path = _write_summary(
        context.evidence_root / "generation_gate.json",
        {"generated_file_count": len(generated)},
    )
    return EvidenceRecord(
        gate="generation",
        description="Validated generation manifest",
        artifact_path=summary_path,
        metadata={"generated_file_count": len(generated)},
    )


def testing_gate(context: GateContext) -> EvidenceRecord:
    overrides = context.config.get("gate_overrides", {})
    command = overrides.get("test_command")
    if command:
        evidence = run_command(context, command)
        evidence.gate = "testing"  # type: ignore[attr-defined]
        return evidence
    report = read_json(context.config["test_report"])
    status = report.get("status")
    if status != "passed":
        raise GateExecutionError("Test report does not indicate success")
    summary_path = _write_summary(
        context.evidence_root / "testing_gate.json",
        {"status": status, "tests": report.get("tests", {})},
    )
    return EvidenceRecord(
        gate="testing",
        description="Validated automated tests",
        artifact_path=summary_path,
        metadata={"status": status},
    )


def metrics_gate(context: GateContext) -> EvidenceRecord:
    metrics = read_json(context.config["metrics_manifest"])
    overrides = context.config.get("gate_overrides", {})
    coverage_threshold = overrides.get("coverage_threshold", 0.8)
    perf_threshold = overrides.get("p95_threshold_ms", 300)
    max_vulnerabilities = overrides.get("max_high_vulnerabilities", 0)

    coverage = metrics.get("coverage", {}).get("line", 0)
    perf = metrics.get("performance", {}).get("p95_ms", float("inf"))
    vulnerabilities = metrics.get("security", {}).get("high", 0)

    if coverage < coverage_threshold:
        raise GateExecutionError(f"Coverage {coverage} below threshold {coverage_threshold}")
    if perf > perf_threshold:
        raise GateExecutionError(f"Performance P95 {perf}ms exceeds threshold {perf_threshold}ms")
    if vulnerabilities > max_vulnerabilities:
        raise GateExecutionError(
            f"High vulnerabilities {vulnerabilities} exceed maximum {max_vulnerabilities}"
        )

    summary_path = _write_summary(
        context.evidence_root / "metrics_gate.json",
        {
            "coverage": coverage,
            "p95_ms": perf,
            "high_vulnerabilities": vulnerabilities,
        },
    )
    return EvidenceRecord(
        gate="metrics",
        description="Validated metrics and security thresholds",
        artifact_path=summary_path,
        metadata={
            "coverage_threshold": coverage_threshold,
            "p95_threshold_ms": perf_threshold,
            "max_high_vulnerabilities": max_vulnerabilities,
        },
    )


def compliance_gate(context: GateContext) -> EvidenceRecord:
    compliance = read_json(context.config["compliance_manifest"])
    controls = compliance.get("controls", [])
    if not controls:
        raise GateExecutionError("Compliance manifest missing controls")
    failing = [ctrl for ctrl in controls if ctrl.get("status") not in {"passed", "approved"}]
    if failing:
        raise GateExecutionError(f"Compliance controls failing: {[c.get('id') for c in failing]}")
    submission_manifest = read_json(context.config["submission_manifest"])
    ensure_keys(submission_manifest, ["artifacts"], file_path=context.config["submission_manifest"])
    summary_path = _write_summary(
        context.evidence_root / "compliance_gate.json",
        {
            "controls": [ctrl.get("id") for ctrl in controls],
            "submission_artifacts": submission_manifest.get("artifacts", []),
        },
    )
    return EvidenceRecord(
        gate="compliance",
        description="Validated compliance controls and submission pack",
        artifact_path=summary_path,
        metadata={"artifact_count": len(submission_manifest.get("artifacts", []))},
    )
