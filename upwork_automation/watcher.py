import time
import hashlib
from pathlib import Path
from typing import Dict, Any

from .helpers import new_session_dir as _new_session_dir, write_json as _write_json, append_md as _append_md
from .extractor import extract_job_post
from .domain_router import route_domain
from .gaps import initialize_gaps, update_gaps_from_extracted
from .evidence_gate import load_candidate_facts
from .proposal_generator import generate_proposal
from .validator import validate_proposal
from .traces import build_traces
from .redflags import scan_red_flags


def run_inbox_watcher(inbox_dir: Path, config_dir: Path, poll_seconds: float = 2.0) -> None:
    seen: set[str] = set()
    fp_seen: set[str] = set()
    inbox_dir.mkdir(parents=True, exist_ok=True)
    while True:
        for p in sorted(inbox_dir.glob("*.txt")):
            if p.name in seen:
                continue
            try:
                job_text = p.read_text(encoding="utf-8")
            except Exception:
                continue
            # Content fingerprint dedupe
            fp = hashlib.sha256(job_text.encode("utf-8")).hexdigest()[:12]
            if fp in fp_seen:
                seen.add(p.name)
                continue
            session_dir = _new_session_dir(job_text)
            (session_dir / "proposal_history").mkdir(exist_ok=True)
            (session_dir / "job-post.txt").write_text(job_text, encoding="utf-8")
            _append_md(session_dir / "conversation-history.md", f"# Job Post\n\n{job_text}\n")

            extracted = extract_job_post(job_text)
            _write_json(session_dir / "extracted-info.json", extracted)
            domain_info = route_domain(extracted)
            _write_json(session_dir / "domain.json", domain_info)

            gaps = initialize_gaps()
            gaps = update_gaps_from_extracted(gaps, extracted, domain_info)
            _write_json(session_dir / "gaps.json", gaps)

            candidate_facts = load_candidate_facts(config_dir)
            proposal, used_refs = generate_proposal(
                job_text=job_text,
                extracted=extracted,
                domain_info=domain_info,
                candidate_facts=candidate_facts,
                style_config_dir=config_dir,
            )
            (session_dir / "proposal.md").write_text(proposal, encoding="utf-8")

            traces = build_traces(used_refs)
            _write_json(session_dir / "traces.json", traces)

            report = validate_proposal(proposal, job_text, extracted, candidate_facts)
            _write_json(session_dir / "validation_report.json", report)
            corrected = report.get("proposal_text")
            if isinstance(corrected, str) and corrected != proposal:
                (session_dir / "proposal.md").write_text(corrected, encoding="utf-8")

            red = scan_red_flags(extracted, gaps)
            _write_json(session_dir / "redflags.json", red)

            seen.add(p.name)
            fp_seen.add(fp)
        time.sleep(poll_seconds)

