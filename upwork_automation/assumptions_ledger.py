from datetime import datetime
from pathlib import Path


def init_assumptions_ledger(session_dir: Path) -> None:
    path = session_dir / "assumptions-ledger.md"
    if path.exists():
        return
    path.write_text("# Assumptions Ledger\n\n", encoding="utf-8")


def add_assumption(session_dir: Path, assumption: str, reason: str | None = None) -> None:
    path = session_dir / "assumptions-ledger.md"
    ts = datetime.utcnow().isoformat(timespec="seconds")
    line = f"- [{ts}] {assumption}"
    if reason:
        line += f" — reason: {reason}"
    line += "\n"
    with path.open("a", encoding="utf-8") as f:
        f.write(line)

