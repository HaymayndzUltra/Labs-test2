#!/usr/bin/env python3
"""Automated Upwork job post intake orchestrator."""
from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import textwrap
import uuid
from dataclasses import asdict
from datetime import datetime
from hashlib import sha1
from pathlib import Path
import types
from typing import Dict, Iterable, List, Optional

ROOT_MARKERS = {".git", ".cursor"}
SESSION_PREFIX = "session-"
SNAPSHOT_SIGNER = "auto-jobpost-orchestrator"
DEFAULT_BUDGET = "medium"
DEFAULT_TIMELINE = "medium"
TOOL_DIR = Path(__file__).resolve().parent


def load_tool_module(module_name: str, filename: str):
    path = TOOL_DIR / filename
    if not path.exists():
        raise ImportError(f"Unable to locate {filename}")
    source = path.read_text(encoding="utf-8")
    if filename == "cached-context-discovery.py":
        source = source.replace("args.import", "getattr(args, 'import')")
    module = types.ModuleType(module_name)
    module.__file__ = str(path)
    sys.modules[module_name] = module
    exec(compile(source, str(path), "exec"), module.__dict__)
    return module


load_tool_module("context_cache_manager", "context-cache-manager.py")
_industry_module = load_tool_module("industry_pattern_recognition", "industry-pattern-recognition.py")
Industry = _industry_module.Industry
IndustryPatternRecognizer = _industry_module.IndustryPatternRecognizer

_cached_module = load_tool_module("cached_context_discovery", "cached-context-discovery.py")
CachedContextDiscovery = _cached_module.CachedContextDiscovery

_selector_module = load_tool_module("intelligent_tech_stack_selector", "intelligent-tech-stack-selector.py")
ComplianceRequirement = _selector_module.ComplianceRequirement
IndustryType = _selector_module.IndustryType
IntelligentTechStackSelector = _selector_module.IntelligentTechStackSelector
PerformanceTier = _selector_module.PerformanceTier
ScalabilityRequirement = _selector_module.ScalabilityRequirement


def find_repo_root(start: Optional[Path] = None) -> Path:
    path = start or Path.cwd()
    path = path.resolve()
    for candidate in [path, *path.parents]:
        if any((candidate / marker).exists() for marker in ROOT_MARKERS):
            return candidate
    return path


def read_job_post(path: Optional[Path]) -> str:
    if path:
        text = path.read_text(encoding="utf-8")
    else:
        print("Paste the job post text, then press Ctrl-D (Ctrl-Z on Windows) to finish:\n", file=sys.stderr)
        text = sys.stdin.read()
    text = text.strip()
    if not text:
        raise ValueError("No job post content provided")
    return text


def next_session_name(base: Path) -> str:
    existing = [p.name for p in base.iterdir() if p.is_dir() and p.name.startswith(SESSION_PREFIX)] if base.exists() else []
    numbers: List[int] = []
    for name in existing:
        try:
            numbers.append(int(name[len(SESSION_PREFIX) :]))
        except ValueError:
            continue
    next_index = max(numbers, default=0) + 1
    return f"{SESSION_PREFIX}{next_index:03d}"


def ensure_session_dir(base: Path, desired: Optional[str], overwrite: bool) -> Path:
    base.mkdir(parents=True, exist_ok=True)
    name = desired or next_session_name(base)
    session_dir = base / name
    if session_dir.exists():
        if not overwrite:
            raise FileExistsError(f"Session directory {session_dir} already exists; use --overwrite to replace it")
        shutil.rmtree(session_dir)
    session_dir.mkdir(parents=True, exist_ok=True)
    return session_dir


def gather_rules_manifest(root: Path) -> List[Dict[str, str]]:
    rules_dir = root / ".cursor" / "rules"
    manifest: List[Dict[str, str]] = []
    if not rules_dir.exists():
        return manifest
    for path in sorted(rules_dir.rglob("*.mdc")):
        manifest.append({
            "path": str(path.relative_to(root)),
            "sha1": file_checksum(path),
        })
    return manifest


def file_checksum(path: Path) -> str:
    h = sha1()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def read_readme_excerpt(root: Path, limit: int = 800) -> str:
    readme = root / "README.md"
    if not readme.exists():
        return ""
    text = readme.read_text(encoding="utf-8", errors="ignore")
    excerpt = textwrap.shorten(text, width=limit, placeholder="…")
    return excerpt


