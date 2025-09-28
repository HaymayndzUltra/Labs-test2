"""Programmatic helpers for executing the workflow orchestrator."""

from __future__ import annotations

from typing import Iterable, List

from .config import load_config
from .models import GateDefinition, GateResult
from .runner import WorkflowOrchestrator


def execute_workflow(config_path: str, *, gates: Iterable[GateDefinition] | None = None) -> List[GateResult]:
    """Execute the workflow from a configuration path."""

    config = load_config(config_path)
    orchestrator = WorkflowOrchestrator(config, gates=gates)
    return orchestrator.run()
