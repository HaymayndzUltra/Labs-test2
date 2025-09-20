#!/usr/bin/env python3
import os
import sys
import json

def _root():
    for key in ('WORKSPACE','GITHUB_WORKSPACE','CURSOR_WORKSPACE'):
        v = os.getenv(key)
        if v and (os.path.exists(os.path.join(v,'.cursor')) or os.path.exists(os.path.join(v,'.git'))):
            return os.path.abspath(v)
    here = os.path.abspath(__file__)
    d = os.path.dirname(here)
    while True:
        if os.path.exists(os.path.join(d,'.cursor')) or os.path.exists(os.path.join(d,'.git')):
            return d
        nd = os.path.dirname(d)
        if nd == d:
            break
        d = nd
    return os.getcwd()

ROOT = _root()
WAIVER_DIR = os.path.join(ROOT, '.cursor', 'dev-workflow', 'waivers')

def main():
    # naive: if any file under waivers present with approved decision, pass; otherwise warn
    if not os.path.isdir(WAIVER_DIR):
        print('no waivers dir; failing F8 waiver check')
        raise SystemExit(2)
    found = False
    for fn in os.listdir(WAIVER_DIR):
        p = os.path.join(WAIVER_DIR, fn)
        if os.path.isfile(p):
            txt = open(p,'r',encoding='utf-8').read()
            # accept both markdown-style and plain text approvals
            if ('**Decision**: approved' in txt) or ('Decision: approved' in txt) or ('**Decision**: (approved' in txt):
                found = True
                break
    if found:
        print('f8_waiver_check OK')
        return
    print('no approved waivers found; failing F8 waiver check')
    raise SystemExit(2)

if __name__ == '__main__':
    main()

