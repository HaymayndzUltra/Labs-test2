import json
import time
from pathlib import Path
from typing import Dict, Any, List

from .extractor import extract_job_post
from .domain_router import route_domain
from .evidence_gate import load_candidate_facts
from .proposal_generator import generate_proposal
from .validator import validate_proposal


FIXTURES_DIR = Path("/workspace/tests/golden-fixtures")


def run_fixture(path: Path, config_dir: Path) -> Dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    t0 = time.time()
    extracted = extract_job_post(text)
    domain_info = route_domain(extracted)
    facts = load_candidate_facts(config_dir)
    draft, _ = generate_proposal(text, extracted, domain_info, facts, config_dir)
    report = validate_proposal(draft, text, extracted, facts)
    tfd = time.time() - t0
    return {
        "name": path.name,
        "tfd_ms": int(tfd * 1000),
        "pass": report.get("pass", False),
        "failures": report.get("failures", []),
        "word_count": len(draft.split()),
    }


def run_golden_suite(config_dir: Path, tfd_ms_target: int = 10000) -> Dict[str, Any]:
    FIXTURES_DIR.mkdir(parents=True, exist_ok=True)
    results: List[Dict[str, Any]] = []
    for f in sorted(FIXTURES_DIR.glob("*.txt")):
        results.append(run_fixture(f, config_dir))
    passed = [r for r in results if r["pass"]]
    pass_rate = (len(passed) / len(results)) * 100 if results else 100
    worst_tfd = max((r["tfd_ms"] for r in results), default=0)
    return {
        "count": len(results),
        "pass_rate": pass_rate,
        "worst_tfd_ms": worst_tfd,
        "results": results,
        "meets_thresholds": pass_rate >= 99 and worst_tfd <= tfd_ms_target,
    }


if __name__ == "__main__":
    summary = run_golden_suite(Path("/workspace/config"))
    print(json.dumps(summary, indent=2))

