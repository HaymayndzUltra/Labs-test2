#!/usr/bin/env python3
import os
import json
import uuid
import hashlib
from pathlib import Path

ROOT = Path('/workspace')
OUT = ROOT / '.cursor' / 'dev-workflow' / 'snapshots'
OUT.mkdir(parents=True, exist_ok=True)

def checksum(path):
    h = hashlib.sha1()
    with open(path,'rb') as f:
        while True:
            b = f.read(8192)
            if not b:
                break
            h.update(b)
    return h.hexdigest()

def gather_rules_manifest():
    rules_dir = ROOT / '.cursor' / 'rules'
    manifest = []
    for p in rules_dir.rglob('*.mdc'):
        manifest.append({'path':str(p.relative_to(ROOT)),'sha1':checksum(p)})
    return manifest

def main():
    snap = {
        'snapshot_id': 'snap-' + uuid.uuid4().hex[:8],
        'git_commit': os.getenv('GIT_COMMIT','unknown'),
        'rules_manifest': gather_rules_manifest()
    }
    out = OUT / (snap['snapshot_id'] + '.json')
    out.write_text(json.dumps(snap, indent=2), encoding='utf-8')
    print(str(out))

if __name__ == '__main__':
    main()

