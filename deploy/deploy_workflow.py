"""Deployment helper for the workflow optimization system."""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path
from typing import Iterable

PACKAGE_CONTENT = [
    Path("workflow_system/workflow.yml"),
    Path("workflow_system/templates"),
    Path("requirements.txt"),
    Path("src/workflow_optimization"),
]


def _validate_sources(sources: Iterable[Path]) -> None:
    missing = [str(path) for path in sources if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing assets for deployment: {', '.join(missing)}")


def build_package(destination: Path) -> Path:
    """Package workflow assets into the specified destination directory."""

    destination = destination.resolve()
    destination.mkdir(parents=True, exist_ok=True)

    _validate_sources(PACKAGE_CONTENT)

    package_root = destination / "workflow_package"
    if package_root.exists():
        shutil.rmtree(package_root)
    package_root.mkdir()

    for item in PACKAGE_CONTENT:
        target = package_root / item.name
        if item.is_dir():
            shutil.copytree(item, target)
        else:
            shutil.copy2(item, target)

    archive_path = shutil.make_archive(str(package_root), "zip", package_root)
    return Path(archive_path)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Prepare deployment archive")
    parser.add_argument(
        "output",
        type=Path,
        help="Destination directory for the deployment package.",
    )
    args = parser.parse_args(argv)

    try:
        archive = build_package(args.output)
    except Exception as exc:  # pragma: no cover - CLI guardrail
        print(f"Deployment failed: {exc}", file=sys.stderr)
        return 1

    print(f"Deployment package created at {archive}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
