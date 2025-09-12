import hashlib
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Any


SESSIONS_DIR = Path("/workspace/upwork-sessions")


def ensure_dirs() -> None:
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)


def fingerprint(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]


def new_session_dir(job_text: str) -> Path:
    ts = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    fp = fingerprint(job_text)
    session_name = f"session-{ts}-{fp}"
    sd = SESSIONS_DIR / session_name
    sd.mkdir(parents=True, exist_ok=True)
    return sd


def write_json(path: Path, data: Dict[str, Any]) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def append_md(path: Path, content: str) -> None:
    with path.open("a", encoding="utf-8") as f:
        f.write(content)
        if not content.endswith("\n"):
            f.write("\n")

