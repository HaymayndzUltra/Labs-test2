"""Template utilities for reusable workflow assets."""

from __future__ import annotations

from pathlib import Path
from string import Template
from typing import Any, Dict

from .exceptions import WorkflowConfigurationError


class TemplateManager:
    """Load and render workflow templates stored on disk."""

    REQUIRED_TEMPLATES: Dict[str, str] = {
        "intake": "intake_form.md",
        "risk": "risk_assessment.md",
        "design": "design_review.md",
        "bom": "environment_bom.json",
        "testing": "testing_matrix.md",
        "submission": "submission_pack.md",
        "deployment": "deployment_plan.md",
    }

    def __init__(self, template_root: Path) -> None:
        self.template_root = template_root
        self._verify_templates()

    def _verify_templates(self) -> None:
        missing: list[str] = []
        for name, filename in self.REQUIRED_TEMPLATES.items():
            path = self.template_root / filename
            if not path.exists():
                missing.append(f"{name} ({filename})")
        if missing:
            raise WorkflowConfigurationError(
                "Missing required workflow templates: " + ", ".join(sorted(missing))
            )

    def read(self, name: str) -> str:
        filename = self.REQUIRED_TEMPLATES.get(name)
        if not filename:
            raise WorkflowConfigurationError(f"Unknown template requested: {name}")
        return (self.template_root / filename).read_text(encoding="utf-8")

    def render(self, name: str, context: Dict[str, Any]) -> str:
        """Render a template using Python's string.Template."""

        raw_template = Template(self.read(name))
        return raw_template.safe_substitute(**context)
