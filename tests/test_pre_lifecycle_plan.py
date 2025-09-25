from __future__ import annotations

from pathlib import Path

import pytest

from project_generator.core.brief_parser import ScaffoldSpec
from scripts.plan_from_brief import apply_workflow_overrides, build_plan
from scripts.pre_lifecycle_plan import build_stages


def make_spec(**overrides) -> ScaffoldSpec:
    base = {
        "name": "demo",
        "industry": "saas",
        "project_type": "fullstack",
        "frontend": "nextjs",
        "backend": "fastapi",
        "database": "postgres",
        "auth": "auth0",
        "deploy": "aws",
        "compliance": [],
        "features": [],
        "separate_repos": True,
    }
    base.update(overrides)
    return ScaffoldSpec(**base)


def test_build_plan_omits_backend_when_disabled():
    spec = make_spec(backend="none", database="none")
    plan = build_plan(spec, {})
    assert plan["backend"] == []


def test_build_plan_includes_compliance_tasks():
    spec = make_spec(compliance=["hipaa"])
    plan = build_plan(spec, {})
    backend_ids = {task["id"] for task in plan["backend"]}
    assert "BACKEND-HIPAA" in backend_ids


def test_apply_workflow_overrides_merges_fields():
    spec = make_spec()
    cfg = {"frontend": "none", "compliance": ["pci", "hipaa"], "features": ["realtime"]}
    effective = apply_workflow_overrides(spec, cfg)
    assert effective.frontend == "none"
    assert set(effective.compliance) == {"pci", "hipaa"}
    assert "realtime" in effective.features


@pytest.fixture()
def staging_paths(tmp_path: Path) -> tuple[Path, Path, Path, Path]:
    cfg_path = tmp_path / "workflow.config.json"
    cfg_path.write_text("{}", encoding="utf-8")
    brief_path = tmp_path / "brief.md"
    brief_path.write_text("# Brief", encoding="utf-8")
    output_root = tmp_path / "generated"
    project_dir = output_root / "demo"
    return cfg_path, brief_path, output_root, project_dir


def test_build_stages_skips_backend_and_compliance(staging_paths):
    cfg_path, brief_path, output_root, project_dir = staging_paths
    spec = make_spec(backend="none", database="none")
    lanes = {"frontend": [], "backend": []}
    stages = build_stages(cfg_path, brief_path, output_root, project_dir, spec, {}, lanes)
    titles = [stage.title for stage in stages]
    assert "Backend & Data Implementation Sequence" not in titles
    assert "Compliance, Evidence, and Packaging" not in titles


def test_build_stages_includes_compliance_when_present(staging_paths):
    cfg_path, brief_path, output_root, project_dir = staging_paths
    spec = make_spec(compliance=["hipaa"])
    lanes = build_plan(spec, {})
    stages = build_stages(cfg_path, brief_path, output_root, project_dir, spec, {}, lanes)
    titles = [stage.title for stage in stages]
    assert "Compliance, Evidence, and Packaging" in titles
