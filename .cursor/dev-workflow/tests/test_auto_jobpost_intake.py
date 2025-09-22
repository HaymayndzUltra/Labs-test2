#!/usr/bin/env python3
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

SAMPLE_POST = """Senior Healthcare Platform Engineer needed for HIPAA-compliant patient engagement portal.
We need a React/Next.js frontend with a Node.js or Python backend that integrates with existing FHIR APIs.
The system must scale for hospital groups and support analytics dashboards with real-time updates.
Looking for a small team to move fast over the next few months with enterprise security and compliance.
"""


def repo_root() -> Path:
    here = Path(__file__).resolve()
    for candidate in [here, *here.parents]:
        if (candidate / ".git").exists() or (candidate / ".cursor").exists():
            return candidate
    return Path.cwd()


def main() -> None:
    root = repo_root()
    sessions_dir = root / "upwork-sessions"
    session_name = "session-test-auto"
    session_dir = sessions_dir / session_name
    if session_dir.exists():
        shutil.rmtree(session_dir)

    with tempfile.NamedTemporaryFile("w", delete=False, encoding="utf-8") as handle:
        handle.write(SAMPLE_POST)
        job_file = Path(handle.name)

    try:
        cmd = [
            "python3",
            str(root / ".cursor" / "dev-workflow" / "tools" / "auto_jobpost_intake.py"),
            "--job-post-file",
            str(job_file),
            "--session-id",
            session_name,
            "--overwrite",
            "--force-refresh",
        ]
        output = subprocess.check_output(cmd, cwd=root)
        result = json.loads(output)

        snapshot_dir = Path(result["snapshot"]).parent
        required = [
            "snapshot.json",
            "rules_manifest.json",
            "tech_fingerprint.json",
            "dependency_fingerprint.json",
            "README_excerpt.md",
            "context_discovery.json",
        ]
        missing = [name for name in required if not (snapshot_dir / name).exists()]
        if missing:
            raise AssertionError(f"missing snapshot artifacts: {missing}")

        selection_path = session_dir / "selection.json"
        if not selection_path.exists():
            raise AssertionError("selection.json was not generated")
        selection = json.loads(selection_path.read_text(encoding="utf-8"))
        for key in ("frontend", "backend"):
            if not selection.get("recommendation", {}).get(key):
                raise AssertionError(f"recommendation missing {key} candidates")

        brief_path = session_dir / "project-brief.md"
        if "Intake" not in brief_path.read_text(encoding="utf-8"):
            raise AssertionError("project-brief.md was not updated with an intake section")

        print(json.dumps({
            "session": result["session_dir"],
            "snapshot_files": required,
            "recommendation_keys": sorted(selection["recommendation"].keys()),
        }, indent=2))
    finally:
        if session_dir.exists():
            shutil.rmtree(session_dir)
        if job_file.exists():
            job_file.unlink()


if __name__ == "__main__":
    main()
