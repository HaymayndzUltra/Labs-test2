#!/usr/bin/env python3
import json
import tarfile
from datetime import datetime, timezone
from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parents[1]
BACKUPS_DIR = REPO_ROOT / "backups"
ARCHIVE = BACKUPS_DIR / "workflows_backup.tar.gz"
RESTORE_DIR = BACKUPS_DIR / "restore_test"
PROOF = BACKUPS_DIR / "last_restore.json"

EXPECTED = [
    Path("docs/workflows/02_TECHNICAL_PLANNING.md"),
    Path(".cursor/rules/trigger-commands/01-brief-analysis.tc.mdc"),
]


def extract():
    if not ARCHIVE.exists():
        print("ERROR: backup archive not found")
        raise SystemExit(2)
    if RESTORE_DIR.exists():
        for p in RESTORE_DIR.rglob("*"):
            try:
                if p.is_file():
                    p.unlink()
            except Exception:
                pass
    RESTORE_DIR.mkdir(parents=True, exist_ok=True)
    with tarfile.open(ARCHIVE, "r:gz") as tar:
        tar.extractall(RESTORE_DIR)


def verify() -> list[str]:
    missing = []
    for rel in EXPECTED:
        if not (RESTORE_DIR / rel).exists():
            missing.append(str(rel))
    return missing


def write_proof(missing: list[str]):
    payload = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "archive": str(ARCHIVE.relative_to(REPO_ROOT)),
        "restore_dir": str(RESTORE_DIR.relative_to(REPO_ROOT)),
        "missing": missing,
    }
    PROOF.write_text(json.dumps(payload, indent=2))


def main():
    extract()
    missing = verify()
    write_proof(missing)
    if missing:
        print(f"Restore completed with missing files: {missing}")
        raise SystemExit(2)
    print("Restore OK")


if __name__ == "__main__":
    main()