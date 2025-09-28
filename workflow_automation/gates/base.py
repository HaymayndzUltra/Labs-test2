"""Base gate infrastructure."""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict, List
import logging

from ..context import GateOutcome, WorkflowContext
from ..evidence import EvidenceManager
from ..exceptions import GateExecutionError, GateFailedError

LOGGER = logging.getLogger(__name__)


@dataclass
class GateResult:
    """Result object returned by gate execution."""

    passed: bool
    details: str
    evidence: List[str]


class Gate(ABC):
    """Abstract base class for all workflow gates."""

    def __init__(
        self,
        *,
        name: str,
        settings: Dict[str, Any],
        evidence_manager: EvidenceManager,
    ) -> None:
        self.name = name
        self.settings = settings
        self.evidence_manager = evidence_manager

    @abstractmethod
    def execute(self, context: WorkflowContext) -> GateResult:
        """Execute gate logic returning a result."""

    def run(self, context: WorkflowContext) -> GateOutcome:
        LOGGER.info("Running gate %s", self.name)
        try:
            result = self.execute(context)
        except GateFailedError as exc:
            outcome = GateOutcome(
                name=self.name,
                status="failed",
                details=str(exc),
                evidence=[],
            )
            context.add_outcome(outcome)
            raise
        except Exception as exc:  # pragma: no cover - defensive programming
            LOGGER.exception("Unexpected error executing gate %s", self.name)
            raise GateExecutionError(f"Gate {self.name} encountered an unexpected error: {exc}") from exc

        status = "passed" if result.passed else "failed"
        outcome = GateOutcome(
            name=self.name,
            status=status,
            details=result.details,
            evidence=result.evidence,
        )
        context.add_outcome(outcome)
        if not result.passed:
            raise GateFailedError(result.details)
        return outcome


__all__ = ["Gate", "GateResult"]