def gather_tech_fingerprint(root: Path) -> Dict[str, List[str]]:
    fingerprint: Dict[str, List[str]] = {}

    package_json = root / "package.json"
    if package_json.exists():
        try:
            data = json.loads(package_json.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            data = {}
        deps = sorted((data.get("dependencies") or {}).keys())
        dev_deps = sorted((data.get("devDependencies") or {}).keys())
        if deps:
            fingerprint["node_dependencies"] = deps
        if dev_deps:
            fingerprint["node_devDependencies"] = dev_deps

    requirements = root / "requirements.txt"
    if requirements.exists():
        packages: List[str] = []
        for line in requirements.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            packages.append(re.split(r"[<>=]", line)[0])
        if packages:
            fingerprint["python_requirements"] = sorted(set(packages))

    return fingerprint


def gather_dependency_fingerprint(root: Path) -> Dict[str, str]:
    candidates = [
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
        "poetry.lock",
        "Pipfile.lock",
        "requirements.txt",
        "package.json",
    ]
    result: Dict[str, str] = {}
    for name in candidates:
        path = root / name
        if path.exists():
            result[name] = file_checksum(path)
    return result


def infer_existing_tech(job_post: str) -> List[str]:
    tech_keywords = {
        "react",
        "next.js",
        "nextjs",
        "node",
        "node.js",
        "python",
        "django",
        "flask",
        "fastapi",
        "aws",
        "gcp",
        "azure",
        "postgres",
        "postgresql",
        "mysql",
        "mongodb",
        "graphql",
        "rest",
        "typescript",
        "javascript",
        "kubernetes",
        "docker",
        "redis",
        "rabbitmq",
        "kafka",
        "terraform",
        "react native",
        "flutter",
    }
    lowered = job_post.lower()
    found = {tech for tech in tech_keywords if tech in lowered}
    # Normalise some aliases
    normalised = set()
    for tech in found:
        if tech in {"nextjs", "next.js"}:
            normalised.add("nextjs")
        elif tech in {"node", "node.js"}:
            normalised.add("nodejs")
        elif tech in {"react native"}:
            normalised.add("react-native")
        else:
            normalised.add(tech.replace(" ", "-"))
    return sorted(normalised)


def infer_performance_tier(job_post: str) -> PerformanceTier:
    text = job_post.lower()
    if any(keyword in text for keyword in ["high performance", "low latency", "real-time", "mission critical"]):
        return PerformanceTier.HIGH_PERFORMANCE
    if any(keyword in text for keyword in ["enterprise", "regulatory", "global scale"]):
        return PerformanceTier.ENTERPRISE
    if any(keyword in text for keyword in ["prototype", "mvp", "proof of concept"]):
        return PerformanceTier.BASIC
    return PerformanceTier.STANDARD


def infer_scalability(job_post: str) -> ScalabilityRequirement:
    text = job_post.lower()
    if any(keyword in text for keyword in ["millions", "massive", "global audience", "planet scale"]):
        return ScalabilityRequirement.MASSIVE
    if any(keyword in text for keyword in ["hundreds of thousands", "scale", "auto scale", "enterprise"]):
        return ScalabilityRequirement.HIGH
    if any(keyword in text for keyword in ["prototype", "pilot", "beta"]):
        return ScalabilityRequirement.LOW
    return ScalabilityRequirement.MEDIUM


def infer_team_size(job_post: str) -> int:
    text = job_post.lower()
    if "solo" in text or "individual" in text:
        return 1
    if "small team" in text or "startup" in text:
        return 3
    if any(keyword in text for keyword in ["large team", "enterprise", "multi-team"]):
        return 8
    return 5


def infer_budget(job_post: str) -> str:
    text = job_post.lower()
    if "shoestring" in text or "budget" in text and "tight" in text:
        return "low"
    if "enterprise" in text or "long-term" in text:
        return "high"
    if "fixed price" in text or "hourly" in text:
        return DEFAULT_BUDGET
    return DEFAULT_BUDGET


def infer_timeline(job_post: str) -> str:
    text = job_post.lower()
    if any(keyword in text for keyword in ["urgent", "asap", "immediately", "tight deadline"]):
        return "short"
    if any(keyword in text for keyword in ["long-term", "multi-month", "phased"]):
        return "long"
    return DEFAULT_TIMELINE


def map_industry(industry: Industry) -> IndustryType:
    mapping = {
        Industry.HEALTHCARE: IndustryType.HEALTHCARE,
        Industry.FINANCE: IndustryType.FINANCE,
        Industry.ECOMMERCE: IndustryType.ECOMMERCE,
        Industry.ENTERPRISE: IndustryType.ENTERPRISE_SAAS,
        Industry.CONSUMER_MOBILE: IndustryType.GENERAL,
        Industry.UNKNOWN: IndustryType.GENERAL,
    }
    return mapping.get(industry, IndustryType.GENERAL)


def map_compliance(requirements: Iterable[str]) -> List[ComplianceRequirement]:
    mapping = {
        "HIPAA": ComplianceRequirement.HIPAA,
        "HITECH": ComplianceRequirement.HIPAA,
        "SOX": ComplianceRequirement.SOX,
        "PCI DSS": ComplianceRequirement.PCI_DSS,
        "PCI": ComplianceRequirement.PCI_DSS,
        "GDPR": ComplianceRequirement.GDPR,
        "CCPA": ComplianceRequirement.CCPA,
        "SOC2": ComplianceRequirement.SOC2,
        "SOC 2": ComplianceRequirement.SOC2,
        "ISO27001": ComplianceRequirement.ISO27001,
        "ISO 27001": ComplianceRequirement.ISO27001,
    }
    mapped: List[ComplianceRequirement] = []
    for requirement in requirements:
        req = requirement.strip().upper()
        for key, value in mapping.items():
            if key.upper() == req:
                mapped.append(value)
                break
    return sorted(set(mapped), key=lambda req: req.value)


def git_commit_sha(root: Path) -> str:
    try:
        return (
            subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=root, stderr=subprocess.DEVNULL)
            .decode("utf-8")
            .strip()
        )
    except (subprocess.CalledProcessError, FileNotFoundError):
        return "unknown"


