#!/usr/bin/env python3
"""Command line entrypoint for executing the automated workflow gates."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict

from workflow.runner import WorkflowRunner, configure_logging
from workflow.config import WorkflowConfig


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Execute the workflow optimization pipeline")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="Repository root containing workflow files")
    parser.add_argument("--config", type=Path, default=None, help="Path to workflow.config.json override")
    parser.add_argument("--workflow", type=Path, default=None, help="Path to workflow.json definition override")
    parser.add_argument("--dry-run", action="store_true", help="Simulate execution without running commands")
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging output")
    parser.add_argument("--print-summary", action="store_true", help="Print JSON summary of executed gates")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    configure_logging(verbose=args.verbose)
    config = WorkflowConfig.load(args.root, config_file=args.config, workflow_file=args.workflow)
    runner = WorkflowRunner(config, dry_run=args.dry_run)
    executed = runner.run()
    if args.print_summary:
        summary: Dict[str, Any] = {
            "project": config.project_name,
            "gates": executed,
            "dry_run": args.dry_run,
            "evidence_manifest": str(config.project_dir / config.evidence_root / "evidence_manifest.json"),
        }
        print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
