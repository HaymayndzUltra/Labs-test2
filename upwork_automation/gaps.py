from typing import Dict, Any, List


def initialize_gaps() -> Dict[str, Any]:
    return {"open_gaps": [], "closed_gaps": []}


def _ensure_gap(gaps: Dict[str, Any], gap: Dict[str, Any]) -> Dict[str, Any]:
    open_ids = {g.get("id") for g in gaps.get("open_gaps", [])}
    closed_ids = {g.get("id") for g in gaps.get("closed_gaps", [])}
    gid = gap.get("id")
    if gid in open_ids or gid in closed_ids:
        return gaps
    gaps.setdefault("open_gaps", []).append(gap)
    return gaps


def update_gaps_from_extracted(gaps: Dict[str, Any], extracted: Dict[str, Any], domain_info: Dict[str, Any]) -> Dict[str, Any]:
    # Budget and timeline
    if "budget_usd" not in extracted:
        gaps = _ensure_gap(gaps, {
            "id": "budget",
            "question": "What is the approved budget (and hourly vs fixed)?",
            "priority": "high",
            "depends_on": [],
        })
    if "timeline" not in extracted:
        gaps = _ensure_gap(gaps, {
            "id": "timeline",
            "question": "What is the target timeline (including key milestones)?",
            "priority": "high",
            "depends_on": [],
        })

    # KPIs and access
    if not extracted.get("kpis"):
        gaps = _ensure_gap(gaps, {
            "id": "kpis",
            "question": "What measurable KPIs define success (e.g., Core Web Vitals, conversion)?",
            "priority": "high",
            "depends_on": [],
        })

    # Domain-specific priority questions (top 3) with simple dependency ordering
    deps_chain: List[str] = []
    for idx, q in enumerate(domain_info.get("priority_questions", [])[:3]):
        dep = deps_chain[-1] if deps_chain else None
        gid = f"domain-q{idx+1}"
        gaps = _ensure_gap(gaps, {
            "id": gid,
            "question": q,
            "priority": "high" if idx == 0 else "medium",
            "depends_on": [dep] if dep else [],
        })
        deps_chain.append(gid)

    # Constraints and non-functional requirements
    if not extracted.get("constraints"):
        gaps = _ensure_gap(gaps, {
            "id": "nonfunctional",
            "question": "Any non-functional requirements (accessibility, SEO, security, compliance)?",
            "priority": "medium",
            "depends_on": [],
        })

    # Reorder open gaps: high priority first, then by dependency count
    prio_order = {"high": 0, "medium": 1, "low": 2}
    gaps["open_gaps"] = sorted(
        gaps.get("open_gaps", []),
        key=lambda g: (prio_order.get(g.get("priority", "medium"), 1), len(g.get("depends_on", [])))
    )
    return gaps


def render_gaps(gaps: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append("Open gaps (ordered):")
    for i, g in enumerate(gaps.get("open_gaps", []), start=1):
        lines.append(f"{i}. [{g.get('priority','medium')}] {g.get('question')}")
    if not gaps.get("open_gaps"):
        lines.append("(none)")
    return "\n".join(lines) + "\n"

