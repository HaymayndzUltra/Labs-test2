"""Data models representing workflow definitions and execution results."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional


@dataclass
class CheckDefinition:
    """Definition for a workflow check within a gate."""

    id: str
    type: str
    target: str
    description: str
    args: Dict[str, Any] = field(default_factory=dict)
    continue_on_error: bool = False


@dataclass
class GateDefinition:
    """Definition for a workflow gate."""

    id: str
    name: str
    description: str
    checks: List[CheckDefinition] = field(default_factory=list)
    evidence_templates: List[Dict[str, Any]] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowDefinition:
    """Representation of the entire workflow configuration."""

    name: str
    version: str
    description: str
    gates: List[GateDefinition] = field(default_factory=list)
    global_context: Dict[str, Any] = field(default_factory=dict)


@dataclass
class CheckResult:
    """Result of a check execution."""

    check: CheckDefinition
    status: str
    started_at: datetime
    completed_at: datetime
    details: Optional[str] = None
    evidence: List[Dict[str, Any]] = field(default_factory=list)


@dataclass
class GateResult:
    """Result of executing a gate."""

    gate: GateDefinition
    status: str
    started_at: datetime
    completed_at: datetime
    check_results: List[CheckResult] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowResult:
    """Summary of an executed workflow."""

    workflow: WorkflowDefinition
    status: str
    started_at: datetime
    completed_at: datetime
    gate_results: List[GateResult] = field(default_factory=list)


def build_check_definition(raw: Dict[str, Any]) -> CheckDefinition:
    """Create a :class:`CheckDefinition` from raw configuration."""

    return CheckDefinition(
        id=raw["id"],
        type=raw.get("type", "python"),
        target=raw["target"],
        description=raw.get("description", ""),
        args=raw.get("args", {}),
        continue_on_error=raw.get("continue_on_error", False),
    )


def build_gate_definition(raw: Dict[str, Any]) -> GateDefinition:
    """Create a :class:`GateDefinition` from raw configuration."""

    checks = [build_check_definition(item) for item in raw.get("checks", [])]
    return GateDefinition(
        id=raw["id"],
        name=raw.get("name", raw["id"].replace("_", " ").title()),
        description=raw.get("description", ""),
        checks=checks,
        evidence_templates=raw.get("evidence_templates", []),
        metadata=raw.get("metadata", {}),
    )


def build_workflow_definition(raw: Dict[str, Any]) -> WorkflowDefinition:
    """Create a :class:`WorkflowDefinition` from raw configuration."""

    gates = [build_gate_definition(item) for item in raw.get("gates", [])]
    return WorkflowDefinition(
        name=raw.get("name", "Unnamed Workflow"),
        version=raw.get("version", "0.0"),
        description=raw.get("description", ""),
        gates=gates,
        global_context=raw.get("global_context", {}),
    )
