"""Configuration helpers for the workflow optimizer."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Optional

import yaml

from .exceptions import ConfigurationError


@dataclass(slots=True)
class WorkflowConfig:
    """Runtime configuration for the workflow orchestrator."""

    project_root: Path
    evidence_root: Path
    metadata_file: Path
    plan_file: Path
    tasks_file: Path
    prd_file: Path
    architecture_file: Path
    stack_report: Path
    dry_run_snapshot: Path
    generation_manifest: Path
    test_report: Path
    metrics_manifest: Path
    compliance_manifest: Path
    submission_manifest: Path
    gate_overrides: Dict[str, Any] = field(default_factory=dict)
    environment: Dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: Dict[str, Any], base_path: Path | None = None) -> "WorkflowConfig":
        if base_path is None:
            base_path = Path.cwd()
        try:
            root = base_path.joinpath(data["project_root"]).resolve()
        except KeyError as exc:
            raise ConfigurationError("`project_root` missing from workflow configuration") from exc
        evidence_root = cls._resolve_path(base_path, data, "evidence_root", default=root / "evidence")
        return cls(
            project_root=root,
            evidence_root=evidence_root,
            metadata_file=cls._resolve_path(base_path, data, "metadata_file", root / "metadata.json"),
            plan_file=cls._resolve_path(base_path, data, "plan_file", root / "PLAN.md"),
            tasks_file=cls._resolve_path(base_path, data, "tasks_file", root / "PLAN.tasks.json"),
            prd_file=cls._resolve_path(base_path, data, "prd_file", root / "PRD.md"),
            architecture_file=cls._resolve_path(base_path, data, "architecture_file", root / "ARCHITECTURE.md"),
            stack_report=cls._resolve_path(base_path, data, "stack_report", root / "stack_report.json"),
            dry_run_snapshot=cls._resolve_path(base_path, data, "dry_run_snapshot", root / "dry_run_snapshot.json"),
            generation_manifest=cls._resolve_path(base_path, data, "generation_manifest", root / "generation_manifest.json"),
            test_report=cls._resolve_path(base_path, data, "test_report", root / "tests/report.json"),
            metrics_manifest=cls._resolve_path(base_path, data, "metrics_manifest", root / "metrics/metrics.json"),
            compliance_manifest=cls._resolve_path(
                base_path, data, "compliance_manifest", root / "compliance/compliance.json"
            ),
            submission_manifest=cls._resolve_path(
                base_path, data, "submission_manifest", root / "dist/submission_index.json"
            ),
            gate_overrides=data.get("gate_overrides", {}),
            environment=data.get("environment", {}),
        )

    @staticmethod
    def _resolve_path(base: Path, data: Dict[str, Any], key: str, default: Path) -> Path:
        value = data.get(key)
        if value is None:
            return default
        candidate = base.joinpath(value).resolve()
        return candidate

    def ensure_directories(self) -> None:
        self.project_root.mkdir(parents=True, exist_ok=True)
        self.evidence_root.mkdir(parents=True, exist_ok=True)


def load_config(path: str | Path, overrides: Optional[Dict[str, Any]] = None) -> WorkflowConfig:
    """Load a workflow configuration from YAML or JSON."""

    config_path = Path(path).expanduser().resolve()
    if not config_path.exists():
        raise ConfigurationError(f"Configuration file not found: {config_path}")

    raw: Dict[str, Any]
    if config_path.suffix in {".yaml", ".yml"}:
        with config_path.open("r", encoding="utf-8") as fh:
            raw = yaml.safe_load(fh) or {}
    else:
        with config_path.open("r", encoding="utf-8") as fh:
            raw = json.load(fh)

    if overrides:
        raw.update(overrides)

    cfg = WorkflowConfig.from_dict(raw, base_path=config_path.parent)
    cfg.ensure_directories()
    return cfg


def dump_config_template(path: Path, *, project_root: str = "./_project") -> None:
    """Write a default configuration template to ``path``."""

    template = {
        "project_root": project_root,
        "evidence_root": "./_project/evidence",
        "metadata_file": "./_project/docs/metadata.json",
        "plan_file": "./_project/PLAN.md",
        "tasks_file": "./_project/PLAN.tasks.json",
        "prd_file": "./_project/PRD.md",
        "architecture_file": "./_project/ARCHITECTURE.md",
        "stack_report": "./_project/evidence/stack_report.json",
        "dry_run_snapshot": "./_project/evidence/dry_run_snapshot.json",
        "generation_manifest": "./_project/evidence/generation_manifest.json",
        "test_report": "./_project/tests/report.json",
        "metrics_manifest": "./_project/metrics/metrics.json",
        "compliance_manifest": "./_project/compliance/compliance.json",
        "submission_manifest": "./_project/dist/submission_index.json",
        "environment": {
            "required_binaries": ["python3", "git"],
        },
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.suffix in {".yaml", ".yml"}:
        with path.open("w", encoding="utf-8") as fh:
            yaml.safe_dump(template, fh, sort_keys=False)
    else:
        with path.open("w", encoding="utf-8") as fh:
            json.dump(template, fh, indent=2)
