#!/usr/bin/env python3
import os
import re
import sys

ROOT = '/workspace'
MR_DIR = os.path.join(ROOT, '.cursor', 'rules', 'master-rules')
CR_DIR = os.path.join(ROOT, '.cursor', 'rules', 'common-rules')

FM_RE = re.compile(r'^(---\n)(.*?\n)(---\n)', re.S)
DESC_RE = re.compile(r'description:\s*"([\s\S]*?)"', re.S)
AA_RE = re.compile(r'\n(?:alwaysApply|alwaysapply):\s*(true|false)\s*\n', re.I)

def normalize_description(desc: str, scope_label: str) -> str:
    parts = [p.strip() for p in desc.split('|')]
    out_parts = []
    seen_keys = set()
    scope_set = False
    for p in parts:
        up = p.upper()
        if up.startswith('SCOPE:'):
            out_parts.append(f'SCOPE: {scope_label}')
            scope_set = True
            seen_keys.add('SCOPE')
        else:
            out_parts.append(p)
    if not scope_set:
        # Insert SCOPE after TAGS if present, else at beginning
        inserted = False
        for i, p in enumerate(out_parts):
            if p.upper().startswith('TAGS:'):
                out_parts.insert(i + 1, f'SCOPE: {scope_label}')
                inserted = True
                break
        if not inserted:
            out_parts.insert(0, f'SCOPE: {scope_label}')
    return ' | '.join(out_parts)

def process_file(path: str, scope_label: str, write: bool) -> bool:
    with open(path, 'r', encoding='utf-8') as f:
        txt = f.read()
    m = FM_RE.search(txt)
    if not m:
        return False
    fm_block = m.group(2)
    changed = False
    # description normalization
    dm = DESC_RE.search(fm_block)
    if dm:
        desc = dm.group(1)
        new_desc = normalize_description(desc, scope_label)
        if new_desc != desc:
            fm_block = DESC_RE.sub('description: "' + new_desc + '"', fm_block, count=1)
            changed = True
    # ensure alwaysApply present; if missing, default to false (non-invasive)
    if not AA_RE.search('\n' + fm_block if not fm_block.startswith('\n') else fm_block):
        # insert before closing --- of frontmatter
        fm_block = fm_block + 'alwaysApply: false\n'
        changed = True
    if changed and write:
        new_txt = txt[:m.start(2)] + fm_block + txt[m.end(2):]
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_txt)
    return changed

def main():
    write = '--write' in sys.argv
    targets = []
    for base, scope in [(MR_DIR, 'global'), (CR_DIR, 'common-rules')]:
        if os.path.isdir(base):
            for root, dirs, files in os.walk(base):
                for fn in files:
                    if fn.endswith('.mdc'):
                        targets.append((os.path.join(root, fn), scope))
    changed = []
    for path, scope in targets:
        try:
            if process_file(path, scope, write):
                changed.append(path)
        except Exception as e:
            print('ERROR', path, e)
    if changed:
        print(('Modified' if write else 'Would modify') + f' {len(changed)} files:')
        for p in changed:
            print(' -', p)
        # fail in dry-run mode
        if not write:
            sys.exit(2)
    else:
        print('No changes needed')

if __name__ == '__main__':
    main()

