"""Command line entry points for the workflow optimization system."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any, Dict

from .runner import WorkflowRunner, load_workflow_definition


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Workflow optimization runner")
    parser.add_argument(
        "config",
        type=Path,
        help="Path to the workflow YAML definition.",
    )
    parser.add_argument(
        "--context",
        type=Path,
        default=None,
        help="Optional JSON file providing runtime context overrides.",
    )
    parser.add_argument(
        "--project-dir",
        type=Path,
        default=None,
        help="Override the project directory.",
    )
    parser.add_argument(
        "--evidence-dir",
        type=Path,
        default=None,
        help="Override the evidence directory.",
    )
    parser.add_argument(
        "--manifest",
        type=Path,
        default=None,
        help="Destination for the evidence manifest file.",
    )
    parser.add_argument(
        "--stop-on-failure",
        action="store_true",
        help="Stop execution when a gate fails.",
    )
    return parser


def run_cli(argv: Any = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    definition = load_workflow_definition(args.config)
    runner = WorkflowRunner(definition, manifest_path=args.manifest)

    runtime_context: Dict[str, Any] = {}
    if args.context:
        runtime_context.update(json.loads(args.context.read_text(encoding="utf-8")))
    if args.project_dir:
        runtime_context["project_dir"] = str(args.project_dir)
    if args.evidence_dir:
        runtime_context["evidence_dir"] = str(args.evidence_dir)

    result = runner.run(context=runtime_context, stop_on_failure=args.stop_on_failure)
    return 0 if result.status == "pass" else 1


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(run_cli())
