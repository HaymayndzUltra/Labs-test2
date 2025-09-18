#!/usr/bin/env python3
import os, sys, re
from typing import Dict, List, Tuple
RULES_ROOT = os.path.join('.cursor','rules')
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
        # find closing '---' after first line
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
    # Example: TAGS: [...] | TRIGGERS: a,b,c | SCOPE: myproj | DESCRIPTION: ...
    triggers = []
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
def main() -> int:
    if not os.path.isdir(RULES_ROOT):
        print('[RULES] .cursor/rules not found; failing.')
        return 1
    files = iter_mdc(RULES_ROOT)
    if not files:
        print('[RULES] No .mdc rules found; failing.')
        return 1
    trigger_map: Dict[str, List[str]] = {}
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
        for t in triggers:
            key = t.lower()
            trigger_map.setdefault(key, []).append(p)
    duplicates = {k:v for k,v in trigger_map.items() if len(v) > 1}
    if duplicates:
        print('[RULES] Duplicate TRIGGERS detected:')
        for k, paths in duplicates.items():
            print(f"  - {k}:")
            for pp in paths:
                print(f"    * {pp}")
    if missing_scope:
        print('[RULES] Files missing SCOPE in description:')
        for p in missing_scope:
            print(f"  - {p}")
    if duplicates or missing or missing_scope:
        return 1
    print(f"[RULES] OK: {len(files)} rule files; {len(trigger_map)} triggers; no duplicates; all have SCOPE.")
    return 0
if __name__ == '__main__':
    sys.exit(main())
