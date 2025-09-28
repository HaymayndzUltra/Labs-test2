"""Template utilities for workflow automation."""
from __future__ import annotations

from importlib import resources
from pathlib import Path
from typing import List


def list_templates() -> List[str]:
    return [name for name in resources.contents(__package__) if not name.startswith("__")]


def read_text(name: str) -> str:
    return resources.read_text(__package__, name)


__all__ = ["list_templates", "read_text"]
