from pathlib import Path
from typing import Dict, Any, List


def build_project_brief(session_dir: Path, extracted: Dict[str, Any], gaps: Dict[str, Any], report: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append(f"# Project Brief: {session_dir.name}")
    lines.append("")
    lines.append("## Overview")
    lines.append("This brief consolidates known details and open questions for alignment.")

    lines.append("")
    lines.append("## Technical Requirements")
    skills = ", ".join(s.get("value", "") for s in extracted.get("skills", [])[:10]) or "(unspecified)"
    lines.append(f"- Stack: {skills}")
    dels = ", ".join(d.get("value", "") for d in extracted.get("deliverables", [])[:10]) or "(unspecified)"
    lines.append(f"- Deliverables: {dels}")
    kpis = ", ".join(k.get("value", "") for k in extracted.get("kpis", [])[:10]) or "(unspecified)"
    lines.append(f"- KPIs: {kpis}")
    cons = ", ".join(c.get("value", "") for c in extracted.get("constraints", [])[:10]) or "(unspecified)"
    lines.append(f"- Constraints: {cons}")

    lines.append("")
    lines.append("## Timeline & Milestones")
    if "timeline" in extracted:
        t = extracted["timeline"]["value"]
        lines.append(f"- Stated timeline: {t['quantity']} {t['unit']}")
    else:
        lines.append("- Stated timeline: (unspecified)")
    lines.append("- Milestones: To be confirmed based on open gaps")

    lines.append("")
    lines.append("## Budget Considerations")
    if "budget_usd" in extracted and extracted["budget_usd"]["value"]:
        lines.append(f"- Budget: ${extracted['budget_usd']['value']}")
    else:
        lines.append("- Budget: (unspecified)")

    lines.append("")
    lines.append("## Success Criteria")
    lines.append("- Measurable KPIs must be confirmed and reviewed at each milestone.")

    lines.append("")
    lines.append("## Risk Factors")
    lines.append("- See redflags.json for a full list of identified risks and mitigations.")

    lines.append("")
    lines.append("## Remaining Gaps")
    for g in gaps.get("open_gaps", []):
        lines.append(f"- {g.get('question')}")
    if not gaps.get("open_gaps"):
        lines.append("- (none)")

    lines.append("")
    lines.append("## Next Steps")
    lines.append("- Confirm answers to the top 2–3 questions, then lock scope and acceptance criteria.")

    return "\n".join(lines) + "\n"

