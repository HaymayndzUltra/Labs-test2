import json
from pathlib import Path
from subprocess import run, PIPE

ROOT = Path(__file__).resolve().parents[1]


def _write(tmp: Path, name: str, data: dict | list):
    p = tmp / name
    p.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return p


def test_enrich_and_validate(tmp_path: Path):
    # minimal PLAN.tasks.json-like structure (dict-of-lists)
    plan = {
        "backend": [
            {"id": "BE-ONE", "title": "API route", "area": "backend", "blocked_by": []}
        ],
        "frontend": [
            {"id": "FE-ONE", "title": "Page", "area": "frontend", "blocked_by": []}
        ],
    }
    inp = _write(tmp_path, "tasks.json", plan)

    # Enrich
    r1 = run(["python3", str(ROOT / "scripts" / "enrich_tasks.py"), "--input", str(inp), "--output", str(inp)], stdout=PIPE, text=True)
    assert r1.returncode == 0, r1.stdout

    # Validate
    r2 = run(["python3", str(ROOT / "scripts" / "validate_tasks.py"), "--input", str(inp)], stdout=PIPE, text=True)
    assert r2.returncode == 0, r2.stdout

    data = json.loads(inp.read_text(encoding="utf-8"))
    # Expect personas and acceptance present
    be0 = data["backend"][0]
    fe0 = data["frontend"][0]
    assert be0.get("persona") in ("code-architect", "system-integrator", "qa")
    assert fe0.get("persona") in ("code-architect", "system-integrator", "qa")
    assert isinstance(be0.get("acceptance"), list)
    assert isinstance(fe0.get("acceptance"), list)


def test_workflow_documentation_exists():
    """Test that all required workflow documentation files exist."""
    required_docs = [
        ROOT / "README.md",
        ROOT / "docs" / "SYSTEM_OVERVIEW.md",
        ROOT / "docs" / "LOCAL_DEV_WORKFLOW.md",
        ROOT / "docs" / "CI_CD_OVERVIEW.md",
        ROOT / "docs" / "DEPLOYMENT.md",
        ROOT / "docs" / "COMPLIANCE_EVIDENCE.md",
    ]

    for path in required_docs:
        assert path.exists(), f"Required documentation missing: {path}"


def test_workflow_scripts_exist():
    """Test that all required workflow scripts exist and are valid Python."""
    required_scripts = [
        "scripts/generate_client_project.py",
        "scripts/plan_from_brief.py",
        "scripts/enrich_tasks.py",
        "scripts/validate_tasks.py",
        "scripts/sync_from_scaffold.py",
        "scripts/update_task_state.py",
        "scripts/write_context_report.py",
        "scripts/enforce_gates.py"
    ]
    
    for script_path in required_scripts:
        script_file = ROOT / script_path
        assert script_file.exists(), f"Required script {script_path} should exist"
        
        # Test if script is valid Python
        result = run(["python3", "-m", "py_compile", str(script_file)], 
                    stdout=PIPE, stderr=PIPE, text=True)
        assert result.returncode == 0, f"Script {script_path} should be valid Python: {result.stderr}"


def test_template_packs_structure():
    """Test that template packs directory structure is correct."""
    template_packs_dir = ROOT / "template-packs"
    assert template_packs_dir.exists(), "template-packs directory should exist"
    
    # Check required template categories
    required_categories = ["backend", "frontend", "database"]
    for category in required_categories:
        category_dir = template_packs_dir / category
        assert category_dir.exists(), f"template-packs/{category} directory should exist"
        
        # Check if category has at least one template
        templates = list(category_dir.iterdir())
        assert len(templates) > 0, f"template-packs/{category} should contain at least one template"


def test_workflow_phase_commands():
    """Test that workflow phase commands are properly documented."""
    local_workflow = (ROOT / "docs" / "LOCAL_DEV_WORKFLOW.md").read_text(encoding="utf-8")

    required_sections = [
        "Provision an isolated project directory",
        "Bootstrap tooling",
        "Plan from the brief",
        "Validate the task graph",
        "Preflight stack selection",
        "Dry-run generation",
        "Generate the project",
        "Install dependencies & run tests",
        "Collect metrics and enforce gates",
        "Build the submission pack",
        "Validate compliance assets",
    ]

    for section in required_sections:
        assert section in local_workflow, f"Local workflow is missing section: {section}"


def test_workflow_quick_reference_completeness():
    """Test that quick reference contains all essential information."""
    ci_overview = (ROOT / "docs" / "CI_CD_OVERVIEW.md").read_text(encoding="utf-8")

    essential_sections = [
        "Supported Workflows",
        "Secrets Preflight",
        "Staging Deployment",
        "Production Promotion",
        "Nightly Observability",
        "Adding or Modifying Checks",
    ]

    for section in essential_sections:
        assert section in ci_overview, f"CI/CD overview should contain section: {section}"


def test_github_integration_files():
    """Test that GitHub integration files are properly configured."""
    # Check pull request template
    pr_template = ROOT / ".github" / "pull_request_template.md"
    assert pr_template.exists(), "Pull request template should exist"

    pr_content = pr_template.read_text(encoding="utf-8")
    assert "Workflow Phase" in pr_content, "PR template should include workflow phase checklist"

    # Check supported CI workflows
    required_workflows = [
        "ci-secrets-preflight.yml",
        "ci-deploy.yml",
        "ci-promote-prod.yml",
        "nightly-observability.yml",
    ]

    workflows_dir = ROOT / ".github" / "workflows"
    for workflow in required_workflows:
        path = workflows_dir / workflow
        assert path.exists(), f"Expected workflow missing: {workflow}"


def test_readme_workflow_integration():
    """Test that README properly integrates workflow documentation."""
    readme = (ROOT / "README.md").read_text(encoding="utf-8")

    required_links = [
        "docs/SYSTEM_OVERVIEW.md",
        "docs/LOCAL_DEV_WORKFLOW.md",
        "docs/CI_CD_OVERVIEW.md",
        "docs/DEPLOYMENT.md",
        "docs/COMPLIANCE_EVIDENCE.md",
    ]

    for link in required_links:
        assert link in readme, f"README should link to {link}"

    assert "_generated" in readme, "README should mention isolated output directories"
