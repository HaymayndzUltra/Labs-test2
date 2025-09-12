import argparse
import hashlib
import json
import os
import re
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Tuple

from .extractor import extract_job_post
from .domain_router import route_domain
from .evidence_gate import load_candidate_facts
from .proposal_generator import generate_proposal
from .validator import validate_proposal
from .gaps import initialize_gaps, update_gaps_from_extracted, render_gaps
from .requirements_matrix import write_requirements_matrix
from .assumptions_ledger import init_assumptions_ledger, add_assumption
from .delta import apply_client_reply
from .redflags import scan_red_flags
from .traces import build_traces
from .brief_builder import build_project_brief
from .watcher import run_inbox_watcher


SESSIONS_DIR = Path("/workspace/upwork-sessions")
INBOX_DIR = Path("/workspace/upwork-inbox")
CONFIG_DIR = Path("/workspace/config")


def _ensure_dirs() -> None:
    SESSIONS_DIR.mkdir(parents=True, exist_ok=True)
    INBOX_DIR.mkdir(parents=True, exist_ok=True)
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)


def _read_stdin_or_file(file_path: str | None) -> str:
    if file_path:
        return Path(file_path).read_text(encoding="utf-8")
    if not sys.stdin.isatty():
        return sys.stdin.read()
    raise SystemExit("No input provided. Pass --file or pipe content to stdin.")


def _fingerprint(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]


def _new_session_dir(job_text: str) -> Path:
    ts = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    fp = _fingerprint(job_text)
    session_name = f"session-{ts}-{fp}"
    sd = SESSIONS_DIR / session_name
    sd.mkdir(parents=True, exist_ok=True)
    return sd


def _write_json(path: Path, data: Dict[str, Any]) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def _append_md(path: Path, content: str) -> None:
    with path.open("a", encoding="utf-8") as f:
        f.write(content)
        if not content.endswith("\n"):
            f.write("\n")


def cmd_start(args: argparse.Namespace) -> None:
    _ensure_dirs()
    job_text = _read_stdin_or_file(args.file)

    session_dir = _new_session_dir(job_text)
    (session_dir / "proposal_history").mkdir(exist_ok=True)

    # Persist raw inputs
    (session_dir / "job-post.txt").write_text(job_text, encoding="utf-8")
    _append_md(session_dir / "conversation-history.md", f"# Job Post\n\n{job_text}\n")

    # Extraction and domain routing
    extracted = extract_job_post(job_text)
    _write_json(session_dir / "extracted-info.json", extracted)
    domain_info = route_domain(extracted)
    _write_json(session_dir / "domain.json", domain_info)

    # Initialize gaps, requirements, assumptions
    gaps = initialize_gaps()
    gaps = update_gaps_from_extracted(gaps, extracted, domain_info)
    _write_json(session_dir / "gaps.json", gaps)
    write_requirements_matrix(session_dir, extracted, gaps)
    init_assumptions_ledger(session_dir)

    # Generate proposal (A = main)
    candidate_facts = load_candidate_facts(CONFIG_DIR)
    proposal, used_refs = generate_proposal(
        job_text=job_text,
        extracted=extracted,
        domain_info=domain_info,
        candidate_facts=candidate_facts,
        style_config_dir=CONFIG_DIR,
    )
    (session_dir / "proposal.md").write_text(proposal, encoding="utf-8")

    # Traces
    traces = build_traces(used_refs)
    _write_json(session_dir / "traces.json", traces)

    # Validator (blocking report stored regardless)
    report = validate_proposal(
        proposal_text=proposal,
        job_text=job_text,
        extracted=extracted,
        candidate_facts=candidate_facts,
    )
    _write_json(session_dir / "validation_report.json", report)

    # Red flags
    red = scan_red_flags(extracted, gaps)
    _write_json(session_dir / "redflags.json", red)

    # Optional A/B variants
    if args.ab and args.ab > 1:
        for i in range(1, args.ab + 1):
            variant, vrefs = generate_proposal(
                job_text=job_text,
                extracted=extracted,
                domain_info=domain_info,
                candidate_facts=candidate_facts,
                style_config_dir=CONFIG_DIR,
                variant=i,
            )
            vpath = session_dir / "proposal_history" / f"proposal_variant_{i}.md"
            vpath.write_text(variant, encoding="utf-8")

    print(str(session_dir))


def _resolve_session(path_arg: str | None) -> Path:
    if path_arg:
        p = Path(path_arg)
        if not p.exists():
            raise SystemExit(f"Session path not found: {p}")
        return p
    # default to most recent session
    sessions = sorted(SESSIONS_DIR.glob("session-*/"), key=os.path.getmtime)
    if not sessions:
        raise SystemExit("No sessions found.")
    return Path(sessions[-1])


