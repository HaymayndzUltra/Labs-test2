from typing import Dict, Any, List


def _close_by_keywords(gaps: Dict[str, Any], reply_text: str, mapping: Dict[str, List[str]]) -> Dict[str, Any]:
    lower = reply_text.lower()
    close_ids: List[str] = []
    for gid, keywords in mapping.items():
        if any(k in lower for k in keywords):
            close_ids.append(gid)
    new_open = []
    for g in gaps.get("open_gaps", []):
        if g.get("id") in close_ids:
            gaps.setdefault("closed_gaps", []).append(g)
        else:
            new_open.append(g)
    gaps["open_gaps"] = new_open
    return gaps


def apply_client_reply(gaps: Dict[str, Any], reply_text: str) -> Dict[str, Any]:
    """Heuristic: close gaps if reply mentions clear answers.

    This is a placeholder for a smarter delta engine. For now, if the reply
    includes keywords indicating budget or timeline, we mark corresponding gaps
    as closed.
    """
    mapping = {
        "budget": ["$", "budget", "cost", "price"],
        "timeline": ["week", "day", "month", "timeline", "deadline"],
        "kpis": ["kpi", "pagespeed", "core web vitals", "conversion", "lcp", "cls", "ttfb"],
        "domain-q1": ["access", "collaborator", "staging", "roles", "permissions", "environment"],
    }
    return _close_by_keywords(gaps, reply_text, mapping)

