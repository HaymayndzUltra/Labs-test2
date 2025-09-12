import json
from pathlib import Path
from typing import Dict, Any, List


def _load_yaml_optional(path: Path) -> Dict[str, Any]:
    try:
        import yaml  # type: ignore
    except Exception:
        return {}
    try:
        return yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    except Exception:
        return {}


def load_candidate_facts(config_dir: Path) -> Dict[str, Any]:
    """Load candidate facts from YAML or JSON; prefer YAML if parser available.

    Returns a dictionary with keys like "achievements", "skills", etc.
    """
    yml = config_dir / "candidate-facts.yaml"
    jsn = config_dir / "candidate-facts.json"
    if yml.exists():
        data = _load_yaml_optional(yml)
        if data:
            return data
    if jsn.exists():
        try:
            return json.loads(jsn.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def select_micro_proof(candidate_facts: Dict[str, Any], domain: str) -> str | None:
    """Pick a short, verifiable proof line aligned with the domain.

    The function only returns values from candidate_facts without modification to
    avoid fabrication. If none exists, returns None.
    """
    domain_keys: List[str] = [
        f"proof_{domain}",
        "proof_general",
        "achievements",
    ]
    for key in domain_keys:
        val = candidate_facts.get(key)
        if isinstance(val, list) and val:
            return str(val[0])[:200]
        if isinstance(val, str) and val.strip():
            return val.strip()[:200]
    return None

