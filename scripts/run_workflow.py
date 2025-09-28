"""CLI entrypoint to execute the workflow optimization engine."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from workflow_optimization import (
    RunContext,
    WorkflowConfig,
    WorkflowEngine,
    default_workflow_config,
)
from workflow_optimization.config import load_workflow_config


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Execute the workflow optimization pipeline")
    parser.add_argument("--name", required=True, help="Project name")
    parser.add_argument("--project-type", default="fullstack", help="Project type descriptor")
    parser.add_argument("--industry", default="general", help="Industry vertical")
    parser.add_argument("--output", default="./workflow-output", help="Directory for generated artifacts")
    parser.add_argument("--config", help="Path to workflow configuration JSON/YAML")
    parser.add_argument("--metadata", help="Path to metadata JSON file")
    parser.add_argument("--metadata-json", help="Inline metadata JSON string")
    return parser.parse_args()


def _load_metadata(args: argparse.Namespace) -> Dict[str, Any]:
    payload: Dict[str, Any] = {}
    if args.metadata:
        path = Path(args.metadata)
        if not path.exists():
            raise FileNotFoundError(f"Metadata file not found: {path}")
        payload.update(json.loads(path.read_text()))
    if args.metadata_json:
        payload.update(json.loads(args.metadata_json))
    return payload


def main() -> int:
    args = _parse_args()
    try:
        metadata = _load_metadata(args)
    except Exception as exc:  # pragma: no cover - defensive logging
        print(f"[ERROR] Unable to load metadata: {exc}", file=sys.stderr)
        return 2

    output_dir = Path(args.output).resolve()
    config: WorkflowConfig
    if args.config:
        config = load_workflow_config(Path(args.config))
    else:
        config = default_workflow_config(output_dir)

    context = RunContext(
        project_name=args.name,
        project_type=args.project_type,
        industry=args.industry,
        output_dir=output_dir,
        metadata=metadata,
    )

    engine = WorkflowEngine(config)
    result = engine.run(context)
    report = result.report

    print("[WORKFLOW] Execution complete")
    print(f"  Success: {report.succeeded()}")
    print(f"  Summary: {result.summary_path}")
    for gate in report.gate_results:
        print(f"  - {gate.gate.key}: {gate.status.value}")
    return 0 if report.succeeded() else 1


if __name__ == "__main__":  # pragma: no cover - CLI
    raise SystemExit(main())
