from dataclasses import replace
from pathlib import Path

import pytest

from project_generator.core.brief_parser import ScaffoldSpec

from scripts.pre_lifecycle_plan import ChecklistBuilder, ChecklistContext


@pytest.fixture()
def spec() -> ScaffoldSpec:
    return ScaffoldSpec(
        name="demo",
        industry="saas",
        project_type="fullstack",
        frontend="nextjs",
        backend="fastapi",
        database="postgres",
        auth="auth0",
        deploy="aws",
        compliance=["hipaa"],
        features=["reporting"],
        separate_repos=True,
    )


def _ctx(spec: ScaffoldSpec, tmp_path: Path, lanes: dict, **config_overrides) -> ChecklistContext:
    config = {
        "deploy": spec.deploy,
        "compliance": spec.compliance,
        "frontend": spec.frontend,
        "backend": spec.backend,
        "database": spec.database,
    }
    config.update(config_overrides)
    brief_path = tmp_path / "docs" / "briefs" / spec.name / "brief.md"
    brief_path.parent.mkdir(parents=True)
    brief_path.write_text("demo", encoding="utf-8")
    project_dir = tmp_path / spec.name
    project_dir.mkdir()
    (project_dir / "PLAN.md").write_text("plan", encoding="utf-8")
    (project_dir / "PLAN.tasks.json").write_text("{}", encoding="utf-8")
    (project_dir / "evidence").mkdir()
    (project_dir / "frontend").mkdir()
    (project_dir / "backend").mkdir()
    return ChecklistContext(
        spec=spec,
        config=config,
        brief_path=brief_path,
        project_dir=project_dir,
        output_root=tmp_path,
        lanes=lanes,
    )


def test_frontend_stage_omitted_when_lane_empty(spec: ScaffoldSpec, tmp_path: Path):
    lanes = {"backend": [{"id": "BE", "title": "", "blocked_by": [], "acceptance": []}], "frontend": []}
    ctx = _ctx(replace(spec, frontend="none"), tmp_path, lanes, frontend="none")
    steps = ChecklistBuilder(ctx).build()
    titles = [step.title for step in steps]
    assert "Frontend Implementation Sequence (execute in project workspace)" not in titles


def test_deploy_and_observability_skipped_when_no_deploy(spec: ScaffoldSpec, tmp_path: Path):
    lanes = {"backend": [], "frontend": []}
    ctx = _ctx(spec, tmp_path, lanes, deploy="n/a")
    steps = ChecklistBuilder(ctx).build()
    titles = [step.title for step in steps]
    assert "Deploy & Promote" not in titles
    assert "Observability & Continuous Ops" not in titles


def test_packaging_stage_includes_compliance(spec: ScaffoldSpec, tmp_path: Path):
    lanes = {"backend": [], "frontend": []}
    ctx = _ctx(spec, tmp_path, lanes)
    steps = ChecklistBuilder(ctx).build()
    packaging = next(step for step in steps if "Packaging" in step.title)
    assert any("validate_compliance_assets" in item for item in packaging.items)
