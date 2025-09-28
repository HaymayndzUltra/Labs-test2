"""Utility helpers for rendering universal templates."""

from __future__ import annotations

from pathlib import Path
from string import Template
from typing import Any, Dict

from .exceptions import EvidenceError

TEMPLATE_ROOT = Path("workflow_system/templates")


def get_template_path(name: str) -> Path:
    """Return the path to a template file."""

    path = TEMPLATE_ROOT / name
    if not path.exists():
        raise EvidenceError(f"Template not found: {name}")
    return path


def render_template(name: str, context: Dict[str, Any]) -> str:
    """Render a template using :class:`string.Template` substitution."""

    template_path = get_template_path(name)
    content = template_path.read_text(encoding="utf-8")
    template = Template(content)
    return template.safe_substitute(**context)


def write_template(name: str, context: Dict[str, Any], destination: Path) -> Path:
    """Render a template and write it to ``destination``."""

    rendered = render_template(name, context)
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(rendered, encoding="utf-8")
    return destination
