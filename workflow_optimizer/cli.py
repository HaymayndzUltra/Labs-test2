"""CLI entrypoint for the workflow optimizer."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from .config import dump_config_template, load_config
from .exceptions import ConfigurationError, GateExecutionError, WorkflowError
from .runner import WorkflowOrchestrator
from .templates import generate_default_templates


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Workflow optimization orchestrator")
    subparsers = parser.add_subparsers(dest="command", required=True)

    run_parser = subparsers.add_parser("run", help="Execute the workflow gates")
    run_parser.add_argument("--config", required=True, help="Path to workflow configuration (YAML/JSON)")
    run_parser.add_argument(
        "--no-halt",
        action="store_true",
        help="Continue executing gates after failures",
    )
    run_parser.add_argument(
        "--output",
        help="Optional path to write the gate results JSON report",
    )

    template_parser = subparsers.add_parser("init", help="Generate default templates")
    template_parser.add_argument("--output", required=True, help="Directory to write templates")
    template_parser.add_argument(
        "--config-path",
        help="Optional configuration template file path (defaults to workflow.yaml in output dir)",
    )

    return parser.parse_args()


def run_cli(argv: list[str] | None = None) -> int:
    args = _parse_args()
    if args.command == "run":
        try:
            config = load_config(args.config)
            orchestrator = WorkflowOrchestrator(config)
            results = orchestrator.run(halt_on_failure=not args.no_halt)
        except (ConfigurationError, WorkflowError) as exc:
            print(json.dumps({"status": "error", "message": str(exc)}))
            return 1
        payload: dict[str, Any] = {
            "status": "ok",
            "failed": orchestrator.any_failed(results),
            "results": [result.as_dict() for result in results],
            "evidence_manifest": str(orchestrator.evidence_collector.manifest_path()),
        }
        if args.output:
            Path(args.output).write_text(json.dumps(payload, indent=2), encoding="utf-8")
        print(json.dumps(payload, indent=2))
        return 0
    if args.command == "init":
        output_dir = Path(args.output)
        output_dir.mkdir(parents=True, exist_ok=True)
        generate_default_templates(output_dir)
        config_path = Path(args.config_path) if args.config_path else output_dir / "workflow.yaml"
        dump_config_template(config_path)
        print(json.dumps({"status": "ok", "templates": str(output_dir), "config": str(config_path)}))
        return 0
    raise RuntimeError("Unsupported command")


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(run_cli())