def build_snapshot_bundle(
    root: Path,
    session_dir: Path,
    job_post: str,
    discovery: Dict[str, object],
    recognizer: IndustryPatternRecognizer,
) -> Dict[str, object]:
    snapshot_id = f"snap-{uuid.uuid4().hex[:12]}"
    bundle_dir = session_dir / "context_snapshot"
    bundle_dir.mkdir(parents=True, exist_ok=True)

    rules_manifest = gather_rules_manifest(root)
    tech_fingerprint = gather_tech_fingerprint(root)
    dependency_fingerprint = gather_dependency_fingerprint(root)
    readme_excerpt = read_readme_excerpt(root)

    (bundle_dir / "rules_manifest.json").write_text(
        json.dumps(rules_manifest, indent=2),
        encoding="utf-8",
    )
    (bundle_dir / "tech_fingerprint.json").write_text(
        json.dumps(tech_fingerprint, indent=2),
        encoding="utf-8",
    )
    (bundle_dir / "dependency_fingerprint.json").write_text(
        json.dumps(dependency_fingerprint, indent=2),
        encoding="utf-8",
    )
    (bundle_dir / "README_excerpt.md").write_text(readme_excerpt, encoding="utf-8")
    (bundle_dir / "context_discovery.json").write_text(
        json.dumps(discovery, indent=2),
        encoding="utf-8",
    )

    snapshot = {
        "snapshot_id": snapshot_id,
        "git_commit": git_commit_sha(root),
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "signed_by": SNAPSHOT_SIGNER,
        "job_post_digest": sha1(job_post.encode("utf-8")).hexdigest(),
        "rules_manifest": "rules_manifest.json",
        "tech_fingerprint": "tech_fingerprint.json",
        "dependency_fingerprint": "dependency_fingerprint.json",
        "readme_excerpt": "README_excerpt.md",
        "context_discovery": "context_discovery.json",
        "industry": discovery.get("industry"),
        "confidence": discovery.get("confidence"),
        "activated_rules": discovery.get("activated_rules"),
        "compliance_requirements": discovery.get("compliance_requirements"),
        "recommended_tech_stack": discovery.get("tech_stack"),
    }

    (bundle_dir / "snapshot.json").write_text(
        json.dumps(snapshot, indent=2),
        encoding="utf-8",
    )
    return snapshot


def summarise_for_brief(
    session_dir: Path,
    job_post: str,
    discovery: Dict[str, object],
    recommendation: Dict[str, object],
) -> str:
    headline = job_post.splitlines()[0][:140] if job_post else "Job post"
    industry = discovery.get("industry", "unknown")
    compliance = discovery.get("compliance_requirements") or []
    stack = recommendation.get("recommendation", {})
    frontend = [comp.get("name") for comp in stack.get("frontend", [])]
    backend = [comp.get("name") for comp in stack.get("backend", [])]
    lines = [
        f"## Intake {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}",
        f"**Job headline:** {headline}",
        f"**Detected industry:** {industry}",
    ]
    if compliance:
        lines.append("**Compliance considerations:** " + ", ".join(compliance))
    if frontend or backend:
        lines.append(
            "**Stack leads:** "
            + ", ".join(frontend[:2] + backend[:2])
        )
    lines.append("")
    brief_path = session_dir / "project-brief.md"
    with brief_path.open("a", encoding="utf-8") as handle:
        handle.write("\n".join(lines).strip() + "\n\n")
    return str(brief_path)


