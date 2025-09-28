#!/usr/bin/env python3
"""Package workflow automation assets for deployment."""
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

ASSET_DIRS = [
    "workflow_automation",
    "workflow",
    "scripts/run_workflow.py",
    "scripts/evidence_report.py",
]


def package(output: Path) -> None:
    output = output.resolve()
    if output.exists():
        if output.is_dir():
            shutil.rmtree(output)
        else:
            output.unlink()
    output.mkdir(parents=True, exist_ok=True)

    for asset in ASSET_DIRS:
        src = Path(asset)
        dest = output / src.name
        if src.is_dir():
            shutil.copytree(src, dest)
        else:
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dest)

    archive_path = shutil.make_archive(str(output), "zip", root_dir=output)
    print(f"Packaged workflow assets into {archive_path}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("deploy/workflow_bundle"),
        help="Directory where packaged assets will be written",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    package(args.output)
