#!/usr/bin/env python3
import os, sys, re, json
from typing import Dict, List, Tuple, DefaultDict
from collections import defaultdict

RULES_ROOT = os.path.join('.cursor','rules')
REPORT_DIR = os.path.join('.cursor','tools','reports')

def iter_mdc(root: str) -> List[str]:
    out: List[str] = []
    for base, _, files in os.walk(root):
        for f in files:
            if f.lower().endswith('.mdc'):
                out.append(os.path.join(base, f))
    return out

def parse_frontmatter(content: str) -> Tuple[Dict[str,str], str]:
    if not content.startswith('---'):
        return {}, content
    parts = content.split('
')
    try:
        end_idx = None
        for i in range(1, min(len(parts), 200)):
            if parts[i].strip() == '---':
                end_idx = i
                break
        if end_idx is None:
            return {}, content
        header_lines = parts[1:end_idx]
        body = '
'.join(parts[end_idx+1:])
        meta: Dict[str,str] = {}
        for line in header_lines:
            if ':' in line:
                k, v = line.split(':', 1)
                meta[k.strip()] = v.strip().strip('"')
        return meta, body
    except Exception:
        return {}, content

def extract_triggers_and_scope(description: str) -> Tuple[List[str], str]:
    if not description:
        return [], ''
    triggers: List[str] = []
    scope = ''
    try:
        m_trg = re.search(r'TRIGGERS:\s*([^|]+)', description, flags=re.IGNORECASE)
        if m_trg:
            triggers = [t.strip() for t in m_trg.group(1).split(',') if t.strip()]
        m_scope = re.search(r'SCOPE:\s*([^|]+)', description, flags=re.IGNORECASE)
        if m_scope:
            scope = m_scope.group(1).strip()
    except Exception:
        pass
    return triggers, scope

def write_report(data: Dict[str, object]) -> None:
    try:
        os.makedirs(REPORT_DIR, exist_ok=True)
        with open(os.path.join(REPORT_DIR, 'rules_validation.json'), 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    except Exception:
        pass

def main() -> int:
    if not os.path.isdir(RULES_ROOT):
        print('[RULES] .cursor/rules not found; failing.')
        return 1
    files = iter_mdc(RULES_ROOT)
    if not files:
        print('[RULES] No .mdc rules found; failing.')
        return 1

    triggers_by_scope: DefaultDict[str, DefaultDict[str, List[str]]] = defaultdict(lambda: defaultdict(list))
    missing: List[str] = []
    missing_scope: List[str] = []

    for p in files:
        try:
            content = open(p, 'r', encoding='utf-8', errors='ignore').read()
        except Exception:
            missing.append(p)
            continue
        meta, _ = parse_frontmatter(content)
        desc = meta.get('description','')
        triggers, scope = extract_triggers_and_scope(desc)
        if not desc:
            print(f"[WARN] {p}: missing description frontmatter")
        if not scope:
            missing_scope.append(p)
            continue
        scope_key = scope.lower()
        for t in triggers:
            tkey = t.lower()
            triggers_by_scope[scope_key][tkey].append(p)

    duplicates_by_scope: Dict[str, Dict[str, List[str]]] = {}
    global_duplicates: Dict[str, List[str]] = {}

    # Build duplicates per scope and compute global duplicates (flattened) as warnings
    all_trigger_to_paths: DefaultDict[str, List[str]] = defaultdict(list)
    for scope_key, trig_map in triggers_by_scope.items():
        for tkey, paths in trig_map.items():
            if len(paths) > 1:
                duplicates_by_scope.setdefault(scope_key, {})[tkey] = paths
            all_trigger_to_paths[tkey].extend(paths)

    for tkey, paths in all_trigger_to_paths.items():
        if len(paths) > 1:
            global_duplicates[tkey] = paths

    if global_duplicates:
        print('[RULES] Global duplicate TRIGGERS detected (warning only):')
        for k, paths in global_duplicates.items():
            print(f"  - {k} ({len(paths)} occurrences)")

    if duplicates_by_scope:
        print('[RULES] Duplicate TRIGGERS detected within the same SCOPE (failing):')
        for scope_key, trig_map in duplicates_by_scope.items():
            print(f"  SCOPE: {scope_key}")
            for tkey, paths in trig_map.items():
                print(f"    - {tkey}:")
                for pp in paths:
                    print(f"      * {pp}")

    report_data = {
        'files_count': len(files),
        'scopes_count': len(triggers_by_scope),
        'triggers_by_scope': {k: {kk: len(vv) for kk, vv in v.items()} for k, v in triggers_by_scope.items()},
        'duplicates_by_scope': {k: list(v.keys()) for k, v in duplicates_by_scope.items()},
        'missing_scope_files': missing_scope,
        'missing_files': missing,
    }
    write_report(report_data)

    if duplicates_by_scope or missing or missing_scope:
        return 1
    print(f"[RULES] OK: {len(files)} rule files; scopes={len(triggers_by_scope)}; no intra-scope duplicates; all have SCOPE.")
    return 0

if __name__ == '__main__':
    sys.exit(main())
