from pathlib import Path
from typing import Dict, Any, List


def _md_escape(text: str) -> str:
    return text.replace("|", "\\|")


def write_requirements_matrix(session_dir: Path, extracted: Dict[str, Any], gaps: Dict[str, Any]) -> None:
    must: List[str] = []
    should: List[str] = []
    could: List[str] = []
    wont: List[str] = []

    for c in extracted.get("constraints", []):
        must.append(str(c.get("value", "")).strip())

    for d in extracted.get("deliverables", []):
        must.append(str(d.get("value", "")).strip())

    for s in extracted.get("skills", []):
        should.append(str(s.get("value", "")).strip())

    # Gaps show as unknown requirements
    unknowns = [g.get("question", "") for g in gaps.get("open_gaps", [])]

    lines: List[str] = []
    lines.append("# Requirements Matrix (MSCW)")
    lines.append("")
    lines.append("| Category | Items |")
    lines.append("|---|---|")
    lines.append(f"| Must | {'; '.join(_md_escape(x) for x in must) or '(none)'} |")
    lines.append(f"| Should | {'; '.join(_md_escape(x) for x in should) or '(none)'} |")
    lines.append(f"| Could | {'; '.join(_md_escape(x) for x in could) or '(none)'} |")
    lines.append(f"| Won’t | {'; '.join(_md_escape(x) for x in wont) or '(none)'} |")
    lines.append("")
    lines.append("## Unknowns / Open Questions")
    for q in unknowns:
        lines.append(f"- {q}")
    if not unknowns:
        lines.append("- (none)")

    (session_dir / "requirements-matrix.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

