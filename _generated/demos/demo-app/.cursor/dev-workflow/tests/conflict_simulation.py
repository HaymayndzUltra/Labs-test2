#!/usr/bin/env python3
import json
from pathlib import Path
ROOT = Path('/workspace')

def simulate_conflict():
    # Two dummy policies with conflicting actions but different priorities
    p1 = {'name':'p-high','priority':10,'actions':['do-A'],'conditions':['featureX']}
    p2 = {'name':'p-low','priority':1,'actions':['do-B'],'conditions':['featureX']}
    policies = [p1,p2]
    # naive decision: pick highest priority
    winner = sorted(policies, key=lambda x: x['priority'], reverse=True)[0]
    out = {'winner':winner['name'],'expected':'p-high'}
    print(json.dumps(out, indent=2))

if __name__ == '__main__':
    simulate_conflict()