def cmd_add(args: argparse.Namespace) -> None:
    _ensure_dirs()
    session_dir = _resolve_session(args.session)
    reply_text = _read_stdin_or_file(args.file)

    # Append reply
    _append_md(session_dir / "conversation-history.md", f"\n# Client Reply\n\n{reply_text}\n")
    job_text = (session_dir / "job-post.txt").read_text(encoding="utf-8")

    # Re-extract with combined context (simple approach: job post + reply)
    combined = job_text + "\n\n" + reply_text
    extracted = extract_job_post(combined)
    _write_json(session_dir / "extracted-info.json", extracted)

    # Update gaps and requirements
    domain_info = json.loads((session_dir / "domain.json").read_text(encoding="utf-8"))
    gaps = json.loads((session_dir / "gaps.json").read_text(encoding="utf-8"))
    gaps = apply_client_reply(gaps, reply_text)
    gaps = update_gaps_from_extracted(gaps, extracted, domain_info)
    _write_json(session_dir / "gaps.json", gaps)
    write_requirements_matrix(session_dir, extracted, gaps)

    # Regenerate proposal focused on deltas
    candidate_facts = load_candidate_facts(CONFIG_DIR)
    proposal, used_refs = generate_proposal(
        job_text=combined,
        extracted=extracted,
        domain_info=domain_info,
        candidate_facts=candidate_facts,
        style_config_dir=CONFIG_DIR,
    )
    (session_dir / "proposal.md").write_text(proposal, encoding="utf-8")
    traces = build_traces(used_refs)
    _write_json(session_dir / "traces.json", traces)

    report = validate_proposal(
        proposal_text=proposal,
        job_text=combined,
        extracted=extracted,
        candidate_facts=candidate_facts,
    )
    _write_json(session_dir / "validation_report.json", report)

    red = scan_red_flags(extracted, gaps)
    _write_json(session_dir / "redflags.json", red)

    print("reply processed")


def cmd_status(args: argparse.Namespace) -> None:
    session_dir = _resolve_session(args.session)
    extracted = json.loads((session_dir / "extracted-info.json").read_text(encoding="utf-8"))
    gaps = json.loads((session_dir / "gaps.json").read_text(encoding="utf-8"))
    report = json.loads((session_dir / "validation_report.json").read_text(encoding="utf-8"))
    open_gaps = len(gaps.get("open_gaps", []))
    print(json.dumps({
        "session": session_dir.name,
        "open_gaps": open_gaps,
        "extracted_keys": list(extracted.keys()),
        "validator_pass": report.get("pass", False),
    }, indent=2))


def cmd_gaps(args: argparse.Namespace) -> None:
    session_dir = _resolve_session(args.session)
    gaps = json.loads((session_dir / "gaps.json").read_text(encoding="utf-8"))
    print(render_gaps(gaps))


def cmd_draft(args: argparse.Namespace) -> None:
    session_dir = _resolve_session(args.session)
    job_text = (session_dir / "job-post.txt").read_text(encoding="utf-8")
    extracted = json.loads((session_dir / "extracted-info.json").read_text(encoding="utf-8"))
    domain_info = json.loads((session_dir / "domain.json").read_text(encoding="utf-8"))
    candidate_facts = load_candidate_facts(CONFIG_DIR)

    if args.ab and args.ab > 1:
        for i in range(1, args.ab + 1):
            variant, vrefs = generate_proposal(
                job_text=job_text,
                extracted=extracted,
                domain_info=domain_info,
                candidate_facts=candidate_facts,
                style_config_dir=CONFIG_DIR,
                variant=i,
            )
            vpath = session_dir / "proposal_history" / f"proposal_variant_{i}.md"
            vpath.write_text(variant, encoding="utf-8")
        print("variants generated")
        return

    proposal, used_refs = generate_proposal(
        job_text=job_text,
        extracted=extracted,
        domain_info=domain_info,
        candidate_facts=candidate_facts,
        style_config_dir=CONFIG_DIR,
    )
    (session_dir / "proposal.md").write_text(proposal, encoding="utf-8")
    traces = build_traces(used_refs)
    _write_json(session_dir / "traces.json", traces)
    print("draft updated")


def cmd_validate(args: argparse.Namespace) -> None:
    session_dir = _resolve_session(args.session)
    job_text = (session_dir / "job-post.txt").read_text(encoding="utf-8")
    extracted = json.loads((session_dir / "extracted-info.json").read_text(encoding="utf-8"))
    candidate_facts = load_candidate_facts(CONFIG_DIR)
    proposal = (session_dir / "proposal.md").read_text(encoding="utf-8")
    report = validate_proposal(proposal, job_text, extracted, candidate_facts)
    _write_json(session_dir / "validation_report.json", report)
    print(json.dumps(report, indent=2))


