"""Custom exceptions raised by workflow automation components."""
from __future__ import annotations


class WorkflowError(RuntimeError):
    """Base error for workflow orchestration issues."""


class GateFailedError(WorkflowError):
    """Raised when a gate fails its validation criteria."""


class GateExecutionError(WorkflowError):
    """Raised when an unexpected error occurs during gate execution."""


__all__ = ["WorkflowError", "GateFailedError", "GateExecutionError"]
