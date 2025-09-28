"""Command line interface for the workflow optimization engine."""

from __future__ import annotations

from argparse import ArgumentParser
from pathlib import Path
import json
import sys

from .automation import WorkflowEngine


def _build_parser() -> ArgumentParser:
    parser = ArgumentParser(description="Workflow optimization automation CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    run_parser = subparsers.add_parser("run", help="Execute the workflow optimization pipeline")
    run_parser.add_argument("--config", required=True, help="Path to the workflow configuration JSON file")
    run_parser.add_argument(
        "--output-dir",
        help="Override the run output directory (defaults to the value from the configuration)",
    )
    run_parser.add_argument(
        "--json", action="store_true", help="Print the run summary as JSON instead of text"
    )

    return parser


def _handle_run(args: object) -> int:
    engine = WorkflowEngine.from_file(args.config)
    if args.output_dir:
        override = Path(args.output_dir).expanduser().resolve()
        engine.config.paths.run_root = override
        engine.config.paths.run_root.mkdir(parents=True, exist_ok=True)

    summary = engine.run()
    if args.json:
        payload = {
            "run_id": summary.run_id,
            "success": summary.success,
            "manifest": str(summary.manifest_path),
            "evidence": str(summary.evidence_manifest),
            "gates": [
                {"name": result.name, "status": result.status.value, "details": result.details}
                for result in summary.gate_results
            ],
        }
        print(json.dumps(payload, indent=2))
    else:
        status = "SUCCESS" if summary.success else "FAILED"
        print(f"Workflow run {summary.run_id} completed with status: {status}")
        print(f"Manifest: {summary.manifest_path}")
        print(f"Evidence: {summary.evidence_manifest}")
        for result in summary.gate_results:
            print(f" - {result.name}: {result.status.value}")
    return 0 if summary.success else 1


def main(argv: list[str] | None = None) -> int:
    parser = _build_parser()
    args = parser.parse_args(argv)

    if args.command == "run":
        return _handle_run(args)
    parser.print_help()
    return 1


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
