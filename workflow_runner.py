"""Module wrapper so `python -m workflow_runner` executes the workflow CLI."""
from __future__ import annotations

from scripts.run_workflow import main


def run() -> int:
    return main()


if __name__ == "__main__":  # pragma: no cover - CLI trampoline
    raise SystemExit(run())
