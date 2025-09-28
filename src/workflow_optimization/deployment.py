"""Deployment planning utilities for workflow optimization runs."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List
import json

from .templates import TemplateManager


@dataclass(slots=True)
class DeploymentPlan:
    """Structured deployment plan."""

    path: Path
    narrative_path: Path
    data: Dict[str, Any]


class DeploymentPlanner:
    """Create deployment plans based on workflow run results."""

    def __init__(self, run_dir: Path, template_manager: TemplateManager) -> None:
        self.run_dir = run_dir
        self.template_manager = template_manager

    def build_plan(
        self,
        config: "WorkflowConfig",
        gate_results: Iterable["GateResult"],
    ) -> DeploymentPlan:
        from .gates import GateResult  # local import to avoid cycle
        from .config import WorkflowConfig

        gate_summary: List[Dict[str, Any]] = [
            {
                "name": result.name,
                "status": result.status.value,
                "details": result.details,
                "evidence": result.evidence,
                "metadata": result.metadata or {},
            }
            for result in gate_results
        ]

        delivery_cfg = config.delivery
        environments = delivery_cfg.get("environments", [])
        version = delivery_cfg.get("version", "0.0.1")

        plan_data: Dict[str, Any] = {
            "project": config.project,
            "version": version,
            "environments": environments,
            "post_deploy_checks": delivery_cfg.get("post_deploy_checks", []),
            "rollback": delivery_cfg.get("rollback", {}),
            "gates": gate_summary,
        }

        plan_path = self.run_dir / "deployment_plan.json"
        plan_path.write_text(json.dumps(plan_data, indent=2), encoding="utf-8")

        narrative_content = self.template_manager.render(
            "deployment",
            {
                "project_name": config.project["name"],
                "version": version,
                "environment_count": len(environments),
                "primary_environment": environments[0]["name"] if environments else "n/a",
            },
        )
        narrative_path = self.run_dir / "deployment_plan.md"
        narrative_path.write_text(narrative_content, encoding="utf-8")

        return DeploymentPlan(path=plan_path, narrative_path=narrative_path, data=plan_data)
