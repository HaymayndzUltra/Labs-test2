"""Custom exceptions for the workflow optimization system."""

from __future__ import annotations


class WorkflowConfigError(Exception):
    """Raised when the workflow configuration cannot be loaded or parsed."""


class GateExecutionError(Exception):
    """Raised when an unrecoverable error occurs while executing a gate."""


class CheckExecutionError(Exception):
    """Raised when a check fails or cannot be executed."""


class EvidenceError(Exception):
    """Raised when evidence artifacts cannot be collected or recorded."""
