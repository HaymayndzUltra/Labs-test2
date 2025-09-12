from pathlib import Path
from typing import Dict, Any, List


def _linkify_evidence(evidence: List[List[int]], conversation_index: Dict[str, Any]) -> str:
    # Map first span to message id via conversation index
    if not evidence:
        return "(no-evidence)"
    span = evidence[0]
    char_start, char_end = span[0], span[1]
    for seg in conversation_index.get("segments", []):
        if seg["char_start"] <= char_start <= seg["char_end"]:
            return f"[evidence:{seg['id']}]"
    return "(no-evidence)"


def build_project_brief(session_dir: Path, extracted: Dict[str, Any], gaps: Dict[str, Any], report: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append(f"# Project Brief: {session_dir.name}")
    lines.append("")
    lines.append("## Overview")
    lines.append("This brief consolidates known details and open questions for alignment.")

    lines.append("")
    lines.append("## Technical Requirements")
    conv_index_path = session_dir / "conversation_index.json"
    conversation_index: Dict[str, Any] = {}
    if conv_index_path.exists():
        import json
        conversation_index = json.loads(conv_index_path.read_text(encoding="utf-8"))

    skills = []
    for s in extracted.get("skills", [])[:10]:
        skills.append(f"{s.get('value','')} {_linkify_evidence(s.get('evidence',[]), conversation_index)}")
    lines.append(f"- Stack: {', '.join(skills) or '(unspecified)'}")

    dels = []
    for d in extracted.get("deliverables", [])[:10]:
        dels.append(f"{d.get('value','')} {_linkify_evidence(d.get('evidence',[]), conversation_index)}")
    lines.append(f"- Deliverables: {', '.join(dels) or '(unspecified)'}")

    kpis = []
    for k in extracted.get("kpis", [])[:10]:
        kpis.append(f"{k.get('value','')} {_linkify_evidence(k.get('evidence',[]), conversation_index)}")
    lines.append(f"- KPIs: {', '.join(kpis) or '(unspecified)'}")

    cons = []
    for c in extracted.get("constraints", [])[:10]:
        cons.append(f"{c.get('value','')} {_linkify_evidence(c.get('evidence',[]), conversation_index)}")
    lines.append(f"- Constraints: {', '.join(cons) or '(unspecified)'}")

    lines.append("")
    lines.append("## Timeline & Milestones")
    if "timeline" in extracted:
        t = extracted["timeline"]["value"]
        lines.append(f"- Stated timeline: {t['quantity']} {t['unit']} {_linkify_evidence(extracted['timeline'].get('evidence',[]), conversation_index)}")
    else:
        lines.append("- Stated timeline: (unspecified)")
    lines.append("- Milestones: To be confirmed based on open gaps")

    lines.append("")
    lines.append("## Budget Considerations")
    if "budget_usd" in extracted and extracted["budget_usd"]["value"]:
        lines.append(f"- Budget: ${extracted['budget_usd']['value']} {_linkify_evidence(extracted['budget_usd'].get('evidence',[]), conversation_index)}")
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

