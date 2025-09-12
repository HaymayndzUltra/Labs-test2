from typing import Dict, Any, List


def scan_red_flags(extracted: Dict[str, Any], gaps: Dict[str, Any]) -> Dict[str, Any]:
    risks: List[Dict[str, Any]] = []
    # Missing KPIs
    if not extracted.get("kpis"):
        risks.append({
            "id": "missing_kpis",
            "risk": "No measurable success criteria",
            "mitigation": "Propose concrete KPIs and confirm with client before implementation",
        })
    # Timeline unclear
    if "timeline" not in extracted:
        risks.append({
            "id": "unclear_timeline",
            "risk": "No explicit timeline or milestones",
            "mitigation": "Define a phased plan with milestone dates for review/approval",
        })
    # Constraints unspecified
    if not extracted.get("constraints"):
        risks.append({
            "id": "constraints_unknown",
            "risk": "Non-functional requirements may be missed",
            "mitigation": "Run a short checklist for accessibility, SEO, security, and compliance",
        })

    return {"risks": risks}

