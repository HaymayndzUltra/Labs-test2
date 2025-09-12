from typing import Dict, Any, List


def build_traces(used_refs: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "specifics": used_refs.get("specifics", []),
        "domain": used_refs.get("domain"),
        "used_facts": used_refs.get("used_facts", []),
        "claims": used_refs.get("claims", []),
    }

