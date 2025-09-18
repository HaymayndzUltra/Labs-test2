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
    # Check main workflow documentation
    assert (ROOT / "WORKFLOW_GUIDE.md").exists(), "WORKFLOW_GUIDE.md should exist"
    assert (ROOT / "WORKFLOW_QUICK_REFERENCE.md").exists(), "WORKFLOW_QUICK_REFERENCE.md should exist"
    
    # Check docs directory
    assert (ROOT / "docs").exists(), "docs directory should exist"
    assert (ROOT / "docs" / "README.md").exists(), "docs/README.md should exist"
    
    # Check workflow examples and templates
    assert (ROOT / "docs" / "workflow-examples.md").exists(), "docs/workflow-examples.md should exist"
    assert (ROOT / "docs" / "workflow-templates.md").exists(), "docs/workflow-templates.md should exist"


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
    # Read workflow guide to check for phase commands
    workflow_guide = (ROOT / "WORKFLOW_GUIDE.md").read_text(encoding="utf-8")
    
    # Check for phase command references
    phase_commands = [
        "/0-bootstrap-project",
        "/1-create-prd", 
        "/2-generate-tasks",
        "/sync-tasks",
        "/3-process-tasks",
        "/4-quality-control",
        "/5-implementation-retrospective"
    ]
    
    for command in phase_commands:
        assert command in workflow_guide, f"Phase command {command} should be documented in WORKFLOW_GUIDE.md"


def test_workflow_quick_reference_completeness():
    """Test that quick reference contains all essential information."""
    quick_ref = (ROOT / "WORKFLOW_QUICK_REFERENCE.md").read_text(encoding="utf-8")
    
    # Check for essential sections
    essential_sections = [
        "Phase Commands Overview",
        "Quick Start Commands", 
        "Task States",
        "Personas",
        "Quality Gates",
        "Compliance Mapping"
    ]
    
    for section in essential_sections:
        assert section in quick_ref, f"Quick reference should contain section: {section}"


def test_github_integration_files():
    """Test that GitHub integration files are properly configured."""
    # Check pull request template
    pr_template = ROOT / ".github" / "pull_request_template.md"
    assert pr_template.exists(), "Pull request template should exist"
    
    pr_content = pr_template.read_text(encoding="utf-8")
    assert "Workflow Phase" in pr_content, "PR template should include workflow phase checklist"
    
    # Check CI workflow
    ci_workflow = ROOT / ".github" / "workflows" / "ci.yml"
    assert ci_workflow.exists(), "CI workflow should exist"
    
    ci_content = ci_workflow.read_text(encoding="utf-8")
    assert "workflow-docs-validation" in ci_content, "CI workflow should include workflow docs validation"


def test_readme_workflow_integration():
    """Test that README properly integrates workflow documentation."""
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    
    # Check for workflow documentation links
    assert "WORKFLOW_GUIDE.md" in readme, "README should link to WORKFLOW_GUIDE.md"
    assert "WORKFLOW_QUICK_REFERENCE.md" in readme, "README should link to WORKFLOW_QUICK_REFERENCE.md"
    
    # Check for workflow badges
    assert "![Workflow Documentation]" in readme, "README should have workflow documentation badge"
    assert "![Quick Reference]" in readme, "README should have quick reference badge"
    
    # Check for workflow phase overview
    assert "Phase Overview" in readme, "README should include workflow phase overview"
