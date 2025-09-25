import importlib.util
from pathlib import Path
import sys

from project_generator.core.brief_parser import ScaffoldSpec

ROOT = Path(__file__).resolve().parents[1]
PLAN_SPEC = importlib.util.spec_from_file_location(
    "_plan_from_brief_test", ROOT / "scripts" / "plan_from_brief.py"
)
assert PLAN_SPEC and PLAN_SPEC.loader
PLAN_MODULE = importlib.util.module_from_spec(PLAN_SPEC)
sys.modules[PLAN_SPEC.name] = PLAN_MODULE
PLAN_SPEC.loader.exec_module(PLAN_MODULE)  # type: ignore[misc]
build_plan = PLAN_MODULE.build_plan  # type: ignore[attr-defined]


def test_build_plan_backend_only_features():
    spec = ScaffoldSpec(
        name="api-only",
        industry="saas",
        project_type="api",
        frontend="none",
        backend="fastapi",
        database="postgres",
        auth="auth0",
        deploy="aws",
        compliance=["hipaa"],
        features=["audit logging", "usage reporting"],
        separate_repos=True,
    )

    plan = build_plan(spec, {"compliance": ["soc2"]})

    assert plan["frontend"] == []
    backend_ids = {task["id"] for task in plan["backend"]}
    assert "BE-AUTH" in backend_ids  # auth enabled for backend lane
    assert any(task["id"].startswith("BE-COMP-") for task in plan["backend"])
    assert any("audit logging" in task["title"].lower() for task in plan["backend"])


def test_build_plan_fullstack_feature_distribution():
    spec = ScaffoldSpec(
        name="fullstack-app",
        industry="ecommerce",
        project_type="fullstack",
        frontend="nextjs",
        backend="fastapi",
        database="postgres",
        auth="auth0",
        deploy="aws",
        compliance=[],
        features=["admin dashboard", "payment processing"],
        separate_repos=True,
    )

    plan = build_plan(spec)

    frontend_ids = {task["id"] for task in plan["frontend"]}
    backend_ids = {task["id"] for task in plan["backend"]}

    assert any(task_id.startswith("FE-FTR") for task_id in frontend_ids)
    assert any(task_id.startswith("BE-FTR") for task_id in backend_ids)
    assert any("dashboard" in task["title"].lower() for task in plan["frontend"])
    assert any("payment" in task["title"].lower() for task in plan["backend"])
