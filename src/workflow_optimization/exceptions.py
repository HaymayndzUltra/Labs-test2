"""Custom exception types for the workflow optimization system."""

from __future__ import annotations


class WorkflowConfigurationError(ValueError):
    """Raised when a workflow configuration file is invalid."""


class GateFailure(RuntimeError):
    """Raised when a gate fails during execution."""


class AutomationError(RuntimeError):
    """Raised when an automation command fails to execute successfully."""
