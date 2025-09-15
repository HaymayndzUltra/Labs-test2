#!/usr/bin/env python3
import os
import re

ROOT = '/home/haymayndz/Labs-test2'
PR_DIR = os.path.join(ROOT, '.cursor', 'rules', 'project-rules')

fm_re = re.compile(r'^(---\n)(.*?\n)(---\n)', re.S)
desc_re = re.compile(r'description:\s*"([\s\S]*?)"', re.S)

def normalize_description(desc):
    parts = [p.strip() for p in desc.split('|')]
    out_parts = []
    seen = set()
    triggers_found = False
    for p in parts:
        up = p.upper()
        if up.startswith('TRIGGERS:'):
            triggers_found = True
            val = p.split(':',1)[1].strip()
            # split on commas/semicolons
            items = [t.strip() for t in re.split('[,;]', val) if t.strip()]
            dedup = []
            for it in items:
                if it.lower() not in seen:
                    dedup.append(it)
                    seen.add(it.lower())
            out_parts.append('TRIGGERS: ' + ','.join(dedup))
        elif up.startswith('SCOPE:'):
            # normalize scope to project-rules for project files
            out_parts.append('SCOPE: project-rules')
        else:
            out_parts.append(p)
    if not triggers_found:
        # ensure there's a TRIGGERS entry (empty)
        out_parts.insert(1, 'TRIGGERS:')
    return ' | '.join(out_parts)

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        txt = f.read()
    m = fm_re.search(txt)
    if not m:
        return False
    fm_block = m.group(2)
    dm = desc_re.search(fm_block)
    if not dm:
        return False
    desc = dm.group(1)
    new_desc = normalize_description(desc)
    new_fm_block = desc_re.sub('description: "' + new_desc + '"', fm_block, count=1)
    new_txt = txt[:m.start(2)] + new_fm_block + txt[m.end(2):]
    if new_txt != txt:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_txt)
        return True
    return False

def main():
    changed = 0
    checked = 0
    for root, dirs, files in os.walk(PR_DIR):
        for fn in files:
            if not fn.endswith('.mdc'):
                continue
            path = os.path.join(root, fn)
            checked += 1
            try:
                if process_file(path):
                    changed += 1
            except Exception as e:
                print('ERROR', path, e)
    print('Processed', checked, 'files, modified', changed)

if __name__ == '__main__':
    main()

