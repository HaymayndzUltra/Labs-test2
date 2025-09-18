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
    r1 = run(["python", str(ROOT / "scripts" / "enrich_tasks.py"), "--input", str(inp), "--output", str(inp)], stdout=PIPE, text=True)
    assert r1.returncode == 0, r1.stdout

    # Validate
    r2 = run(["python", str(ROOT / "scripts" / "validate_tasks.py"), "--input", str(inp)], stdout=PIPE, text=True)
    assert r2.returncode == 0, r2.stdout

    data = json.loads(inp.read_text(encoding="utf-8"))
    # Expect personas and acceptance present
    be0 = data["backend"][0]
    fe0 = data["frontend"][0]
    assert be0.get("persona") in ("code-architect", "system-integrator", "qa")
    assert fe0.get("persona") in ("code-architect", "system-integrator", "qa")
    assert isinstance(be0.get("acceptance"), list)
    assert isinstance(fe0.get("acceptance"), list)