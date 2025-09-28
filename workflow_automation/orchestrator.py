"""Workflow orchestrator coordinating gate execution."""
from __future__ import annotations

import importlib
import logging
from pathlib import Path
from typing import List

from .config import WorkflowConfig
from .context import WorkflowContext
from .evidence import EvidenceManager
from .exceptions import GateFailedError, WorkflowError
from .gates.base import Gate

LOGGER = logging.getLogger(__name__)


def _load_class(path: str):
    module_name, _, class_name = path.rpartition(".")
    if not module_name:
        raise WorkflowError(f"Invalid implementation path '{path}'")
    module = importlib.import_module(module_name)
    try:
        return getattr(module, class_name)
    except AttributeError as exc:
        raise WorkflowError(f"Module '{module_name}' does not define '{class_name}'") from exc


class WorkflowOrchestrator:
    """Coordinates gate execution and evidence capture."""

    def __init__(self, config: WorkflowConfig, *, project_root: Path) -> None:
        self.config = config
        self.project_root = Path(project_root)
        self.evidence_manager = EvidenceManager(self.project_root / self.config.evidence_root)
        self.context = WorkflowContext(
            project_root=self.project_root,
            config=config,
            evidence_root=self.evidence_manager.root,
        )

    def _initialize_gates(self) -> List[Gate]:
        gates: List[Gate] = []
        for gate_config in self.config.gates:
            if not gate_config.enabled:
                LOGGER.info("Skipping disabled gate %s", gate_config.name)
                continue
            implementation_cls = _load_class(gate_config.implementation)
            gate: Gate = implementation_cls(
                name=gate_config.name,
                settings=gate_config.settings,
                evidence_manager=self.evidence_manager,
            )
            gates.append(gate)
        return gates

    def run(self) -> None:
        gates = self._initialize_gates()
        failures = []
        for gate in gates:
            try:
                gate.run(self.context)
            except GateFailedError as exc:
                LOGGER.error("Gate %s failed: %s", gate.name, exc)
                failures.append((gate.name, str(exc)))
                break

        # Persist gate report regardless of success/failure
        gates_report = [outcome.to_dict() for outcome in self.context.outcomes]
        self.evidence_manager.write_json(
            "gates/gates_report.json",
            {"results": gates_report},
            category="gates",
            description="Gate execution report",
        )
        self.evidence_manager.finalize()

        if failures:
            failed_gate, reason = failures[0]
            raise GateFailedError(f"Workflow halted at gate '{failed_gate}': {reason}")

        LOGGER.info("Workflow completed successfully")


__all__ = ["WorkflowOrchestrator"]
