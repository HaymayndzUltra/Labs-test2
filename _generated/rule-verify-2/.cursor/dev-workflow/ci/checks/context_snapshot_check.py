#!/usr/bin/env python3
import os
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
SNAP_DIR = os.path.join(ROOT, '.cursor', 'dev-workflow', 'snapshots')

def main():
    if not os.path.isdir(SNAP_DIR):
        print('no snapshots dir; failing context snapshot check')
        raise SystemExit(2)
    # require at least one snapshot file
    entries = [n for n in os.listdir(SNAP_DIR) if n.endswith('.json')]
    if not entries:
        print('no snapshot JSONs; failing context snapshot check')
        raise SystemExit(2)
    print('context_snapshot_check OK')

if __name__ == '__main__':
    main()