def cmd_redflags(args: argparse.Namespace) -> None:
    session_dir = _resolve_session(args.session)
    extracted = json.loads((session_dir / "extracted-info.json").read_text(encoding="utf-8"))
    gaps = json.loads((session_dir / "gaps.json").read_text(encoding="utf-8"))
    red = scan_red_flags(extracted, gaps)
    print(json.dumps(red, indent=2))


def cmd_traces(args: argparse.Namespace) -> None:
    session_dir = _resolve_session(args.session)
    traces = json.loads((session_dir / "traces.json").read_text(encoding="utf-8"))
    print(json.dumps(traces, indent=2))


def cmd_brief(args: argparse.Namespace) -> None:
    session_dir = _resolve_session(args.session)
    extracted = json.loads((session_dir / "extracted-info.json").read_text(encoding="utf-8"))
    gaps = json.loads((session_dir / "gaps.json").read_text(encoding="utf-8"))
    report = json.loads((session_dir / "validation_report.json").read_text(encoding="utf-8"))
    brief = build_project_brief(session_dir, extracted, gaps, report)
    (session_dir / "project-brief.md").write_text(brief, encoding="utf-8")
    print("brief generated")


def cmd_watch(args: argparse.Namespace) -> None:
    _ensure_dirs()
    run_inbox_watcher(INBOX_DIR, CONFIG_DIR)


def cmd_facts(args: argparse.Namespace) -> None:
    # Convenience - show where to edit facts
    print(str(CONFIG_DIR / "candidate-facts.yaml"))
    print(str(CONFIG_DIR / "candidate-facts.json"))


def cmd_tune(args: argparse.Namespace) -> None:
    style_path_json = CONFIG_DIR / "proposal-style.json"
    style = {}
    if style_path_json.exists():
        style = json.loads(style_path_json.read_text(encoding="utf-8"))
    if args.tone:
        style["tone"] = args.tone
    style_path_json.write_text(json.dumps(style, indent=2) + "\n", encoding="utf-8")
    print("style updated")


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="upwork", description="Upwork Proposal Automation")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("start", help="Start a new session from a job post")
    s.add_argument("--file", help="Path to job post text file", required=False)
    s.add_argument("--ab", type=int, help="Generate N variants", required=False)
    s.set_defaults(func=cmd_start)

    a = sub.add_parser("add", help="Add a client reply to current session")
    a.add_argument("--file", help="Path to reply text file", required=False)
    a.add_argument("--session", help="Session directory", required=False)
    a.set_defaults(func=cmd_add)

    st = sub.add_parser("status", help="Show session status")
    st.add_argument("--session", help="Session directory", required=False)
    st.set_defaults(func=cmd_status)

    g = sub.add_parser("gaps", help="Show open gaps")
    g.add_argument("--session", help="Session directory", required=False)
    g.set_defaults(func=cmd_gaps)

    d = sub.add_parser("draft", help="Regenerate proposal or variants")
    d.add_argument("--ab", type=int, help="Generate N variants", required=False)
    d.add_argument("--session", help="Session directory", required=False)
    d.set_defaults(func=cmd_draft)

    v = sub.add_parser("validate", help="Validate current draft")
    v.add_argument("--session", help="Session directory", required=False)
    v.set_defaults(func=cmd_validate)

    rf = sub.add_parser("redflags", help="Show risk scan")
    rf.add_argument("--session", help="Session directory", required=False)
    rf.set_defaults(func=cmd_redflags)

    tr = sub.add_parser("traces", help="Show claim to evidence mapping")
    tr.add_argument("--session", help="Session directory", required=False)
    tr.set_defaults(func=cmd_traces)

    br = sub.add_parser("brief", help="Generate final client brief")
    br.add_argument("--session", help="Session directory", required=False)
    br.set_defaults(func=cmd_brief)

    w = sub.add_parser("watch", help="Run inbox watcher")
    w.set_defaults(func=cmd_watch)

    f = sub.add_parser("facts", help="Show config paths for candidate facts")
    f.set_defaults(func=cmd_facts)

    t = sub.add_parser("tune", help="Adjust style settings")
    t.add_argument("--tone", choices=["auto", "plain", "technical"], required=False)
    t.set_defaults(func=cmd_tune)

    return p


def main(argv: List[str] | None = None) -> None:
    parser = build_parser()
    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()

