#!/usr/bin/env python3
import json, os, sys
proj_json = os.path.join('.cursor','project.json')
if not os.path.exists(proj_json):
    print('[COMPLIANCE] project.json missing; skipping.'); sys.exit(0)
cfg = json.load(open(proj_json))
req = set((cfg.get('compliance') or []))
missing = [c for c in req if not os.path.exists(os.path.join('.cursor','rules', f'industry-compliance-{c}.mdc'))]
if missing:
    print('[COMPLIANCE] Missing compliance rules:', ', '.join(missing))
    sys.exit(1)
print('[COMPLIANCE] All required compliance rules present.')
