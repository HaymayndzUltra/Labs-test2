import json
import subprocess
import sys
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[2]
SCRIPTS_DIR = ROOT / "scripts"


def _write_brief(name: str, content: str) -> Path:
    brief_dir = ROOT / "docs" / "briefs" / name
    brief_dir.mkdir(parents=True, exist_ok=True)
    brief_path = brief_dir / "brief.md"
    brief_path.write_text(content, encoding="utf-8")
    return brief_path


@pytest.fixture
def temp_config(tmp_path):
    config_path = ROOT / "workflow.test.json"
    yield config_path
    if config_path.exists():
        config_path.unlink()


@pytest.fixture
def cleanup_brief():
    created = []

    def _create(name: str, body: str) -> Path:
        path = _write_brief(name, body)
        created.append(path.parent)
        return path

    yield _create

    for directory in created:
        if directory.exists():
            for child in directory.iterdir():
                child.unlink()
            directory.rmdir()


def run_script(config_path: Path, name: str, output_root: Path) -> subprocess.CompletedProcess:
    cmd = [
        sys.executable,
        str(SCRIPTS_DIR / "pre_lifecycle_plan.py"),
        "--config",
        config_path.name,
        "--name",
        name,
        "--output-root",
        str(output_root),
    ]
    return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)


def test_pre_lifecycle_skips_frontend_when_unset(temp_config, cleanup_brief, tmp_path):
    brief_name = "tmp-preplan-backend"
    cleanup_brief(brief_name, """---\nname: tmp-preplan-backend\nindustry: saas\nproject_type: api\nbackend: fastapi\ndatabase: postgres\n---\nAPI only.""")

    config = {
        "name": brief_name,
        "industry": "saas",
        "project_type": "api",
        "backend": "fastapi",
        "frontend": "none",
        "database": "postgres",
    }
    temp_config.write_text(json.dumps(config), encoding="utf-8")

    result = run_script(temp_config, brief_name, tmp_path / "_generated")

    assert result.returncode == 0
    assert "Backend & Data Implementation Sequence" in result.stdout
    assert "Frontend Implementation Sequence" not in result.stdout


def test_pre_lifecycle_hides_deploy_when_not_configured(temp_config, cleanup_brief, tmp_path):
    brief_name = "tmp-preplan-nodeploy"
    cleanup_brief(brief_name, """---\nname: tmp-preplan-nodeploy\nindustry: saas\nproject_type: fullstack\nfrontend: nextjs\nbackend: fastapi\ndatabase: postgres\n---\nFullstack.""")

    config = {
        "name": brief_name,
        "industry": "saas",
        "project_type": "fullstack",
        "frontend": "nextjs",
        "backend": "fastapi",
        "database": "postgres",
        "deploy": "n/a",
    }
    temp_config.write_text(json.dumps(config), encoding="utf-8")

    result = run_script(temp_config, brief_name, tmp_path / "_generated")

    assert result.returncode == 0
    assert "Deploy & Promote" not in result.stdout
    assert "Observability & Continuous Ops" not in result.stdout
