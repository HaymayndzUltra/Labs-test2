"""High level automation framework wiring the workflow optimization system."""
from __future__ import annotations


from .config import WorkflowConfig, default_workflow_config
from .evidence import EvidenceStore
from .orchestrator import WorkflowEngine

from .models import AutomationReport, RunContext


class WorkflowAutomationError(RuntimeError):
    """Raised when the automation framework cannot complete the workflow."""


class AutomationFramework:
    """Facade orchestrating gate execution and evidence collection."""

    def __init__(self, config: WorkflowConfig | None = None) -> None:
        self.config = config or default_workflow_config()

    def prepare_environment(self, context: RunContext) -> EvidenceStore:
        context.output_dir.mkdir(parents=True, exist_ok=True)
        evidence_dir = self.config.evidence_root
        if not evidence_dir.is_absolute():
            evidence_dir = context.output_dir / evidence_dir
        evidence = EvidenceStore(evidence_dir)
        return evidence

    def execute(self, context: RunContext) -> AutomationReport:
        # Delegate the heavy lifting to the production workflow engine.
        engine = WorkflowEngine(self.config)
        result = engine.run(context)
        return result.report

