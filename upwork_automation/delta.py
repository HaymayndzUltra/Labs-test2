from typing import Dict, Any


def apply_client_reply(gaps: Dict[str, Any], reply_text: str) -> Dict[str, Any]:
    """Heuristic: close gaps if reply mentions clear answers.

    This is a placeholder for a smarter delta engine. For now, if the reply
    includes keywords indicating budget or timeline, we mark corresponding gaps
    as closed.
    """
    lower = reply_text.lower()
    closed_ids = []
    if any(k in lower for k in ["$", "budget", "cost", "price"]):
        closed_ids.append("budget")
    if any(k in lower for k in ["week", "day", "month", "timeline", "deadline"]):
        closed_ids.append("timeline")

    new_open = []
    for g in gaps.get("open_gaps", []):
        if g.get("id") in closed_ids:
            gaps.setdefault("closed_gaps", []).append(g)
        else:
            new_open.append(g)
    gaps["open_gaps"] = new_open
    return gaps

