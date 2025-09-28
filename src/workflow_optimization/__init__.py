"""Workflow optimization system package."""

from .automation import WorkflowEngine, WorkflowRunSummary
from .config import WorkflowConfig, load_workflow_config
from .evidence import EvidenceManager, EvidenceRecord
from .gates import Gate, GateResult, GateStatus

__all__ = [
    "WorkflowEngine",
    "WorkflowRunSummary",
    "WorkflowConfig",
    "load_workflow_config",
    "EvidenceManager",
    "EvidenceRecord",
    "Gate",
    "GateResult",
    "GateStatus",
]

__version__ = "1.0.0"
