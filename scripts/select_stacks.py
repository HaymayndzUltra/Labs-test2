#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple


# -----------------------------
# Utility: markdown summarization
# -----------------------------

SUMMARY_REPLACEMENTS = {
    "PROJECT_NAME": "Project",
}


def _read_text(path: Path) -> Optional[str]:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        return None


def _replace_tokens(text: str, replacements: Dict[str, str]) -> str:
    for token, value in replacements.items():
        text = text.replace(f"{{{{{token}}}}}", value)
    return text


def _find_readme(base: Path) -> Optional[Path]:
    candidates = [
        base / "README.summary.md",
        base / "README.md",
        base.parent / "README.summary.md",
        base.parent / "README.md",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def _extract_paragraph(text: str) -> str:
    lines = text.splitlines()
    paragraph: List[str] = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if paragraph:
                break
            continue
        if stripped.startswith("#"):
            # Skip headings at the top of the file
            if not paragraph:
                continue
            break
        if stripped.startswith("-") and not paragraph:
            # Avoid leading bullet lists being treated as summary
            continue
        if stripped.startswith("##"):
            break
        paragraph.append(stripped)
    return " ".join(paragraph).strip()


def _extract_features(text: str, limit: int = 3) -> List[str]:
    lines = text.splitlines()
    features: List[str] = []
    collecting = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("##"):
            collecting = stripped.lower().startswith("## features")
            continue
        if collecting:
            if not stripped or stripped.startswith("#"):
                if features:
                    break
                continue
            if stripped.startswith("-"):
                features.append(stripped)
                if len(features) >= limit:
                    break
            else:
                if features:
                    break
    return features


def _summarize_template(base: Path, replacements: Dict[str, str]) -> str:
    readme = _find_readme(base)
    if not readme:
        return f"No README found for template at {base}."
    raw = _read_text(readme)
    if not raw:
        return f"Unable to read README for template at {base}."
    text = _replace_tokens(raw, replacements)
    paragraph = _extract_paragraph(text)
    features = _extract_features(text)
    summary_parts: List[str] = []
    if paragraph:
        summary_parts.append(paragraph)
    if features:
        summary_parts.append("Key features:\n" + "\n".join(features))
    return "\n\n".join(summary_parts).strip() or f"README for {base} did not contain descriptive text."


def _write_summary_file(path: Path, title: str, content: str) -> None:
    normalized = content.strip() if content else ""
    if not normalized:
        normalized = "Summary unavailable."
    path.write_text(f"# {title}\n\n{normalized}\n", encoding="utf-8")


def _excerpt(text: str, limit: int = 220) -> str:
    if not text:
        return ""
    first_block = text.split("\n\n", 1)[0]
    cleaned = " ".join(first_block.strip().split())
    if len(cleaned) > limit:
        return cleaned[: limit - 1].rstrip() + "…"
    return cleaned


# -----------------------------
# Utility: versions & semver-ish
# -----------------------------

_RE_VERSION = re.compile(r"(\d+)(?:\.(\d+))?(?:\.(\d+))?")


def _parse_version_raw(text: str) -> Tuple[int, int, int]:
    if not text:
        return (0, 0, 0)
    text = text.strip().lower().lstrip("v")
    m = _RE_VERSION.search(text)
    if not m:
        return (0, 0, 0)
    major = int(m.group(1) or 0)
    minor = int(m.group(2) or 0)
    patch = int(m.group(3) or 0)
    return (major, minor, patch)


def _cmp_version(a: Tuple[int, int, int], b: Tuple[int, int, int]) -> int:
    return (a > b) - (a < b)


def _parse_requirement(req: str) -> Tuple[str, Tuple[int, int, int]]:
    # Supports strings like ">=20", ">=20.10.0"
    if not req:
        return (">=", (0, 0, 0))
    req = req.strip()
    if req.startswith(">="):
        op = ">="
        ver = req[2:].strip()
    elif req.startswith(">"):
        op = ">"
        ver = req[1:].strip()
    elif req.startswith("=="):
        op = "=="
        ver = req[2:].strip()
    else:
        # default to >= when bare version given
        op = ">="
        ver = req
    return (op, _parse_version_raw(ver))


def _satisfies(current: Tuple[int, int, int], op: str, req_v: Tuple[int, int, int]) -> bool:
    cmp = _cmp_version(current, req_v)
    if op == ">=":
        return cmp >= 0
    if op == ">":
        return cmp > 0
    if op == "==":
        return cmp == 0
    # Fallback to >=
    return cmp >= 0


def _max_requirement(a: str, b: str) -> str:
    # choose stricter (higher) when ops are >=; else prefer a
    op_a, ver_a = _parse_requirement(a)
    op_b, ver_b = _parse_requirement(b)
    if op_a == op_b == ">=":
        return a if _cmp_version(ver_a, ver_b) >= 0 else b
    # Non-standard ops: keep a
    return a


# -----------------------------
# Discovery & selection
# -----------------------------

ROOT = Path(__file__).resolve().parent.parent
TPL_ROOT = ROOT / "template-packs"


def _read_json(p: Path) -> Dict:
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _manifest_for(kind: str, tech: str) -> Dict:
    mp = TPL_ROOT / kind / tech / "template.manifest.json"
    return _read_json(mp) if mp.exists() else {}


def _pkg_engines_node_for_frontend(tech: str) -> Optional[str]:
    pkg = TPL_ROOT / "frontend" / tech / "base" / "package.json"
    if not pkg.exists():
        return None
    try:
        data = json.loads(pkg.read_text(encoding="utf-8"))
        engines = data.get("engines", {})
        node_req = engines.get("node")
        if isinstance(node_req, str):
            return node_req
    except Exception:
        return None
    return None


def _current_versions() -> Dict[str, str]:
    versions: Dict[str, str] = {}

    def run(cmd: List[str]) -> Optional[str]:
        try:
            out = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True)
            return out.strip()
        except Exception:
            return None

    versions["node"] = run(["node", "--version"]) or ""
    versions["python"] = run(["python3", "--version"]) or run(["python", "--version"]) or ""
    versions["go"] = run(["go", "version"]) or ""
    versions["docker"] = run(["docker", "--version"]) or ""
    return versions


