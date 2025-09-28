"""Deployment helpers for promoting workflow automation into production."""
from __future__ import annotations

from pathlib import Path
from typing import Dict

from .config import WorkflowConfig, default_workflow_config

DEPLOY_SCRIPT = """#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${PROJECT_NAME:-}" ]]; then
  echo "PROJECT_NAME is required" >&2
  exit 1
fi

python -m workflow_runner --name "$PROJECT_NAME" --output "${OUTPUT_DIR:-dist}" --metadata "${METADATA_PATH:-}" "$@"
"""

CI_WORKFLOW = {
    "name": "Workflow Automation",
    "on": {
        "workflow_dispatch": {},
        "push": {"branches": ["main", "release/*"]},
    },
    "jobs": {
        "run": {
            "runs-on": "ubuntu-latest",
            "steps": [
                {"uses": "actions/checkout@v4"},
                {
                    "name": "Install dependencies",
                    "run": "pip install -r requirements.txt",
                },
                {
                    "name": "Execute workflow",
                    "run": "python scripts/run_workflow.py --name ${{ github.event.inputs.name || 'example' }}",
                },
            ],
        }
    },
}


def generate_deployment_scripts(output_dir: Path, config: WorkflowConfig | None = None) -> Dict[str, Path]:
    """Generate deployment artifacts (CLI + CI templates)."""

    output_dir.mkdir(parents=True, exist_ok=True)
    cfg = config or default_workflow_config()
    scripts: Dict[str, Path] = {}

    deploy_sh = output_dir / "deploy_workflow.sh"
    deploy_sh.write_text(DEPLOY_SCRIPT)
    deploy_sh.chmod(0o755)
    scripts["deploy_script"] = deploy_sh

    ci_yaml = output_dir / "ci-workflow.json"
    import json

    ci_yaml.write_text(json.dumps(CI_WORKFLOW, indent=2))
    scripts["ci_workflow"] = ci_yaml

    manifest = output_dir / "deployment_manifest.json"
    manifest.write_text(json.dumps({
        "config": cfg.to_dict(),
        "scripts": {key: str(path) for key, path in scripts.items()},
    }, indent=2))
    scripts["manifest"] = manifest
    return scripts