def write_selection(session_dir: Path, selection: Dict[str, object]) -> Path:
    path = session_dir / "selection.json"
    path.write_text(json.dumps(selection, indent=2), encoding="utf-8")
    return path


def ensure_contract_files(session_dir: Path, job_post: str) -> None:
    job_path = session_dir / "job-post.txt"
    job_path.write_text(job_post, encoding="utf-8")

    (session_dir / "conversation-history.md").touch()

    extracted_path = session_dir / "extracted-info.json"
    if not extracted_path.exists():
        extracted_path.write_text(json.dumps({"notes": []}, indent=2), encoding="utf-8")

    proposal_path = session_dir / "initial-proposal.md"
    if not proposal_path.exists():
        proposal_path.write_text("", encoding="utf-8")



def orchestrate(job_post_path: Optional[Path], session_id: Optional[str], overwrite: bool, force_refresh: bool) -> Dict[str, object]:
    root = find_repo_root()
    job_post = read_job_post(job_post_path)

    sessions_root = root / "upwork-sessions"
    session_dir = ensure_session_dir(sessions_root, session_id, overwrite)
    ensure_contract_files(session_dir, job_post)

    cached = CachedContextDiscovery(str(root))
    try:
        discovery = cached.discover_context(job_post, force_refresh=force_refresh)
        recognizer = cached.industry_recognizer
        industry_enum = recognizer.detected_industry if recognizer.detected_industry else Industry.UNKNOWN
    finally:
        cached.shutdown()

    industry_type = map_industry(industry_enum)
    config = recognizer.generate_rule_activation_config()
    compliance_enums = map_compliance(config.get("compliance_requirements", []))

    selector = IntelligentTechStackSelector()
    performance_tier = infer_performance_tier(job_post)
    scalability = infer_scalability(job_post)
    team_size = infer_team_size(job_post)
    budget = infer_budget(job_post)
    timeline = infer_timeline(job_post)
    existing_tech = infer_existing_tech(job_post)

    recommendation = selector.select_tech_stack(
        industry=industry_type,
        compliance=compliance_enums,
        performance_tier=performance_tier,
        scalability=scalability,
        team_size=team_size,
        budget=budget,
        timeline=timeline,
        existing_tech=existing_tech or None,
    )

    selection_payload = {
        "session": session_dir.name,
        "industry": industry_type.value,
        "confidence": discovery.get("confidence"),
        "compliance": [req.value for req in compliance_enums],
        "performance_tier": performance_tier.value,
        "scalability": scalability.value,
        "team_size": team_size,
        "budget": budget,
        "timeline": timeline,
        "existing_tech_signals": existing_tech,
        "recommendation": {
            "frontend": [asdict(component) for component in recommendation.frontend],
            "backend": [asdict(component) for component in recommendation.backend],
            "database": [asdict(component) for component in recommendation.database],
            "cache": [asdict(component) for component in recommendation.cache],
            "message_queue": [asdict(component) for component in recommendation.message_queue],
            "search": [asdict(component) for component in recommendation.search],
            "monitoring": [asdict(component) for component in recommendation.monitoring],
            "security": [asdict(component) for component in recommendation.security],
            "deployment": [asdict(component) for component in recommendation.deployment],
        },
        "scores": {
            "overall": recommendation.overall_score,
            "compliance": recommendation.compliance_score,
            "performance": recommendation.performance_score,
            "scalability": recommendation.scalability_score,
            "cost_estimate": recommendation.cost_estimate,
            "complexity_level": recommendation.complexity_level,
        },
        "recommended_for": recommendation.recommended_for,
    }

    selection_path = write_selection(session_dir, selection_payload)
    snapshot = build_snapshot_bundle(root, session_dir, job_post, discovery, recognizer)
    brief_path = summarise_for_brief(session_dir, job_post, discovery, selection_payload)

    return {
        "session_dir": str(session_dir),
        "selection": str(selection_path),
        "snapshot": str(session_dir / "context_snapshot" / "snapshot.json"),
        "project_brief": brief_path,
    }


def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Automate Upwork job post intake")
    parser.add_argument("--job-post-file", type=Path, help="File containing the job post to ingest")
    parser.add_argument("--session-id", help="Explicit session directory name (defaults to next sequential session-XXX)")
    parser.add_argument("--overwrite", action="store_true", help="Allow reusing an existing session directory")
    parser.add_argument("--force-refresh", action="store_true", help="Force context discovery cache refresh")
    return parser.parse_args(argv)


def main(argv: Optional[List[str]] = None) -> None:
    args = parse_args(argv)
    try:
        result = orchestrate(args.job_post_file, args.session_id, args.overwrite, args.force_refresh)
    except Exception as exc:  # pragma: no cover - surfaced to CLI
        print(f"[auto-jobpost-intake] ERROR: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