@dataclass
class Selection:
    requested: str
    variant_requested: str
    chosen: str
    variant: str
    downgrade_reason: Optional[str] = None


def main() -> int:
    ap = argparse.ArgumentParser(description="Preflight stack selection & engine checks")
    ap.add_argument("--industry", required=True)
    ap.add_argument("--project-type", dest="project_type", required=True)
    ap.add_argument("--frontend", required=True)
    ap.add_argument("--backend", required=True)
    ap.add_argument("--database", required=True)
    ap.add_argument("--nestjs-orm", dest="nestjs_orm", choices=["typeorm", "prisma"], default="typeorm")
    ap.add_argument("--compliance", default="")
    ap.add_argument("--output", default="selection.json")
    ap.add_argument("--summary", default=str(Path("evidence") / "stack-selection.md"))
    # Optional explicit engine versions (overrides auto-detect)
    ap.add_argument("--node")
    ap.add_argument("--python")
    ap.add_argument("--go")
    ap.add_argument("--docker")
    args = ap.parse_args()

    # Validate requested tech exists
    missing: List[str] = []
    for kind, tech in [("frontend", args.frontend), ("backend", args.backend), ("database", args.database)]:
        if not (TPL_ROOT / kind / tech).exists():
            missing.append(f"template-packs/{kind}/{tech}")
    if missing:
        print("[SELECTION] Missing template technologies:\n - " + "\n - ".join(missing))
        return 2

    # Variant preference (replicates generator logic)
    enterprise_inds = {"healthcare", "finance", "enterprise"}
    fe_variant_req = "enterprise" if args.industry in enterprise_inds else "base"

    if args.backend == "nestjs" and args.nestjs_orm == "prisma":
        be_variant_req = "prisma"
    else:
        be_variant_req = "microservice" if args.project_type == "microservices" else "base"
        if args.industry in enterprise_inds:
            be_variant_req = "enterprise"

    # Resolve chosen variants with explicit downgrade warnings
    warnings: List[str] = []

    # Frontend
    fe_dir = TPL_ROOT / "frontend" / args.frontend
    fe_variant = fe_variant_req
    if not (fe_dir / fe_variant).exists():
        if (fe_dir / "base").exists():
            warnings.append(f"Downgraded frontend {args.frontend} {fe_variant_req} → base")
            fe_variant = "base"
        else:
            print(f"[SELECTION] Frontend pack missing base folder: {fe_dir}/base")
            return 2

    # Backend
    be_dir = TPL_ROOT / "backend" / args.backend
    be_variant = be_variant_req
    if args.backend == "nestjs" and args.nestjs_orm == "prisma":
        if not (be_dir / "prisma").exists():
            if (be_dir / "base").exists():
                warnings.append("Downgraded backend nestjs prisma → base")
                be_variant = "base"
            else:
                print(f"[SELECTION] Backend pack missing base folder: {be_dir}/base")
                return 2
    else:
        if not (be_dir / be_variant).exists():
            if (be_dir / "base").exists():
                warnings.append(f"Downgraded backend {args.backend} {be_variant_req} → base")
                be_variant = "base"
            else:
                print(f"[SELECTION] Backend pack missing base folder: {be_dir}/base")
                return 2

    # Database
    db_dir = TPL_ROOT / "database" / args.database
    if not (db_dir / "base").exists():
        print(f"[SELECTION] Database pack missing base folder: {db_dir}/base")
        return 2

    # Engine requirements: manifests + stricter from pack files
    required: Dict[str, str] = {}
    for kind, tech in [("frontend", args.frontend), ("backend", args.backend), ("database", args.database)]:
        man = _manifest_for(kind, tech)
        engines = man.get("engines", {}) if isinstance(man, dict) else {}
        for eng, req in engines.items():
            if isinstance(req, str):
                prev = required.get(eng)
                required[eng] = _max_requirement(prev, req) if prev else req

    # Stricter node from frontend package.json engines
    node_pkg_req = _pkg_engines_node_for_frontend(args.frontend)
    if node_pkg_req:
        prev = required.get("node")
        required["node"] = _max_requirement(prev, node_pkg_req) if prev else node_pkg_req

    # Current versions
    current = _current_versions()
    if args.node:
        current["node"] = args.node
    if args.python:
        current["python"] = args.python
    if args.go:
        current["go"] = args.go
    if args.docker:
        current["docker"] = args.docker

    engine_checks: List[Dict[str, object]] = []
    unmet = False
    for eng, req in required.items():
        op, rv = _parse_requirement(req)
        cv = _parse_version_raw(current.get(eng, ""))
        ok = _satisfies(cv, op, rv)
        engine_checks.append({
            "engine": eng,
            "required": req,
            "current": current.get(eng, ""),
            "ok": ok,
        })
        if not ok:
            unmet = True

    compliance = [s for s in (args.compliance.split(",") if args.compliance else []) if s]

    replacements = dict(SUMMARY_REPLACEMENTS)
    replacements.update(
        {
            "INDUSTRY": args.industry,
            "PROJECT_TYPE": args.project_type,
        }
    )
    replacements.setdefault("COMPLIANCE", ", ".join(compliance) if compliance else "standard")

    ui_summary = _summarize_template(fe_dir / fe_variant, replacements)
    api_summary = _summarize_template(be_dir / be_variant, replacements)
    db_summary = _summarize_template(db_dir / "base", replacements)

    out = {
        "frontend": Selection(
            requested=args.frontend,
            variant_requested=fe_variant_req,
            chosen=args.frontend,
            variant=fe_variant,
            downgrade_reason=(warnings[0] if warnings and warnings[0].startswith("Downgraded frontend") else None),
        ).__dict__,
        "backend": Selection(
            requested=args.backend,
            variant_requested=be_variant_req,
            chosen=args.backend,
            variant=be_variant,
            downgrade_reason=(next((w for w in warnings if w.startswith("Downgraded backend")), None)),
        ).__dict__,
        "database": {"requested": args.database, "variant": "base"},
        "compliance": compliance,
        "engine_checks": engine_checks,
        "warnings": warnings,
        "status": "ok" if not unmet else "engine_unmet",
        "summaries": {
            "ui": {
                "path": str(Path(args.summary).parent / "ui-summary.md"),
                "summary": ui_summary,
            },
            "api": {
                "path": str(Path(args.summary).parent / "api-summary.md"),
                "summary": api_summary,
            },
            "database": {
                "path": str(Path(args.summary).parent / "database-summary.md"),
                "summary": db_summary,
            },
        },
    }

    # Write outputs
    sel_path = Path(args.output)
    sel_path.parent.mkdir(parents=True, exist_ok=True)
    sel_path.write_text(json.dumps(out, indent=2), encoding="utf-8")

    md_path = Path(args.summary)
    evidence_dir = md_path.parent
    evidence_dir.mkdir(parents=True, exist_ok=True)

    ui_summary_path = evidence_dir / "ui-summary.md"
    api_summary_path = evidence_dir / "api-summary.md"
    db_summary_path = evidence_dir / "database-summary.md"

    _write_summary_file(ui_summary_path, "UI Summary", ui_summary)
    _write_summary_file(api_summary_path, "API Summary", api_summary)
    _write_summary_file(db_summary_path, "Database Summary", db_summary)

    lines: List[str] = []
    lines.append("# Stack Selection (Preflight)\n")
    lines.append("| Layer | Requested | Variant Req. | Chosen | Variant | Note |\n")
    lines.append("|---|---|---|---|---|---|\n")
    fe_note = out["frontend"].get("downgrade_reason") or ""
    be_note = out["backend"].get("downgrade_reason") or ""
    lines.append(f"| Frontend | {args.frontend} | {fe_variant_req} | {args.frontend} | {fe_variant} | {fe_note} |\n")
    lines.append(f"| Backend | {args.backend} | {be_variant_req} | {args.backend} | {be_variant} | {be_note} |\n")
    lines.append(f"| Database | {args.database} | base | {args.database} | base |  |\n")
    if compliance:
        lines.append(f"| Compliance | {', '.join(compliance)} | — | {', '.join(compliance)} | overlay | rule-based overlay |\n")
    lines.append("\n## Engine Checks\n")
    for chk in engine_checks:
        lines.append(f"- {chk['engine']}: required {chk['required']}, current {chk['current']} → {'OK' if chk['ok'] else 'FAIL'}\n")
    if warnings:
        lines.append("\n## Warnings\n")
        for w in warnings:
            lines.append(f"- {w}\n")
    lines.append("\n## Layer Summaries\n")
    lines.append(f"- **UI**: {_excerpt(ui_summary)} ([details]({ui_summary_path.name}))\n")
    lines.append(f"- **API**: {_excerpt(api_summary)} ([details]({api_summary_path.name}))\n")
    lines.append(f"- **Database**: {_excerpt(db_summary)} ([details]({db_summary_path.name}))\n")
    md_path.write_text("".join(lines), encoding="utf-8")

    if unmet:
        print("[SELECTION] Engine requirements not met. See:", md_path)
        return 3

    print("[SELECTION] OK. Summary:", md_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

