"""Gate definitions for the workflow optimization system."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Callable, Dict, List, Optional

from .exceptions import GateFailure


class GateStatus(str, Enum):
    """Possible statuses for a gate evaluation."""

    PASS = "pass"
    FAIL = "fail"
    SKIPPED = "skipped"


@dataclass(slots=True)
class GateResult:
    """Result produced by a gate evaluation."""

    name: str
    status: GateStatus
    details: str
    evidence: List[str]
    metadata: Optional[Dict[str, str]] = None

    @property
    def succeeded(self) -> bool:
        return self.status == GateStatus.PASS


GateHandler = Callable[["WorkflowContext"], GateResult]


class Gate:
    """Executable gate with a name and handler."""

    def __init__(self, name: str, description: str, handler: GateHandler) -> None:
        self.name = name
        self.description = description
        self._handler = handler

    def execute(self, context: "WorkflowContext") -> GateResult:
        """Execute the gate handler and normalise the result."""

        try:
            result = self._handler(context)
        except GateFailure:
            raise
        except Exception as exc:  # pragma: no cover - defensive; tested via failure paths
            raise GateFailure(f"Gate '{self.name}' raised an unexpected error: {exc}") from exc

        if not isinstance(result, GateResult):
            raise GateFailure(
                f"Gate '{self.name}' did not return a GateResult instance; received {type(result)!r}"
            )
        return result


# Forward declaration for type checking
class WorkflowContext:  # pragma: no cover - runtime type only
    ...
