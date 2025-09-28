"""Workflow runner coordinating gate execution."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Iterable, List, Optional

from .config import GateConfig, WorkflowConfig
from .evidence import EvidenceCollector
from .gates import GateExecutionError, run_gate

LOGGER = logging.getLogger(__name__)


class WorkflowRunner:
    """Executes workflow gates sequentially."""

    def __init__(
        self,
        config: WorkflowConfig,
        *,
        manifest_filename: str = "evidence_manifest.json",
        dry_run: bool = False,
    ) -> None:
        self.config = config
        self.dry_run = dry_run
        manifest_path = self.config.project_dir / self.config.evidence_root / manifest_filename
        self.collector = EvidenceCollector(
            project_name=self.config.project_name,
            manifest_path=manifest_path,
            context={
                "industry": self.config.industry,
                "project_type": self.config.project_type,
                "frontend": self.config.frontend,
                "backend": self.config.backend,
                "database": self.config.database,
            },
        )

    def run(self, gates: Optional[Iterable[GateConfig]] = None) -> List[str]:
        self.config.ensure_directories()
        processed: List[str] = []
        for gate in gates or self.config.gates:
            LOGGER.info("Starting gate %s", gate.identifier)
            try:
                run_gate(gate, self.config, self.collector, dry_run=self.dry_run)
            except GateExecutionError:
                LOGGER.exception("Gate %s failed", gate.identifier)
                self.collector.finalize()
                raise
            processed.append(gate.identifier)
        self.collector.finalize()
        LOGGER.info("Workflow completed successfully")
        return processed


def configure_logging(verbose: bool = False) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(level=level, format="[%(levelname)s] %(name)s: %(message)s")


def run_from_files(
    root: Path,
    *,
    config_file: Optional[Path] = None,
    workflow_file: Optional[Path] = None,
    dry_run: bool = False,
    verbose: bool = False,
) -> List[str]:
    from .config import WorkflowConfig

    configure_logging(verbose)
    config = WorkflowConfig.load(root, config_file=config_file, workflow_file=workflow_file)
    runner = WorkflowRunner(config, dry_run=dry_run)
    return runner.run()

