from scripts.plan_from_brief import build_plan
from project_generator.core.brief_parser import ScaffoldSpec


def _spec(**overrides):
    base = dict(
        name="demo",
        industry="saas",
        project_type="fullstack",
        frontend="nextjs",
        backend="fastapi",
        database="postgres",
        auth="auth0",
        deploy="aws",
        compliance=[],
        features=[],
        separate_repos=True,
    )
    base.update(overrides)
    return ScaffoldSpec(**base)


def test_api_project_skips_frontend_lane():
    plan = build_plan(_spec(project_type="api", frontend="none"))
    assert plan["frontend"] == []
    backend_ids = [task["id"] for task in plan["backend"]]
    assert "BE-DOCS" in backend_ids


def test_mobile_project_uses_mobile_templates():
    plan = build_plan(
        _spec(project_type="mobile", frontend="expo", features=["offline"], auth="cognito")
    )
    frontend_ids = [task["id"] for task in plan["frontend"]]
    assert "FE-MOB-SHELL" in frontend_ids
    assert "FE-MOB-OFFLINE" in frontend_ids


def test_compliance_tasks_present_when_requested():
    plan = build_plan(_spec(compliance=["hipaa", "gdpr"]))
    backend_ids = [task["id"] for task in plan["backend"]]
    assert "BE-HIPAA" in backend_ids
    assert "BE-GDPR" in backend_ids
