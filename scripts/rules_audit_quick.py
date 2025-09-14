#!/usr/bin/env python3
import re, sys
from pathlib import Path
import yaml

ROOT = Path(".cursor/rules/project-rules").resolve()
FM_SPLIT = re.compile(r"^---\s*$", re.M)
REQ_SECTIONS = ["AI Persona","Core Principle"]
PROTO_SECTIONS = ["Protocol","Requirements","Rules"]
EXAMPLES = ["Examples","Example"]
VALIDATION = ["Validation","Checks","Acceptance"]
BAD_COPY = ["Liquid Development Guidelines"]

def read_rule(p: Path):
    text = p.read_text(encoding="utf-8", errors="ignore")
    parts = FM_SPLIT.split(text)
    if len(parts) < 3:
        return None, None
    try:
        fm = yaml.safe_load(parts[1]) or {}
    except Exception:
        fm = {}
    body = parts[2]
    return fm, body

issues = []
overlaps = []
by_globs = {}
count = 0
for p in sorted(ROOT.rglob("*.mdc")):
    fm, body = read_rule(p)
    count += 1
    if fm is None:
        issues.append(("MALFORMED_FRONTMATTER", str(p)))
        continue
    desc = str(fm.get("description") or "")
    globs = fm.get("globs")
    if not globs:
        issues.append(("MISSING_GLOBS", str(p)))
    if "TAGS:" not in desc or "TRIGGERS:" not in desc or "SCOPE:" not in desc:
        issues.append(("DESCRIPTION_FORMAT", str(p)))
    if "alwaysApply" not in fm:
        issues.append(("MISSING_ALWAYS_APPLY", str(p)))
    scope = fm.get("scope")
    if scope and scope != "project-rules":
        issues.append(("SCOPE_NOT_PROJECT_RULES", f"{p} -> {scope}"))
    if globs is not None:
        key = str(globs)
        by_globs.setdefault(key, []).append(str(p))
    # body checks
    if not body or len(body.splitlines()) < 3:
        issues.append(("WEAK_BODY", str(p)))
    low = body.lower()
    for sec in REQ_SECTIONS:
        if sec.lower() not in low:
            issues.append((f"MISSING_SECTION:{sec}", str(p)))
    if not any(s.lower() in low for s in PROTO_SECTIONS):
        issues.append(("MISSING_SECTION:Protocol", str(p)))
    if not any(s.lower() in low for s in EXAMPLES):
        issues.append(("SUGGEST_ADD:Examples", str(p)))
    if not any(s.lower() in low for s in VALIDATION):
        issues.append(("SUGGEST_ADD:Validation", str(p)))
    for bad in BAD_COPY:
        if bad.lower() in low:
            issues.append(("CROSS_CONTENT:LIQUID", str(p)))

for k, lst in by_globs.items():
    if k != "None" and len(lst) > 1:
        overlaps.append((f"globs={k}", lst))

out = ROOT/"AUDIT_REPORT.md"
with out.open("w", encoding="utf-8") as f:
    f.write("# Project Rules Audit\n\n")
    f.write(f"Total rules: {count}\n")
    f.write(f"Issues: {len(issues)}\n")
    f.write(f"Potential overlaps: {len(overlaps)}\n\n")
    f.write("## Issues\n")
    for t, path in issues:
        f.write(f"- {t}: {path}\n")
    f.write("\n## Overlaps by globs\n")
    for k, lst in overlaps:
        f.write(f"- {k}\n")
        for p in lst:
            f.write(f"  - {p}\n")
print("SUMMARY:")
print(f"rules={count} issues={len(issues)} overlaps={len(overlaps)}")
for t, path in issues[:20]:
    print(f"- {t}: {path}")
