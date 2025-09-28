"""Custom exceptions for the workflow optimizer."""

from __future__ import annotations


class WorkflowError(RuntimeError):
    """Base class for workflow related errors."""


class ConfigurationError(WorkflowError):
    """Raised when configuration files are invalid or incomplete."""


class GateExecutionError(WorkflowError):
    """Raised when a gate fails to execute successfully."""


class EvidenceError(WorkflowError):
    """Raised when evidence cannot be collected or persisted."""
