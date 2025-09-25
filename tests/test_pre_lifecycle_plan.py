from __future__ import annotations

import json
import sys
from pathlib import Path

import pytest

from project_generator.core.brief_parser import ScaffoldSpec

from scripts.lifecycle_tasks import build_plan
from scripts.pre_lifecycle_plan import (
    PlanContext,
    PlanItem,
    apply_metadata_to_spec,
    build_effective_config,
    build_steps,
    load_brief_metadata,
)


def make_spec(**overrides) -> ScaffoldSpec:
    base = dict(
        name="demo",
        industry="saas",
        project_type="fullstack",
        frontend="nextjs",
        backend="fastapi",
        database="postgres",
        auth="auth0",
        deploy="aws",
        compliance=["soc2"],
        features=["analytics"],
        separate_repos=True,
    )
    base.update(overrides)
    return ScaffoldSpec(**base)


def test_build_plan_respects_capabilities():
    spec = make_spec(backend="none", database="none")
    plan = build_plan(spec, {})
    assert plan["backend"] == []
    assert any(task["id"].startswith("FE-") for task in plan["frontend"])


def test_build_steps_gates_compliance_and_deploy(tmp_path: Path):
    spec = make_spec(deploy="n/a", compliance=[])
    ctx = PlanContext(
        name="demo",
        config={"deploy": "n/a", "compliance": []},
        spec=spec,
        brief_path=tmp_path / "brief.md",
        output_root=tmp_path,
        project_dir=tmp_path / "project",
    )
    ctx.project_dir.mkdir()
    steps = build_steps(ctx, ["task"], ["task"])
    active_titles = [step.title for step in steps if step.is_active(ctx)]
    assert "Compliance, Evidence, and Packaging" not in active_titles
    assert "CI/CD Enablement" not in active_titles
    assert "Deploy & Promote" not in active_titles


def test_planitem_artifact_check(tmp_path: Path):
    spec = make_spec()
    ctx = PlanContext(
        name="demo",
        config={},
        spec=spec,
        brief_path=tmp_path / "brief.md",
        output_root=tmp_path,
        project_dir=tmp_path / "project",
    )
    ctx.project_dir.mkdir()
    item = PlanItem("Check missing", artifacts=[lambda c: c.project_dir / "missing.txt"])
    status, message = item.evaluate(ctx, execute=False)
    assert status == "error"
    assert "missing" in message


@pytest.mark.parametrize("exit_code,expected", [(0, "ok"), (3, "error")])
def test_planitem_execute(tmp_path: Path, exit_code: int, expected: str):
    spec = make_spec()
    ctx = PlanContext(
        name="demo",
        config={},
        spec=spec,
        brief_path=tmp_path / "brief.md",
        output_root=tmp_path,
        project_dir=tmp_path / "project",
    )
    ctx.project_dir.mkdir()
    command = f"{sys.executable} -c 'import sys; sys.exit({exit_code})'"
    item = PlanItem("Execute command", command=command)
    status, _ = item.evaluate(ctx, execute=True)
    assert status == expected


def test_load_brief_metadata_merges_frontmatter_and_json(tmp_path: Path):
    brief_dir = tmp_path / "briefs" / "demo"
    brief_dir.mkdir(parents=True)
    brief_path = brief_dir / "brief.md"
    brief_path.write_text(
        """---
name: Demo
frontend: nextjs
backend: fastapi
compliance: soc2
---

# Demo Brief
""",
        encoding="utf-8",
    )
    (brief_dir / "metadata.json").write_text(
        json.dumps({"deploy": "aws", "features": ["analytics", "auditing"]}),
        encoding="utf-8",
    )

    metadata = load_brief_metadata(brief_path)
    assert metadata["frontend"] == "nextjs"
    assert metadata["deploy"] == "aws"
    assert metadata["features"] == ["analytics", "auditing"]


def test_apply_metadata_to_spec_overrides_fields():
    spec = make_spec(frontend="nextjs", backend="fastapi", compliance=["soc2"])
    metadata = {"frontend": "nuxt", "compliance": ["hipaa", "soc2"]}

    new_spec = apply_metadata_to_spec(spec, metadata)
    assert new_spec.frontend == "nuxt"
    assert new_spec.compliance == ["hipaa", "soc2"]


def test_build_effective_config_prioritizes_overrides():
    spec = make_spec(frontend="nuxt", backend="django")
    raw_config = {
        "defaults": {
            "frontend": "nextjs",
            "backend": "fastapi",
            "industry": "saas",
        },
        "projects": {"demo": {"backend": "go"}},
    }
    metadata = {"frontend": "nuxt", "backend": "django", "compliance": ["soc2"]}

    cfg = build_effective_config(raw_config, metadata, "demo", spec)
    assert cfg["frontend"] == "nuxt"
    # project override wins over metadata/spec
    assert cfg["backend"] == "go"
    # ensure compliance normalized
    assert cfg["compliance"] == ["soc2"]
