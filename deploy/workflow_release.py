#!/usr/bin/env python3
"""Package workflow optimization outputs for deployment."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Package workflow optimization run artifacts")
    parser.add_argument("--run-dir", required=True, help="Path to a workflow run directory")
    parser.add_argument(
        "--output",
        help="Optional destination zip path. Defaults to <run_id>_deployment.zip inside the run directory.",
    )
    return parser


def create_package(run_dir: Path, output: Path | None = None) -> Path:
    run_dir = run_dir.resolve()
    manifest_path = run_dir / "run_manifest.json"
    if not manifest_path.exists():
        raise FileNotFoundError(f"Run manifest not found in {run_dir}")

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    run_id = manifest.get("run_id", run_dir.name)

    package_path = output or (run_dir / f"{run_id}_deployment.zip")
    package_path = package_path.resolve()

    with ZipFile(package_path, "w", compression=ZIP_DEFLATED) as archive:
        for filename in ["run_manifest.json", "deployment_plan.json", "deployment_plan.md", "submission_pack.md"]:
            path = run_dir / filename
            if path.exists():
                archive.write(path, arcname=path.name)
        evidence_dir = run_dir / "evidence"
        if evidence_dir.exists():
            for file_path in evidence_dir.rglob("*"):
                if file_path.is_file():
                    archive.write(file_path, arcname=f"evidence/{file_path.name}")
    return package_path


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    run_dir = Path(args.run_dir)
    output = Path(args.output).expanduser() if args.output else None

    package = create_package(run_dir, output)
    print(f"Deployment package created at {package}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
